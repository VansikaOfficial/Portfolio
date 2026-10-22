import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@utils/ApiError';
import { verifyAccessToken, JwtPayload } from '@utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token missing');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(ApiError.unauthorized('Invalid or expired access token'));
  }
};

// Attaches req.user if a valid access token is present, but never blocks the request.
// Used on routes that behave differently for admins (e.g. blog list including drafts).
export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = verifyAccessToken(token);
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
};
