import { Request, Response } from 'express';

import Auth from './auth';

export default async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  try {
    const token = Auth.getRequestToken(req);
    const userId = await Auth.getUserIdFromToken(token);
    if (userId) {
      res.locals.userId = userId;
    }
  } catch (e) {
  } finally {
    next();
  }
};
