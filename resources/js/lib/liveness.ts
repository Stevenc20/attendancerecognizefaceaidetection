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

export const isEyeClosed = (ear: number, threshold = 0.25): boolean => ear < threshold;
