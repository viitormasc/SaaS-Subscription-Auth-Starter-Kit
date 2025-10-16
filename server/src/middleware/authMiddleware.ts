import { Request, Response, NextFunction } from 'express';

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(400).json({errors:['User not authenticated, please login']})
  }
}

/* export function ensureGuest(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/dashboard');
  }
}
 */