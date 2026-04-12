import { stringbool } from "better-auth";
import { auth as betterAuth } from "../lib/auth";
import { type NextFunction, type Response } from "express";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  try {
    return async (req: any, res: Response, next: NextFunction) => {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          error: "Email not verified. Please verify your email address.",
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return (req: any, res: Response) => {
      res.status(500).json({ error: "Internal Server Error" });
    };
  }
};

export default auth;
