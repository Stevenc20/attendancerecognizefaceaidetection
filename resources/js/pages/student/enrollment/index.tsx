import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FaceEnrollment({ hasEnrolled }: { hasEnrolled: boolean }) {
    const { auth } = usePage().props as any;
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>('Memuat model AI...');
    const [isDetecting, setIsDetecting] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const STAGES = [
        { label: "Pegang HP/Kamera Anda dengan tegak", instruction: "Jangan gerak-gerak dulu..." },
        { label: "Senyum", instruction: "Tahan senyum Anda..." },
        { label: "Tengok Kiri", instruction: "Tengok wajah sedikit ke kiri..." },
        { label: "Tengok Kanan", instruction: "Tengok wajah sedikit ke kanan..." }
    ];
    
    const [stageIndex, setStageIndex] = useState(0);
    const stageIndexRef = useRef(0);
    const capturingRef = useRef(false);
    const descriptorsRef = useRef<Float32Array[]>([]);
    
    const [wantsToRetake, setWantsToRetake] = useState(false);

    const { data, setData, post, processing } = useForm({
        embedding: [] as number[]
    });

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ]);
                setStatus('Model dimuat. Izinkan akses kamera.');
                setIsLoading(false);
                startCamera();
            } catch (err) {
                console.error("Error loading models", err);
                setError("Gagal memuat model Face AI. Pastikan file model ada di folder /public/models.");
                setIsLoading(false);
            }
        };

        loadModels();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 720, height: 720 } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera", err);
            setError("Tidak dapat mengakses kamera. Harap izinkan akses kamera di browser Anda.");
        }
    };

    // Attach stream when video element becomes available (e.g. after clicking retake)
    useEffect(() => {
        if (stream && videoRef.current && !videoRef.current.srcObject) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, wantsToRetake]);

    const handleVideoPlay = () => {
        setIsDetecting(true);
        setStatus(STAGES[0].label);
        stageIndexRef.current = 0;
        descriptorsRef.current = [];
        capturingRef.current = false;
        setStageIndex(0);
        
        let isLooping = true;
        
        const detectFace = async () => {
            if (!isLooping || !videoRef.current || !canvasRef.current || processing || data.embedding.length > 0) {
                return;
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                requestAnimationFrame(detectFace);
                return;
            }
            
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            try {
                // Use inputSize: 416 so the face doesn't need to be right up to the camera
                const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);

                if (detection) {
                    const resizedDetections = faceapi.resizeResults(detection, displaySize);
                    
                    // Draw face landmarks (mesh) instead of static circle
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                    
                    if (detection.detection.score > 0.85 && !capturingRef.current) {
                        capturingRef.current = true;
                        const currentDescriptors = [...descriptorsRef.current, detection.descriptor];
                        descriptorsRef.current = currentDescriptors;
                        
                        if (currentDescriptors.length >= STAGES.length) {
                            setStatus('Proses selesai! Menyimpan data...');
                            isLooping = false;
                            captureFaceData(currentDescriptors);
                        } else {
                            const nextStage = currentDescriptors.length;
                            stageIndexRef.current = nextStage;
                            setStageIndex(nextStage);
                            setStatus(STAGES[nextStage].label);
                            
                            setTimeout(() => {
                                capturingRef.current = false;
                            }, 2000);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
            
            if (isLooping) {
                // Use setTimeout to slightly throttle to ~15fps for performance, while keeping it much smoother than 3fps
                setTimeout(() => requestAnimationFrame(detectFace), 50);
            }
        };

        detectFace();
    };

    const captureFaceData = (capturedDescriptors: Float32Array[]) => {
        // Send all 4 descriptors as an array of arrays to the backend
        // This allows face-api.js to match against multiple poses (front, smile, left, right)
        // significantly increasing recognition accuracy compared to averaging.
        const embeddingsArray = capturedDescriptors.map(desc => Array.from(desc));
        
        setData('embedding', embeddingsArray as any);
        setStatus('Mengirim data biometrik...');
        
        post('/student/face-enrollment', {
            onSuccess: () => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            },
            onError: () => {
                setError("Gagal menyimpan data biometrik. Silakan coba lagi.");
                setStatus('Gagal.');
            }
        });
    };

    return (
        <DashboardLayout role="student" userName={auth.user.name}>
            <Head title="Face Enrollment — SMKN 40" />

            <div className="max-w-4xl mx-auto py-8 px-4">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-[#D40000] mb-4">
                        <Camera size={28} />
                    </div>
                    <h1 className="font-bold text-[#111318] text-3xl mb-2 tracking-tight">
                        Face Enrollment
                    </h1>
                    <p className="text-[#6B6F76]">
                        Register your face for touchless attendance.
                    </p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                    {hasEnrolled && data.embedding.length === 0 && !wantsToRetake ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-[#111318] mb-2">Anda sudah terdaftar!</h2>
                            <p className="text-[#6B6F76] mb-8">
                                Data biometrik wajah Anda sudah terdaftar di sistem. Anda bisa langsung menggunakan scanner wajah untuk absen.
                                Jika Anda merasa data wajah sebelumnya kurang akurat, silakan daftar ulang.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button 
                                    onClick={() => window.location.href = '/student/dashboard'}
                                    className="px-6 py-3 bg-[#111318] text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                                >
                                    Kembali ke Dashboard
                                </button>
                                <button 
                                    onClick={() => setWantsToRetake(true)}
                                    className="px-6 py-3 bg-red-50 text-[#D40000] font-medium rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    Daftar Ulang Wajah
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            {error ? (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center text-red-600 mb-6 flex flex-col items-center">
                                    <AlertCircle size={32} className="mb-3" />
                                    <p className="font-medium">{error}</p>
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div className="relative bg-[#080B1A] rounded-xl overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center mb-6">
                                    {isLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-[#080B1A]/80">
                                            <Loader2 className="animate-spin mb-4 text-[#D40000]" size={32} />
                                            <p className="font-medium">{status}</p>
                                        </div>
                                    )}
                                    
                                    <video 
                                        ref={videoRef}
                                        onPlay={handleVideoPlay}
                                        autoPlay 
                                        muted
                                        className="absolute top-0 left-0 w-full h-full object-contain transform scale-x-[-1]"
                                    />
                                    <canvas 
                                        ref={canvasRef}
                                        className="absolute top-0 left-0 w-full h-full object-contain transform scale-x-[-1] pointer-events-none"
                                    />

                                    {/* Text UI Overlay */}
                                    {!isLoading && !processing && isDetecting && (
                                        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-end pb-12">
                                            <h2 className={`text-white text-xl md:text-2xl font-bold px-6 py-3 rounded-full mb-4 transition-all shadow-lg ${
                                                capturingRef.current ? 'bg-green-500' : 'bg-[#D40000]/90'
                                            }`}>
                                                {STAGES[stageIndex]?.label}
                                            </h2>
                                            <p className="text-white bg-black/70 px-5 py-2 rounded-full text-base font-medium shadow-md">
                                                {capturingRef.current ? 'Tertangkap! Bersiap ke pose berikutnya...' : STAGES[stageIndex]?.instruction}
                                            </p>
                                        </div>
                                    )}

                                    {processing && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-[#080B1A]/80">
                                            <Loader2 className="animate-spin mb-4 text-[#D40000]" size={32} />
                                            <p className="font-medium text-lg">Menyimpan data biometrik...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                                <p className="text-sm font-medium text-[#111318]">
                                    {processing ? 'Processing...' : status}
                                </p>
                            </div>
                            
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-[#111318] mb-2 uppercase tracking-wider">Instruksi:</h3>
                                <ul className="text-sm text-[#6B6F76] space-y-2 list-disc pl-5">
                                    <li>Pastikan Anda berada di tempat dengan pencahayaan terang.</li>
                                    <li>Lepaskan masker, kacamata hitam, atau penutup wajah lainnya.</li>
                                    <li>Ikuti instruksi di layar (Tegak, Senyum, Tengok Kiri/Kanan).</li>
                                    <li>Sistem akan menggabungkan 4 pose wajah Anda untuk akurasi yang lebih tinggi saat absen.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
