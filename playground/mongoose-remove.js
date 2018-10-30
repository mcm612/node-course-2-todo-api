const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//Todo.findOneAndRemove
//Todo.findByIdandRemove
Todo.findOneAndRemove({_id: '5bd7399869486a327061be09'}).then((todo)=> {
  console.log(todo);
});
Todo.findByIdAndRemove('5bd7399869486a327061be09').then((todo)=> {
  console.log(todo);
});