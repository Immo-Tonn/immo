// immo/BE/src/middleware/adminRouteMiddleware.ts
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
  // Using existing middleware protect to check authorization
  await protect(req, res, () => {
    // If protect did not abort execution (i.e. the user is authorized),
    // check the presence of the user in the request (must be added to protect)
    if (!req.user) {
      res.status(403).json({
        message: 'Access Denied. Administrator rights required.',
      });
      return;
    }

    // If all checks are passed, we continue executing the request.
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
  // Using existing middleware protect to check authorization
  await protect(req, res, () => {
    // If protect did not abort execution (i.e. the user is authorized),
    // check the presence of the user in the request (must be added to protect)
    if (!req.user) {
      res.status(403).json({
        message:
          'Access Denied. Administrator rights are required to manage images.',
      });
      return;
    }

    // If all checks are passed, we continue executing the request.
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
  // Using existing middleware protect to check authorization
  await protect(req, res, () => {
    // If protect did not abort execution (i.e. the user is authorized),
    // check the presence of the user in the request (must be added to protect)
    if (!req.user) {
      res.status(403).json({
        message:
          'Access Denied. Administrator rights are required to manage media.',
      });
      return;
    }

    // If all checks are passed, we continue executing the request.
    next();
  });
};
