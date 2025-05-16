import { Router, Request, Response } from "express";
import { sendContactEmail } from "../controllers/emailController";

const router = Router();

// Явно указываем типы для функции обработчика
router.post("/", (req: Request, res: Response) => {
  sendContactEmail(req, res);
});

export default router;