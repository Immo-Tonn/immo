// immo/BE/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/AdminModel";

// Расширение интерфейса Request для добавления user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware защиты маршрутов с правильной типизацией
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Проверяем наличие токена в заголовке Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Получаем токен из заголовка
        token = req.headers.authorization.split(" ")[1];

        // Проверяем токен
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "default_secret"
        ) as { id: string };

        // Находим пользователя по ID из токена
        req.user = await AdminModel.findById(decoded.id).select("-password");

        if (!req.user) {
          res.status(401).json({ message: "Пользователь не найден" });
          return;
        }

        next();
      } catch (error) {
        res
          .status(401)
          .json({ message: "Не авторизован, токен недействителен" });
        return;
      }
    } else {
      res.status(401).json({ message: "Не авторизован, токен отсутствует" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка аутентификации", error });
  }
};
