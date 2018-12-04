require('./config/config.js');

const _          = require('lodash');
const express    = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose}   = require('./db/mongoose');
var {Todo}       = require('./models/todo');
var {User}       = require('./models/user');


var app = express();
const port = process.env.PORT;

//bodyParser will take the JSON and convert it into an object 
app.use(bodyParser.json());

app.post('/todos',(req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get('/todos',(req, res)=>{
  Todo.find().then((todos)=>{
    res.send({todos: todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

// GET /todos/:id
//we are creating a url parameter
//this will create an id variable and will be on the request object
app.get('/todos/:id',(req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send('Please provide valid object ID');
  }

  Todo.findById(id).then((todo)=>{
    if (!todo) {
      return res.status(404).send('We did not find a matching ID');
    }
    res.send({todo:todo});
  }).catch((e) => res.status.send(400));
});

app.delete('/todos/:id',(req, res) => {
  //get id
  var id = req.params.id;
  //validate the id -> not valid? return 404
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Please provide valid object ID');
  }
  //remove todo by id 
  Todo.findByIdAndRemove(id).then((todo)=> {
  //success 
    // if no doc, send 404
    if (!todo) {
      return res.status(404).send('We did not find a matching ID');
    }
    // if doc, send doc back with 200
    res.status(200).send({todo});   
  //error
    //400 with empty body
  }).catch((e) => { 
    res.status.send(400).send('empty body');
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  //Creates an object composed of the picked object properties
  //the only properties the user will be able to update 
  var body = _.pick(req.body, ['text', 'completed']);
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  //if body.completed is a boolean and it is true 
  if (_.isBoolean(body.completed) && body.completed) {
    // milliseconds since Jan 1, 1970, 00:00:00.000 GMT
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  //option: new - if true, retun the modified document
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    //x-auth - you are creating a custom header
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};