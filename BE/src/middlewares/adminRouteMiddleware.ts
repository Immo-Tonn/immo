import { Request, Response, NextFunction } from 'express';
import { protect } from './authMiddleware';

/**
 * Middleware for protecting real estate management routes
 * Checks that the user is logged in as an administrator.
 */
export const protectObjectRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await protect(req, res, () => {
    if (!req.user) {
      res.status(403).json({
        message: 'Access Denied. Administrator rights required.',
      });
      return;
    }

    next();
  });
};

/**
 * Middleware for protecting image management routes
 * Checks that the user is logged in as an administrator.
 */
export const protectImageRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await protect(req, res, () => {
    if (!req.user) {
      res.status(403).json({
        message:
          'Access Denied. Administrator rights are required to manage images.',
      });
      return;
    }
    next();
  });
};

/**
 * Middleware for protecting media control routes
 * Checks that the user is logged in as an administrator.
 */
export const protectVideoRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await protect(req, res, () => {
    if (!req.user) {
      res.status(403).json({
        message:
          'Access Denied. Administrator rights are required to manage media.',
      });
      return;
    }
    next();
  });
};
