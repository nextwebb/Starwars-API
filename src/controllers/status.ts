import { Request, Response } from 'express';

export const status = (req: Request, res: Response): void => {
  res.status(200);
  res.json({ success: true, msg: 'Welcome to starwars API /home' });
};

export default status;
