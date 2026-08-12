import { Head, Link } from '@inertiajs/react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle, Loader2, Maximize, AlertCircle, XCircle, Sun, Moon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { attendance, embeddings } from '@/routes/admin/scanner';

// Note: import.meta.env.BASE_URL compiles to '/build/' in production (the asset base),
// so static app paths like /models must stay root-relative - do NOT prefix them with BASE_URL.
const parseJsonResponse = async (response: Response): Promise<unknown> => {
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(`Unexpected response from ${response.url} (HTTP ${response.status}). Expected JSON.`);
    }
};

// Type definitions
type FaceEmbedding = {
    id: number;
    embedding_data: number[];
    user: {
        id: number;
        name: string;
        avatar: string | null;
        classroom: {
            name: string;
            major: { name: string; code: string };
        } | null;
    };
};

type LogEntry = {
    id: string;
    time: string;
    user: FaceEmbedding['user'];
    status: 'success' | 'already' | 'error';
    message: string;
};

export default function FaceScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [statusText, setStatusText] = useState('Initializing Scanner...');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [theme, setTheme] = useState<'dark'|'light'>('light');
    
    // To prevent spamming the backend for the same person standing in front
    const lastRecognizedRef = useRef<{ [key: string]: number }>({});
    const logsRef = useRef<LogEntry[]>([]);
    const detectLoopIdRef = useRef<number>(0);
    
    useEffect(() => {
        logsRef.current = logs;
    }, [logs]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(d => d.kind === 'videoinput');
                setDevices(videoDevices);
            })
            .catch(err => console.error("Error enumerating devices", err));
    }, []);

    useEffect(() => {
        const loadFaceModel = async (modelName: string): Promise<void> => {
            const manifestUrl = `/models/${modelName}-weights_manifest.json`;
            const response = await fetch(manifestUrl);
            const body = await response.text();

            try {
                JSON.parse(body);
            } catch {
                throw new Error(`Face model files missing at ${manifestUrl} (HTTP ${response.status}). Re-upload the public/models folder.`);
            }
        };

        const initializeScanner = async () => {
            try {
                // 1. Load models
                setStatusText('Loading AI Models...');
                await Promise.all([
                    loadFaceModel('ssd_mobilenetv1_model').then(() => faceapi.nets.ssdMobilenetv1.loadFromUri('/models')),
                    loadFaceModel('face_landmark_68_model').then(() => faceapi.nets.faceLandmark68Net.loadFromUri('/models')),
                    loadFaceModel('face_recognition_model').then(() => faceapi.nets.faceRecognitionNet.loadFromUri('/models'))
                ]);

                // 2. Fetch all embeddings
                setStatusText('Syncing Biometric Data...');
                const response = await fetch(embeddings.url(), {
                    headers: { Accept: 'application/json' }
                });

                if (response.redirected) {
                    throw new Error(`Redirected to ${response.url}. Session may have expired - please log in again and retry.`);
                }

                if (!response.ok) {
                    const detail = await response.text().catch(() => '');

                    throw new Error(`Failed to sync biometric data: ${embeddings.url()} returned HTTP ${response.status}. ${detail.slice(0, 120)}`);
                }

                const parsed = (await parseJsonResponse(response)) as unknown;

                if (!Array.isArray(parsed)) {
                    throw new Error(`Unexpected data from ${embeddings.url()}: expected a JSON array.`);
                }

                const embeddingsData = parsed as FaceEmbedding[];

                if (embeddingsData.length === 0) {
                    setStatusText('No enrolled students found. Scanner active, but cannot recognize anyone.');
                } else {
                    // Create LabeledFaceDescriptors
                    const labeledDescriptors = embeddingsData.map(data => {
                        let descriptorsArray: Float32Array[];
                        
                        // Check if embedding_data is an array of arrays (multiple poses) or flat array (single pose)
                        if (Array.isArray(data.embedding_data[0])) {
                            descriptorsArray = (data.embedding_data as unknown as number[][]).map(arr => new Float32Array(arr));
                        } else {
                            descriptorsArray = [new Float32Array(data.embedding_data)];
                        }
                        
                        // We store JSON string in label to quickly parse user info later
                        return new faceapi.LabeledFaceDescriptors(JSON.stringify(data.user), descriptorsArray);
                    });
                    
                    // Increase threshold to 0.55 for better matching rate
                    const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
                    setFaceMatcher(matcher);
                    setStatusText(`Synced ${embeddingsData.length} enrolled faces.`);
                }

                // 3. Start Camera
                startCamera();

            } catch (err) {
                console.error("Scanner init error", err);
                setStatusText(`Failed to initialize: ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        initializeScanner();
    }, []);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            detectLoopIdRef.current++; // kill detection loop

            if (videoRef.current && videoRef.current.srcObject) {
                const s = videoRef.current.srcObject as MediaStream;
                s.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async (deviceId?: string) => {
        try {
            if (videoRef.current && videoRef.current.srcObject) {
                const existingStream = videoRef.current.srcObject as MediaStream;
                existingStream.getTracks().forEach(track => track.stop());
            }

            const constraints: MediaStreamConstraints = { 
                video: deviceId 
                    ? { deviceId: { exact: deviceId }, width: 1280, height: 720 } 
                    : { width: 1280, height: 720, facingMode: 'user' } 
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            setIsLoading(false);
        } catch (err) {
            console.error("Error accessing camera", err);
            setStatusText("Cannot access camera. Please allow permissions.");
        }
    };

    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const deviceId = e.target.value;
        setSelectedDeviceId(deviceId);
        setIsLoading(true);
        startCamera(deviceId);
    };

    const handleVideoPlay = () => {
        // Increment loop ID to kill any existing loops
        const currentLoopId = ++detectLoopIdRef.current;

        const detectLoop = async () => {
            // Check if this loop is still the active one
            if (detectLoopIdRef.current !== currentLoopId) {
return;
}

            if (!videoRef.current || !canvasRef.current) {
return;
}

            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            const displaySize = { width: video.videoWidth, height: video.videoHeight };

            if (displaySize.width === 0) {
                setTimeout(detectLoop, 200);

                return;
            }
            
            faceapi.matchDimensions(canvas, displaySize);

            try {
                // Use SsdMobilenetv1 for maximum accuracy and stable bounding boxes
                const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                if (detectLoopIdRef.current !== currentLoopId) {
return;
} // double check after await

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);

                  // We will draw standard faceapi boxes instead of custom drawing
                  resizedDetections.forEach(detection => {
                      const box = detection.detection.box;
                      let drawColor = '#D40000'; // Red for Unrecognized/Unknown
                      let labelText = 'Unknown';
  
                      if (faceMatcher) {
                          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                          
                          if (bestMatch.label !== 'unknown' && bestMatch.distance < 0.55) {
                              drawColor = '#10B981'; // Green for Recognized
                              const user = JSON.parse(bestMatch.label);
                              labelText = user.name.split(' ')[0]; // First name
  
                              processAttendance(user, bestMatch.distance);
                          }
                      }
  
                      // We must mirror the X coordinate because the video is mirrored via CSS
                      const mirrorX = displaySize.width - box.x - box.width;
                      
                      const mirroredBox = { 
                          x: mirrorX, 
                          y: box.y, 
                          width: box.width, 
                          height: box.height 
                      };
                      
                      const drawOptions = {
                          label: labelText,
                          lineWidth: 3,
                          boxColor: drawColor
                      };
                      
                      const drawBox = new faceapi.draw.DrawBox(mirroredBox, drawOptions);
                      drawBox.draw(canvas);
                  });
            } catch (err) {
                console.error("Face detection error:", err);
            }

            // Schedule next frame using requestAnimationFrame for maximum smoothness
            requestAnimationFrame(detectLoop);
        };

        detectLoop();
    };

    const processAttendance = (user: FaceEmbedding['user'], distance: number) => {
        const now = Date.now();
        const lastSeen = lastRecognizedRef.current[user.id] || 0;

        // Prevent logging the same user if they were seen in the last 15 seconds
        if (now - lastSeen < 15000) {
            return;
        }

        lastRecognizedRef.current[user.id] = now;

        // Play sound
        const audio = new Audio('/sounds/ding.mp3'); // We'll assume a sound file exists or just let it fail silently
        audio.play().catch(e => {});

        // Add optimistic log
        const logId = Math.random().toString(36).substring(7);
        const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const newLog: LogEntry = {
            id: logId,
            time,
            user,
            status: 'success',
            message: 'Recorded'
        };

        setLogs(prev => [newLog, ...prev].slice(0, 8)); // Keep last 8

        // Send to backend
        fetch(attendance.url(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                user_id: user.id,
                method: 'Face'
            })
        })
        .then(async res => {
            if (!res.ok) {
                const detail = await res.text().catch(() => '');

                throw new Error(`Attendance request failed with HTTP ${res.status}. ${detail.slice(0, 120)}`);
            }

            return (await parseJsonResponse(res)) as { message?: string };
        })
        .then(data => {
            if (data.message === 'Attendance already recorded for today') {
                setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'already', message: 'Already Present' } : l));
            }
        })
        .catch(err => {
            console.error("Failed to record", err);
            setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'error', message: 'Network Error' } : l));
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-[#080B1A] text-white' : 'bg-gray-100 text-gray-900'} min-h-screen font-sans overflow-hidden flex flex-col transition-colors duration-300`}>
            <Head title="Live Scanner - SMKN 40" />

            {/* Topbar */}
            <header className={`px-6 py-4 flex justify-between items-center z-50 border-b relative transition-colors duration-300 ${theme === 'dark' ? 'bg-black/30 backdrop-blur-md border-white/10' : 'bg-white shadow-sm border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white text-[#080B1A]' : 'bg-[#D40000] text-white'}`}>
                        <Camera size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">SMKN 40 LIVE SCANNER</h1>
                        <p className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {devices.length > 0 && (
                        <select 
                            className={`text-sm font-medium px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'text-white/70 bg-white/10 border-white/20 focus:ring-white/30' : 'text-gray-700 bg-gray-50 border-gray-300 focus:ring-red-500/30'}`}
                            value={selectedDeviceId}
                            onChange={handleDeviceChange}
                        >
                            <option value="" className="text-black">Default Camera</option>
                            {devices.map(device => (
                                <option key={device.deviceId} value={device.deviceId} className="text-black">
                                    {device.label || `Camera ${device.deviceId.substring(0,5)}`}
                                </option>
                            ))}
                        </select>
                    )}
                    <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'text-white/70 bg-white/5 border-white/10' : 'text-gray-700 bg-gray-100 border-gray-200'}`}>
                        {statusText}
                    </span>
                    <button 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button 
                        onClick={toggleFullscreen}
                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        title="Toggle Fullscreen"
                    >
                        <Maximize size={18} />
                    </button>
                    <Link href="/admin/dashboard" className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors">
                        <XCircle size={18} />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex relative">
                {/* Camera Area */}
                <div className={`flex-1 relative flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-gray-200'}`}>
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <Loader2 className="animate-spin text-white mb-4" size={48} />
                            <p className="text-lg animate-pulse">{statusText}</p>
                        </div>
                    )}
                    
                    <video 
                        ref={videoRef}
                        onPlay={handleVideoPlay}
                        autoPlay 
                        muted
                        className="absolute w-full h-full object-cover transform scale-x-[-1]"
                    />
                    <canvas 
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-20"
                    />

                    {/* HUD Overlay Graphics */}
                    <div className="absolute inset-0 pointer-events-none z-30 border-[10px] border-[#080B1A]/20">
                        {/* Top Left Corner */}
                        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-white/30 rounded-tl-xl"></div>
                        {/* Top Right Corner */}
                        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-white/30 rounded-tr-xl"></div>
                        {/* Bottom Left Corner */}
                        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-white/30 rounded-bl-xl"></div>
                        {/* Bottom Right Corner */}
                        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-white/30 rounded-br-xl"></div>
                        
                        {/* Focus Crosshair */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Log */}
                <div className={`w-80 border-l flex flex-col relative z-40 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#111318] border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className={`p-4 border-b ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                        <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Activity Log
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {logs.length === 0 ? (
                            <div className={`text-center text-sm mt-10 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
                                Waiting for faces...
                            </div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className={`border rounded-xl p-3 transform transition-all duration-300 animate-in fade-in slide-in-from-right-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-mono ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>{log.time}</span>
                                        {log.status === 'success' && <CheckCircle className="text-emerald-500" size={14} />}
                                        {log.status === 'already' && <CheckCircle className="text-amber-500" size={14} />}
                                        {log.status === 'error' && <AlertCircle className="text-red-500" size={14} />}
                                    </div>
                                    <div className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{log.user.name}</div>
                                    {log.user.classroom && (
                                        <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                                            {log.user.classroom.name} • {log.user.classroom.major.code}
                                        </div>
                                    )}
                                    <div className={`mt-2 text-xs font-medium px-2 py-1 rounded inline-block ${
                                        log.status === 'success' ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                                        log.status === 'already' ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700') :
                                        (theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700')
                                    }`}>
                                        {log.message}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
