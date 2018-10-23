//we can start to connect to the database
//mongoclient - lets you connect to a mongo server and issue commands to the db
//pulling out an object property into a variable
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//   db.collection('Todos').insertOne({
//     text: 'Something to do',
//     completed: false
//   }, (err, result) => {
//     if (err) {
//         return console.log('Unable')
//     }

//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });

//insert new doc into Users (name, age, location)

//   db.collection('Users').insertOne({
//     name: 'Michael Manguart',
//     age: 36,
//     location: 'Key Biscayne'
//   }, (err, result) => {
//     if (err) {
//         return console.log('Unable', err)
//     }

//     console.log(result.ops[0]._id.getTimestamp());
//   });

  db.close();
});