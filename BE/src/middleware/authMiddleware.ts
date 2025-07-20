// immo/BE/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/AdminModel";


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Route protection middleware with proper typing
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Check for the presence of a token in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Получаем токен из заголовка
        token = req.headers.authorization.split(" ")[1];

        // Get  token from header
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "default_secret"
        ) as { id: string };

        // Find a user by ID from a token
        req.user = await AdminModel.findById(decoded.id).select("-password");

        if (!req.user) {
          res.status(401).json({ message: "User not found" });
          return;
        }

        next();
      } catch (error) {
        res
          .status(401)
          .json({ message: "Not authorized, invalid token " });
        return;
      }
    } else {
      res.status(401).json({ message: "Not authorized, token missing" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Authentication error", error });
  }
};
