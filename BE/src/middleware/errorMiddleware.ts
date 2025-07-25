import { Request, Response, NextFunction } from 'express';

// Middleware for error logging
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`Path: ${req.method} ${req.path}`);
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  next(err);
};

// Middleware for handling errors and sending a response to the client
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    message: 'Internal Server Error',
    error:
      process.env.NODE_ENV === 'development'
        ? {
            message: err.message,
            stack: err.stack,
          }
        : undefined,
  });
};

// Middleware for catching and logging uncaught errors
export const setupUncaughtErrorHandlers = () => {
  process.on('uncaughtException', err => {
    console.error('Uncaught exception:', err);
    console.error(err.stack);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', reason);
  });
};
