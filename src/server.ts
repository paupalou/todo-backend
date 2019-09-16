import initApp from './app';

export default (async () => {
  const app = await initApp();
  const port: number = app.get('port');
  return app.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
})();
