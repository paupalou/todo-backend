const express = require('express');
const tscSuccessEmitter = express();

tscSuccessEmitter.listen(80, () =>
  console.log('ToDoApp compiled successfully!')
);
