const express = require('express');

const mongoose = require('mongoose');

const todoHandler=require('./routeHandler/todoHandler');



const app=express();

app.use(express.json());

//database connection with mongoose
mongoose.connect('mongodb://localhost/todos',{
     useNewUrlParser: true ,
      useUnifiedTopology: true
     })
.then(()=>console.log(' connection successful'))
.catch(err => console.log(err))


app.use('/todo',todoHandler);
//file multer

// const multer = require('multer');
// const path = require('path');

// const UPLOAD_FOLDER = './uploads/';

// //define the storage

// const storage =multer.diskStorage({
//   destination:(req, file,cb)=>{
//       cb(null,UPLOAD_FOLDER);
//   },
//   filename:(req, file,cb)=>{

//     const fileExt=path.extname(file.originalname);
//     const fileName=file.originalname.replace(fileExt,"").toLocaleLowerCase().split(" ").join("-")+"-"+Date.now()
//     cb(null,fileName+fileExt);
//   },
// });
// var upload=multer({
//     // dest:UPLOAD_FOLDER,
//     storage:storage,
//     limits:{
//         fileSize:100000,

//     },
//     fileFilter:(req,file,cb)=>{
//         if(
//             file.mimetype==="image/png"||
//             file.mimetype==="image/jpg"||
//             file.mimetype==="image/jpeg"
//         ){

//             cb(null,true);

//         }else{
//             cb(new Error(" only .jpg .png lor .jpeg format allowed"));
//         }
//     }
// });

// const app=express();
// app.use(express.static('public'));

// app.get("/",(req, res) => {
//     res.sendFile("index.html");
// });

// app.post("/",upload.single("avatar"),(req, res) => {
//     res.send("hello world");
// });


function errorHandler(err,req,res,nest){
    if(res.headersSent){
        return next(err);
    }
    res.status(500).json({error:err});
}

app.use((err,req,res,next)=>{

    if(err){
        if(err ){
            res.status(500).send("there was an upload error");

        }
        else{
            res.status(500).send(err.message);

        }
        
    }
    else{
        res.send("success");
    }
})

app.listen(3000,()=>{
    console.log("app listening at gg port 3000");
});
