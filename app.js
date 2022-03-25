const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require('./models/todo')

mongoose.connect("mongodb://localhost/todo-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});

router.get('/todos', async (req, res) => {
    const todos = await Todo.find().sort('-order').exec();
    res.send({todos});
});

router.post('/todos', async (req, res) => {
    const { value } = req.body;
    const maxOrderTodo = await Todo.findOne().sort('-order').exec(); //비동기 통신을 하기 때문에, DB에 요청을 한 뒤 결과 값이 올 때까지 기다린다고 선언하는 것이 await이다.
    let order = 1;

    if(maxOrderTodo){
        order = maxOrderTodo.order + 1;
    }

    const todo = new Todo({ value, order });
    await todo.save();

    res.send({todo});

});

router.patch('/todos/:todoId', async (req, res) => {
    const {todoId} = req.params;
    const {order, value, done} = req.body;

    // 변경하려는 todo를 찾음
    const todo = await Todo.findById(todoId).exec();

    // order가 값을 받았을 때만 처리함.
    if(order){
        // 대상이 되는 todo를 찾음.
        const targetTodo = await Todo.findOne({ order }).exec();
        if(targetTodo){
            targetTodo.order = todo.order;
            await targetTodo.save();
        }
        todo.order = order;
        
    }else if(value){
        todo.value = value;
    }else if(done !== undefined){
        todo.doneAt = done ? new Date() : null;
    }

    await todo.save();
    res.send({});
});

router.delete('/todos/:todoId', async (req, res) => {
    const {todoId} = req.params;

    const todo = await Todo.findById(todoId).exec();
    await todo.delete();
    res.send({});

});

app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});