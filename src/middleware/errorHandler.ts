/**
 * Centralized error handling middleware
 * Handles all errors thrown
 */

import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ConflictError } from '../errors/AppError';
import { z } from 'zod';

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: error.errors
        });
    }

    // Custom application errors
    if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
    }

    if (error instanceof ConflictError) {
        return res.status(409).json({ error: error.message });
    }

    // Unexpected errors - log and return generic message
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
}
