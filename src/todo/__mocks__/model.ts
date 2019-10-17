import mongoose from 'mongoose';
import ITodo, { TodoParams } from './../interface';

const listOfDummyTodos: Array<any> = [
  {
    _id: mongoose.Types.ObjectId().toString(),
    title: 'TODO',
    done: false,
    created: new Date()
  },
  {
    _id: mongoose.Types.ObjectId().toString(),
    title: 'TODO2',
    text: 'Lorem Ipsum',
    done: false,
    created: new Date()
  }
];

export default {
  find: (args: TodoParams): Array<Partial<ITodo>> => {
    // if (!args || Object.keys(args).length === 0) {
    //   return [];
    // }

    // if (args.user) {
    // const a = await query.find();
    // a.push({
    //   _id: mongoose.Types.ObjectId().toString(),
    //   title: 'TODO',
    //   done: false,
    //   created: new Date()
    // });
    // const result = await query.exec();

    return listOfDummyTodos;
    // }

    // return [];
  },
  sort: (s: string): undefined => {
    return undefined;
  }
};
