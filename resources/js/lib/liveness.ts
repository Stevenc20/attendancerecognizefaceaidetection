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

// Assess the True Face Quality (not just detection confidence)
export const assessFaceQuality = (
    detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68> | faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>>,
    allowPose = false
): FaceQuality => {
    const box = detection.detection.box;
    const confidence = detection.detection.score;
    const yaw = estimateYaw(detection.landmarks);
    const pitch = estimatePitch(detection.landmarks);
    
    let score = confidence;
    const reasons: string[] = [];
    
    // 1. Minimum Size Check (at least 90px for reliable extraction)
    if (box.width < 90 || box.height < 90) {
        score *= 0.5;
        reasons.push("Terlalu Jauh");
    }
    
    // 2. Pose Alignment Check (frontal is best for enrollment/recognition baseline)
    if (!allowPose) {
        if (Math.abs(yaw) > 20) {
            score *= 0.8;
            reasons.push("Miring ke Samping (Yaw)");
        }
        
        if (Math.abs(pitch) > 25) {
            score *= 0.8;
            reasons.push("Menunduk/Mendongak (Pitch)");
        }
    }
    
    // 3. Eye State (should be open)
    const ear = estimateEAR(detection.landmarks);
    if (isEyeClosed(ear)) {
        score *= 0.6;
        reasons.push("Mata Tertutup/Berkedip");
    }
    
    // Basic detection score constraint (minimum 85% confidence to even be considered clear)
    if (confidence < 0.85) {
        reasons.push("Wajah Kurang Jelas (Buram/Gelap)");
    }
    
    // Final quality gate: must have high score and no violation reasons
    const isGood = score >= 0.80 && reasons.length === 0 && confidence >= 0.85;
    
    return {
        score,
        isGood,
        reasons
    };
};
