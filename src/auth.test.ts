import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { promisify } from 'util';

import Auth from './auth';

describe('generateToken', () => {
  test('returns token without secretKey file', async () => {
    const secretKey = 'secret';
    const inexistentFile = 'LoremIpsum12345';
    const token: string = await Auth.generateToken(
      'RandomUser',
      inexistentFile
    );

    expect(token).toBeTruthy();
    expect(jwt.verify(token, secretKey)).toBeTruthy();
  });

  test('returns token with secretKey file', async () => {
    const writeFileAsync = promisify(fs.writeFile);
    const secretKey = 'SECRETKEY_TEST';
    const secretKeyFileName = 'EXISTENT_FILE_TEST';
    await writeFileAsync(secretKeyFileName, secretKey);

    const token: string = await Auth.generateToken(
      'RandomUser',
      secretKeyFileName
    );

    expect(token).toBeTruthy();
    expect(jwt.verify(token, secretKey)).toBeTruthy();
    fs.unlinkSync(secretKeyFileName);
  });
});
