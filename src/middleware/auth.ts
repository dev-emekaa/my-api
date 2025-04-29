import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/error";

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const generateToken = (userId: number): string | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new ApiError("JWT secret is not defined!", 500);

    return jwt.sign({ id: userId }, secret, { expiresIn: "30d" });
  } catch (error) {
    console.error("Error generating token:", error);
    return null; // Or handle appropriately
  }
};


export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    req.user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, email: true } });

    if (!req.user) return next(new ApiError("User not found", 404));

    next();
  } catch (error) {
    next(new ApiError("Not authorized, token invalid", 401));
  }
};
