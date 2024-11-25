import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/auth';

// Define types
interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  }
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  }
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  }
}

const router = express.Router();

// Test route
router.get('/working', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Auth API is working"
  });
});

// Register user
router.post('/register', async (req: RegisterRequest, res: Response) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      console.log('Missing required fields:', { 
        name: name ? 'provided' : 'missing',
        email: email ? 'provided' : 'missing',
        password: password ? 'provided' : 'missing' 
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password
    });

    console.log('User created successfully:', { id: user._id, email: user.email });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '30d'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
});

// Login user
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    console.log('Login attempt received for:', req.body.email);
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('Login failed: User not found -', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password -', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Login successful:', email);

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '30d'
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
});

// Get current user
router.get('/me', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
});

export default router;
