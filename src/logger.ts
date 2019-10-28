import { Request, Response } from 'express';
import signale from 'signale';

const isGraphQLEndPoint = (req: Request): boolean => req.url === '/graphql';

export default (req: Request, _: Response, next: Function): void => {
  if (isGraphQLEndPoint(req)) {
    next();
    return;
  }

  signale.log();
  signale.log('############# REQUEST #############');
  signale.log(`# [${req.method}] ${req.url}`);

  if (Object.keys(req.params).length > 0) {
    signale.log(`# query params: ${JSON.stringify(req.params, null)}`);
  }

  if (Object.keys(req.body).length > 0) {
    signale.log(`# body: ${JSON.stringify(req.body, null, 2)}`);
  }

  signale.log('###################################');
  signale.log();
  next();
};
