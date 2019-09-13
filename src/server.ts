import app from './app';

const port: number = app.get('port');
const server = app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

export default server;
