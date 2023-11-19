const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { NoteModel } = require("../models/NoteModel");
const { authenticator } = require("../middlewares/authenticator");

const noteRouter = express.Router();
noteRouter.use(authenticator)

noteRouter.get("/",async (req,res)=>{
     let token= req.headers.authorization
     jwt.verify(token,SECRET_KEY,async (err,decode)=>{
        try{
            let data = await NoteModel.find({user:decode.userId})
            res.send({data:data,message:"Success"})

        }catch(error){
            res.send({message:error.message})

        }
     })


    

})

noteRouter.post("/create",async (req,res)=>{

    try{
        let note= new NoteModel(req.body)
        await note.save()
        res.send({message:"Note created"})

    }catch(error){

        res.send({message:error.message})
    }

})

noteRouter.patch("/",async (req,res)=>{
    let {id} =req.headers
    try{
        await NoteModel.findByIdAndUpdate({_id:id},req.body)
        res.send({message:"Note Updated"})

    }catch(error){
        res.send({message:error.message})

    }
})

noteRouter.delete("/",async (req,res)=>{
    let {id} =req.headers
    try{
        await NoteModel.findByIdAndDelete({_id:id})
        res.send({message:"Note Deleted"})

    }catch(error){
        res.send({message:error.message})

    }
})


module.exports={
    noteRouter
}