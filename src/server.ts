import initApp from './app';
import signale from 'signale';

export default (async (): Promise<void> => {
  const app = await initApp();
  const port: number = app.get('port');
  app.listen(port, () => {
    signale.info(`Server running at port ${port}`);
  });

  app.use((req, res, next) => {
    signale.debug(`Request Type ${req.method}`);
    next();
  });
})();
