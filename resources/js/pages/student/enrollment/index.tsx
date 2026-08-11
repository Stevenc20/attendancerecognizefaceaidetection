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
    const [status, setStatus] = useState<string>('Loading AI Models...');
    const [isDetecting, setIsDetecting] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        embedding: [] as number[]
    });

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ]);
                setStatus('Models loaded. Please allow camera access.');
                setIsLoading(false);
                startCamera();
            } catch (err) {
                console.error("Error loading models", err);
                setError("Failed to load Face AI models. Please ensure the model files exist in /public/models.");
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
                video: { width: 720, height: 560 } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera", err);
            setError("Cannot access camera. Please allow camera permissions in your browser.");
        }
    };

    const handleVideoPlay = () => {
        setIsDetecting(true);
        setStatus('Position your face in the center...');
        
        const detectInterval = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current || processing || data.embedding.length > 0) {
                return;
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);

            const detection = await faceapi.detectSingleFace(video)
                .withFaceLandmarks()
                .withFaceDescriptor();

            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);

            if (detection) {
                const resizedDetections = faceapi.resizeResults(detection, displaySize);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                
                if (detection.detection.score > 0.85) {
                    setStatus('Face detected! Capturing data...');
                    clearInterval(detectInterval);
                    captureFaceData(detection.descriptor);
                }
            }
        }, 300);
    };

    const captureFaceData = (descriptor: Float32Array) => {
        // Convert Float32Array to standard array for JSON submission
        const embeddingArray = Array.from(descriptor);
        
        setData('embedding', embeddingArray);
        setStatus('Submitting biometric data...');
        
        post('/student/face-enrollment', {
            onSuccess: () => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            },
            onError: () => {
                setError("Failed to save biometric data. Please try again.");
                setStatus('Failed.');
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

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
                    {hasEnrolled && data.embedding.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-[#111318] mb-2">You are already enrolled!</h2>
                            <p className="text-[#6B6F76] mb-8">
                                Your facial biometric data is successfully registered in the system. You are ready to use the face scanner for daily attendance.
                            </p>
                            <button 
                                onClick={() => window.location.href = '/student/dashboard'}
                                className="px-6 py-3 bg-[#111318] text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Back to Dashboard
                            </button>
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
                                <div className="relative bg-[#080B1A] rounded-xl overflow-hidden aspect-video flex items-center justify-center mb-6">
                                    {isLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-[#080B1A]/80">
                                            <Loader2 className="animate-spin mb-4 text-[#D40000]" size={32} />
                                            <p className="font-medium">{status}</p>
                                        </div>
                                    )}
                                    
                                    <video 
                                        ref={videoRef}
                                        onPlay={handleVideoPlay}
                                        width="720" 
                                        height="560" 
                                        autoPlay 
                                        muted
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                    />
                                    <canvas 
                                        ref={canvasRef}
                                        className="absolute top-0 left-0 w-full h-full transform scale-x-[-1]"
                                    />

                                    {processing && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-[#080B1A]/80">
                                            <Loader2 className="animate-spin mb-4 text-[#D40000]" size={32} />
                                            <p className="font-medium text-lg">Saving biometric data...</p>
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
                                <h3 className="text-sm font-bold text-[#111318] mb-2 uppercase tracking-wider">Instructions:</h3>
                                <ul className="text-sm text-[#6B6F76] space-y-2 list-disc pl-5">
                                    <li>Ensure you are in a well-lit environment.</li>
                                    <li>Remove masks, sunglasses, or anything covering your face.</li>
                                    <li>Look directly at the camera and keep still when the box appears.</li>
                                    <li>The system will automatically capture your face once it gets a clear read.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
