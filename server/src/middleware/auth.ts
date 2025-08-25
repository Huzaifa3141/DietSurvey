import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    category: string;
    name: string;
  };
}

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access token required' 
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Verify user still exists in database
      const user = await prisma.participant.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          category: true,
          name: true
        }
      });

      if (!user) {
        return res.status(401).json({ 
          error: 'User not found' 
        });
      }

      req.user = user;
      return next();
    } catch (jwtError) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d' 
  });
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required' 
    });
  }

  // Add admin check logic here if needed
  // For now, all authenticated users can access admin features
  return next();
};
