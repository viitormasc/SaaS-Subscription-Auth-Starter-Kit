import express from 'express';
import { UserDocument } from './interfaces';

declare global {
  namespace Express {
    interface User extends UserDocument {}
    interface Request {
      flash(message?: string): { [key: string]: string[] };
      flash(event: string, message: string | string[]): any;
      isAuthenticated(): boolean;
      isUnauthenticated(): boolean;
      logout(cb: (err?: any) => void): void;
    }
  }
}

