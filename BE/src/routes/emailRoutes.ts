import { Router, Request, Response } from 'express';
import { sendContactEmail } from '../controllers/emailController';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  sendContactEmail(req, res);
});

export default router;
