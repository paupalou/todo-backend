import * as fs from 'fs';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import signale from 'signale';

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
    signale.error(`${secretKeyFileName} file not found, using 'secret' as key`);
    token = jwt.sign({ userId }, 'secret');
  }

  return token;
};

const getRequestToken = (req: Request): string => {
  const { authorization: authorizationToken } = req.headers;
  if (authorizationToken) {
    return authorizationToken.slice(7, authorizationToken.length);
  }

  const { token: cookieToken } = req.cookies;
  if (cookieToken) {
    return cookieToken;
  }
};

const getUserIdFromToken = async (
  token: string,
  secretKeyFileName = 'SECRETKEY'
): Promise<string> => {
  let secretKey;
  try {
    secretKey = await readFileAsync(secretKeyFileName, 'utf-8');
  } catch (e) {
    secretKey = 'secret'
  }

  const decoded: any = jwt.verify(token, secretKey);
  return decoded.userId;
};

export default {
  getRequestToken,
  generateToken,
  getUserIdFromToken
};
