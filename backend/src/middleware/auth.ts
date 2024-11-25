import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received in authorization header');
    }

    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      console.log('Token verified successfully for user:', decoded.id);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found for token:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Attach user to request
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email
      };
      
      console.log('Authentication successful for user:', user.email);
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    next(error);
  }
};
