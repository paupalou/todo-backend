import express, { Express } from 'express';
import getConnection from './db';
import TodoBuilder from './todo/todo.model';
import UserBuilder from './user/user.model';

const app: Express = express();
app.set('port', process.env.port || 3000);

(async () => {
  const db = await getConnection();
  const userBuilder = UserBuilder(db);

  const user = new userBuilder({
    username: 'pau',
    password: 'pau'
  })

  await user.save(err => console.log(err.message));

  db.connection.db.dropCollection('todos');

  const todoBuilder = TodoBuilder(db);

  const newTodo = new todoBuilder({
    user,
    title: 'Test todo'
  });

  newTodo.save();
})();

export default app;
