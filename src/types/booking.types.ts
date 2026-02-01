/**
 * Booking-related type definitions
 * Separated from schemas for better code organization
 */

export interface Booking {
    id: string;
    roomId: string;
    user: string;
    startTime: string;
    endTime: string;
    createdAt: string;
}

export interface CreateBookingDTO {
    roomId: string;
    user: string;
    startTime: string;
    endTime: string;
}
