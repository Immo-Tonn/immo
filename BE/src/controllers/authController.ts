// BE/src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { AdminModel, IAdmin } from '../models/AdminModel';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailService';
// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '30d',
  });
};
// Checking if an Admin is in the system
export const checkAdminExists = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const adminExists = (await AdminModel.countDocuments()) > 0;
    res.json({ adminExists });
  } catch (error) {
    res.status(500).json({ message: 'Admin verification error', error });
  }
};
// Admin registration
export const registerAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Check if there is already an admin in the system
    const adminExists = (await AdminModel.countDocuments()) > 0;
    if (adminExists) {
      res.status(400).json({ message: 'Admin is already registered' });
      return;
    }
    const { email, fullName, username, password } = req.body;

    // Checking required fields
    if (!email || !fullName || !username || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    // Creating a new Admin
    const admin = (await AdminModel.create({
      email,
      fullName,
      username,
      password,
    })) as IAdmin & { _id: any };
    // Return data and token
    res.status(201).json({
      _id: admin._id.toString(),
      email: admin.email,
      fullName: admin.fullName,
      username: admin.username,
      token: generateToken(admin._id.toString()),
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Registration error', error: error.message });
  }
};
// Admin Authorization
export const loginAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({ message: 'Enter your login and password' });
      return;
    }
    // looking for an admin by email or username
    const admin = (await AdminModel.findOne({
      $or: [{ email: login }, { username: login }],
    })) as IAdmin & { _id: any };

    if (!admin) {
      res.status(401).json({ message: 'Incorrect login or password' });
      return;
    }
    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect login or password' });
      return;
    }
    // Successful authorization
    res.json({
      _id: admin._id.toString(),
      email: admin.email,
      fullName: admin.fullName,
      username: admin.username,
      token: generateToken(admin._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Authorization error', error });
  }
};
// Removing Administrator Registration
export const deleteAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const adminId = req.user._id; // Get from middleware auth
    await AdminModel.findByIdAndDelete(adminId);
    res.json({ message: 'Admin registration removed' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления администратора', error });
  }
};
// Testing email configuration
export const testEmailConfig = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Check if email settings are configured
    const emailConfigured = !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_ADMIN &&
      process.env.EMAIL_ADMIN_PASS
    );
    if (emailConfigured) {
      res.json({
        success: true,
        message: 'Email settings are configured',
        config: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          user: process.env.EMAIL_ADMIN
            ? `${process.env.EMAIL_ADMIN.substring(0, 3)}...`
            : 'не указан',
          pass: process.env.EMAIL_ADMIN_PASS ? '********' : 'not specified',
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Email configuration is not fully configured',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking email configuration',
      error,
    });
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const admin = (await AdminModel.findOne({ email })) as IAdmin & {
      _id: any;
    };
    if (!admin) {
      // For security reasons,  do not report that the email was not found.
      res.json({
        message:
          'If this email is registered, you will receive a password reset email.',
      });
      return;
    }
    // Generate a temporary password
    const tempPassword = crypto.randomBytes(6).toString('hex');
    admin.password = tempPassword;
    await admin.save();
    // Sending an email with a new password
    const emailSent = await sendPasswordResetEmail(email, tempPassword);

    if (!emailSent) {
      console.log(
        `Error sending email. Temporary password for ${email}: ${tempPassword}`,
      );
      res.status(500).json({
        message: 'Error sending email. Please try again later.',
        // In dev mode, we send the password in response for testing
        ...(process.env.NODE_ENV === 'development' && { tempPassword }),
      });
      return;
    }
    console.log(`Email sent. Temporary password for ${email}: ${tempPassword}`);
    res.json({
      message: 'A new password has been sent to your email address.',
      // In dev mode, we send the password in response for testing
      ...(process.env.NODE_ENV === 'development' && { tempPassword }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сброса пароля', error });
  }
};

/**
 * @desc    Change Admin Password
 * @route   PUT /api/auth/change-password
 * @access  Private (only authorized admin)
 */
export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    // Checking if all fields are present
    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    // Checking whether the new password and confirmation match
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: 'The passwords do not match' });
      return;
    }
    // Check for minimum password length (e.g. 8 characters)
    if (newPassword.length < 8) {
      res
        .status(400)
        .json({
          message: 'The new password must contain at least 8 characters.',
        });
      return;
    }
    // Check if the user is trying to set the same password
    if (newPassword === currentPassword) {
      res
        .status(400)
        .json({
          message: 'The new password must be different from the current one.',
        });
      return;
    }
    // Getting user ID from authentication middleware
    const adminId = req.user._id;
    // Find Admin in the db
    const admin = await AdminModel.findById(adminId).select('+password');
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }
    // Check if the current password is correct
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: 'The current password is incorrect.' });
      return;
    }
    // Setting a new password
    admin.password = newPassword;
    await admin.save();
    res.json({
      success: true,
      message: 'Password successfully changed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error,
    });
  }
};
