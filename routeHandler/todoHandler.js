const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const todoSchema=require('../schemas/todoSchema');

const Todo= new mongoose.model("Todo",todoSchema);


//get all the todos

// router.get('/',async(req, res)=>{

//     await Todo.find({status:'active'},(err,data)=>{

//         if(err){
//             res.status(500).json({
//                 error:"there was a server side error"
//             });
//         }
//         else{
//             res.status(200).json({

//                 result:data,
//                 message:"successfully"
//             });
    
//         }

//     });


// });

router.get('/',async(req, res)=>{

    await Todo.find({status:'active'}).select({
        _id:0,
        _v:0,
        date:0
    })
    .limit(2)
    .exec(
        (err,data)=>{

            if(err){
                res.status(500).json({
                    error:"there was a server side error"
                });
            }
            else{
                res.status(200).json({
    
                    result:data,
                    message:"successfully"
                });
        
            }
    
        }
    );


});


//get a todos by id

router.get('/:id',async(req, res)=>{

  await Todo.find({_id:req.params.id}, (err,data)=>{

    if(err){
        res.status(500).json({
            error:"there was a server side error"
        });
    }
    else{
        res.status(200).json({

            result:data,
            message:"successfully"
        });

    }

})


    
});

//post a todos 

router.post('/',async(req, res)=>{
const newTodo= new Todo(req.body);
await newTodo.save((err)=>{
    if(err){
        res.status(500).json({
            error:"there was a server side error"
        });
    }
    else{
        res.status(200).json({
            message:"Todo was inserted successfully"
        });

    }
});
    
});

//post multiple todos 

router.post('/all',async(req, res)=>{

   await Todo.insertMany(req.body,(err)=>{
       if(err){
        res.status(500).json({
            error:"there was a server side error"
        });

       }
       else{
        res.status(200).json({
            message:"Todo were inserted successfully"
        });


       }
   });

    
});

//put multiple todos 

router.put('/:id',async(req, res)=>{
    const result = await Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            status: "active",
          },
        },
        {
          new: true,
          useFindAndModify: false,
        },
        (err) => {
          if (err) {
            res.status(500).json({
              error: "There was a server side error!",
            });
          } else {
            res.status(200).json({
              message: "Todo was updated successfully!",
            });
          }
        }
      );
      console.log(result);
    
});

//delete todos


router.delete('/:id',async(req, res)=>{


  await Todo.deleteOne({_id:req.params.id}, (err)=>{
    if(err){
        res.status(500).json({
            error:"there was a server side error"
        });
    }
    else{
        res.status(200).json({
            message:"todo was deleted successfully"
        });

    }

})
    
});

module.exports = router;