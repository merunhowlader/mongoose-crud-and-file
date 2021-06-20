const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const todoSchema=require('../schemas/todoSchema');
const userSchema=require('../schemas/userSchema');

const Todo= new mongoose.model("Todo",todoSchema);
const User= new mongoose.model("User",userSchema);

const checkLogin = require('../middlewares/checkLogin');


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


///findActive
//instance method
router.get("/active",async(req, res)=>{
    const todo= new Todo();
    const data= await todo.findActive();
    res.status(200).json({
        data,
    })
});

// instance method with callback
router.get("/active-callback",(req, res)=>{
    const todo= new Todo();
    todo.findActiveCallback((err,data)=>{
        res.status(200).json({
            data,
        });

    });
   
});

router.get("/js",async(req, res)=>{

    const data= await Todo.findByJs();
    res.status(200).json({
        data,
    })
   
});

router.get("/language",async(req, res)=>{

    const data= await Todo.find().byLanguage("react");
    res.status(200).json({
        data,
    })
   
});



//populate use for one way relationship mongoose 
router.get('/',checkLogin,async(req, res)=>{

    

    await Todo.find({})
    .populate("user","name username -_id")
    .select({
        _id:0,
        _v:0,
        date:0
    })
    .limit(5)
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
// router.get('/',async(req, res)=>{

//     await Todo.find({status:'active'}).select({
//         _id:0,
//         _v:0,
//         date:0
//     })
//     .limit(2)
//     .exec(
//         (err,data)=>{

//             if(err){
//                 res.status(500).json({
//                     error:"there was a server side error"
//                 });
//             }
//             else{
//                 res.status(200).json({
    
//                     result:data,
//                     message:"successfully"
//                 });
        
//             }
    
//         }
//     );


// });


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

router.post('/',checkLogin,async(req, res)=>{
const newTodo= new Todo({
    ...req.body,
    user: req.userId
});
try{
    const todo= await newTodo.save();

    await  User.updateOne({
        _id:req.userId
    },{
        $push:{
           todos: todo._id
        }

    })

    res.status(200).json({
        message:"Todo was inserted successfully"
    });

}catch(err){
    console.log(err);
    res.status(500).json({
        error:"there was a server side error"
    });

}
 
    
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