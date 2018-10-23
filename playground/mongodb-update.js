const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
 
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5bcf23d369486a3270614e45')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });
    db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5bce3839f723875b674a6681')
  }, {
    $set: {
      name: 'Jen Jen Manguart',
    },
    $inc: {
      age: -36
    }
  },{
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });
  //db.close();
});