import type * as faceapi from '@vladmandic/face-api';

const LEFT_EYE_INDICES = [36, 37, 38, 39, 40, 41];
const RIGHT_EYE_INDICES = [42, 43, 44, 45, 46, 47];

export const estimateEAR = (landmarks: faceapi.FaceLandmarks68): number => {
    const positions = landmarks.positions;
    const singleEyeEAR = (indices: number[]): number => {
        const [a, b, c, d, e, f] = indices.map(index => positions[index]);
        const verticalA = Math.hypot(b.x - f.x, b.y - f.y);
        const verticalB = Math.hypot(c.x - e.x, c.y - e.y);
        const horizontal = Math.hypot(a.x - d.x, a.y - d.y);

        return horizontal === 0 ? 0 : (verticalA + verticalB) / (2 * horizontal);
    };

    return (singleEyeEAR(LEFT_EYE_INDICES) + singleEyeEAR(RIGHT_EYE_INDICES)) / 2;
};

export const isEyeClosed = (ear: number, threshold = 0.20): boolean => ear < threshold;

export const estimateYaw = (landmarks: faceapi.FaceLandmarks68): number => {
    const positions = landmarks.positions;
    const leftEye = positions[36];
    const rightEye = positions[45];
    const noseTip = positions[30];
    const eyeDist = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
    const midEyesX = (leftEye.x + rightEye.x) / 2;
    const offset = noseTip.x - midEyesX;
    return (Math.asin(Math.max(-1, Math.min(1, offset / eyeDist))) * 180) / Math.PI;
};

export const estimatePitch = (landmarks: faceapi.FaceLandmarks68): number => {
    const p = landmarks.positions;
    const eyeMidY = (p[36].y + p[45].y) / 2;
    const mouthMidY = (p[48].y + p[54].y) / 2;
    const noseY = p[30].y;
    const distEyeNose = noseY - eyeMidY;
    const distNoseMouth = mouthMidY - noseY;
    
    // Ideal ratio is usually around 1.0
    const ratio = distEyeNose / (distNoseMouth || 1);
    
    // Normalize to roughly degrees (0 is straight, + is looking down, - is looking up)
    return (1.0 - ratio) * 50; 
};

export interface FaceQuality {
    score: number;      // 0.0 to 1.0 (normalized quality score)
    isGood: boolean;    // strict boolean gate
    reasons: string[];  // what failed?
}

export const getFaceBrightness = (video: HTMLVideoElement, box: faceapi.IRect): number => {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return 128;
        
        ctx.drawImage(video, Math.max(0, box.x), Math.max(0, box.y), box.width, box.height, 0, 0, 32, 32);
        const imageData = ctx.getImageData(0, 0, 32, 32).data;
        let sum = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            sum += (0.299 * imageData[i] + 0.587 * imageData[i+1] + 0.114 * imageData[i+2]);
        }
        return sum / 1024;
    } catch(e) {
        return 128;
    }
};

// Assess the True Face Quality (not just detection confidence)
export const assessFaceQuality = (
    detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68> | faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>>,
    allowPose = false,
    brightness: number | null = null
): FaceQuality => {
    const box = detection.detection.box;
    const confidence = detection.detection.score;
    const yaw = estimateYaw(detection.landmarks);
    const pitch = estimatePitch(detection.landmarks);
    
    let score = confidence;
    const reasons: string[] = [];
    
    // We remove the strict `box.width < 90` rejection from here. We only flag it as a warning so the caller can decide.
    // Wait, the user said don't break liveness. For P2, we will evaluate sizes in index.tsx.
    if (box.width < 80 || box.height < 80) {
        score *= 0.5;
        reasons.push("Wajah terlalu jauh");
    }
    
    // 2. Pose Alignment Check
    if (!allowPose) {
        if (Math.abs(yaw) > 25) {
            score *= 0.8;
            reasons.push("Menoleh Terlalu Tajam");
        }
        if (Math.abs(pitch) > 30) {
            score *= 0.8;
            reasons.push("Menunduk/Mendongak");
        }
    }
    
    // 3. Eye State (should be open)
    const ear = estimateEAR(detection.landmarks);
    if (isEyeClosed(ear)) {
        score *= 0.6;
        reasons.push("Mata Tertutup/Berkedip");
    }
    
    // 4. Brightness Check
    if (brightness !== null) {
        if (brightness < 55) {
            score *= 0.6;
            reasons.push("Terlalu Gelap (Kurang Cahaya)");
        } else if (brightness > 210) {
            score *= 0.7;
            reasons.push("Overexposure / Silau");
        }
    }
    
    // Basic detection score constraint
    if (confidence < 0.85) {
        reasons.push("Wajah Kurang Jelas");
    }
    
    // Final quality gate
    const isGood = score >= 0.75 && reasons.length === 0 && confidence >= 0.85;
    
    return { score, isGood, reasons };
};
