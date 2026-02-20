const exp = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect("mongodb://localhost:27017/todoAppDB")
.then(()=>{
     console.log("connected to DB");
})
.catch((err)=>{
     console.log(err);
});

const todosche = new mongoose.Schema({
     title: {
          required: true,
          type: String
     },
     des: String
});

const todoModel = mongoose.model('Todo', todosche);

const app = exp();

app.use(exp.json());
app.use(cors());
app.post('/todo',async (req, res)=>{

    const {title,des} = req.body;
    try{
     const newTodo = new todoModel({title,des});
     await newTodo.save();
     res.status(201).json(newTodo);
    }
    catch(err){
         res.status(500).json({message: err.message});
    }

     })

app.get('/todo', async (req,res)=>{
     try{
      const dataget = await todoModel.find();
      res.status(201).json(dataget);
     }
     catch(err){
          console.log(err);
          res.status(500).json({message: err.message});
     }
})

app.put('/todo/:id',async (req,res)=>{
     try{
     const id = req.params.id;
     const {title,des} = req.body;
     const updatodo = await todoModel.findByIdAndUpdate(id,{title,des},{new:true});
     if(!updatodo){
         return res.status(404).json({message: "Todo not found"});
    }
     res.status(200).json(updatodo);
     }
     catch(err){
          res.status(500).json({message: err.message});
     }
})

app.delete('/todo/:id',async (req,res)=>{
     const id = req.params.id;
     try{
             await todoModel.findByIdAndDelete(id);
          if(!deletetodo){
               return res.status(404).json({message: "Todo not found"});
          }
          res.status(200).json({message: "Todo deleted successfully"}).end();
     }
     catch(err){
          res.status(500).json({message: err.message});     
     }
})

const port = 8000;
app.listen(port,()=>{
     console.log('server is running......')
})