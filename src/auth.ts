import * as fs from 'fs';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

const readFileAsync = promisify(fs.readFile);

const generateToken = async (
  userId: string,
  secretKeyFileName = 'SECRETKEY'
): Promise<string> => {
  let secretKey: string, token: string;

  try {
    secretKey = await readFileAsync(secretKeyFileName, 'utf-8');
    token = jwt.sign({ userId }, secretKey);
  } catch (e) {
    console.log(`${secretKeyFileName} file not found, using 'secret' as key`);
    token = jwt.sign({ userId }, 'secret');
  }

  return token;
};

const getRequestToken = (req: Request): string => {
  const { authorization: token } = req.headers;
  if (token) {
    return token.slice(7, token.length);
  }
  throw Error('auth required');
};

const getUserIdFromToken = async (
  token: string,
  secretKeyFileName = 'SECRETKEY'
): Promise<string> => {
  let secretKey: string;

  try {
    secretKey = await readFileAsync(secretKeyFileName, 'utf-8');
    const decoded: any = jwt.verify(token, secretKey);
    return decoded.userId;
  } catch (e) {
    console.error('token invalid');
    console.error(e);
  }
};

export default {
  getRequestToken,
  generateToken,
  getUserIdFromToken
};
