import { z } from 'zod';

// Re-export types for backward compatibility
export { Booking, CreateBookingDTO } from '../types';
export { Room } from '../types';

export const CreateBookingSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
    user: z.string({ required_error: "User is required" })
        .min(1, "User cannot be empty")
        .trim()
        .min(1, "User cannot be only whitespace"),
    startTime: z.string().datetime({ offset: true, message: "Use ISO 8601 format with timezone (e.g. 2026-06-01T10:00:00Z)" }),
    endTime: z.string().datetime({ offset: true, message: "Use ISO 8601 format with timezone" }),
}).refine((data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return start < end;
}, {
    message: "startTime must be before endTime",
    path: ["startTime"]
}).refine((data) => {
    const start = new Date(data.startTime);
    const now = new Date();
    return start >= now;
}, {
    message: "startTime cannot be in the past",
    path: ["startTime"]
});

