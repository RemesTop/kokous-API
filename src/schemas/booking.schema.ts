import { z } from 'zod';

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
    path: ["startTime"] // Attach error to startTime
}).refine((data) => {
    const start = new Date(data.startTime);
    const now = new Date();
    return start >= now;
}, {
    message: "startTime cannot be in the past",
    path: ["startTime"]
});

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;

export interface Room {
    id: string;
    name: string;
    capacity: number;
}

export interface Booking {
    id: string;
    roomId: string;
    user: string;
    startTime: string;
    endTime: string;
    createdAt: string;
}
