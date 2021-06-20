const express = require('express');
const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
const jwt= require('jsonwebtoken');
const router = express.Router();


const userSchema=require('../schemas/userSchema');

const User= new mongoose.model("User",userSchema);



//sign up
router.post('/signup',async(req, res)=>{

    try{
        const hashedPassword= await bcrypt.hash(req.body.password,10);
        const newUser= new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({
            message:"user was inserted successfully"
        });

    
      }catch{

        res.status(500).json({
            message:"Signup failed",
        });



      }




});

router.post('/login',async(req, res)=>{
    try {
        const user = await User.find({ username: req.body.username });
        if(user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

            if(isValidPassword) {
                // generate token
                const token =jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id,
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                res.status(200).json({
                    "access_token": token,
                    "message": "Login successful!"
                });
            } else {
                res.status(401).json({
                    "error": "Authetication failed!"
                });
            }
        } else {
            res.status(401).json({
                "error": "Authetication failed!"
            });
        }
    } catch {
        res.status(401).json({
            "error": "Authetication error failed!"
        });
    }



});

router.get("/all",async(req,res)=>{

    try{


        const users=await User.find({ })
        .populate("todos");
        res.status(200).json({ 
            data: users,
            message: "there was a server side error"
        }
            );

    }catch(e){
        console.log(e);
        res.status(500).json({ message: "there was a server side error"});
    }

});




module.exports = router;