// immo/BE/src/routes/authRoutes.ts
import { Router } from 'express';
import {
  checkAdminExists,
  registerAdmin,
  loginAdmin,
  deleteAdmin,
  requestPasswordReset,
  changePassword,
  testEmailConfig,
} from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Checking for admin existence
router.get('/admin-exists', checkAdminExists);

// Admin registration
router.post('/register', registerAdmin);

router.post('/add-property', loginAdmin);

// Remove admin registration (protected route)
router.delete('/delete-admin', protect, deleteAdmin);

// Change password
router.put('/change-password', protect, changePassword);

// Password reset request
router.post('/reset-password', requestPasswordReset);

// Testing email configuration
router.get('/test-email', testEmailConfig);

export default router;
