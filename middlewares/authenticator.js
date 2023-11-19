
const jwt = require("jsonwebtoken");


function authenticator(req,res,next){
    const token=req.headers.authorization
    jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
        if(err) return res.send({message:"Token is not valid please login"})

        if(decode){
            req.body.user= decode.userId
            next()
        }else{
            res.send({message:"token not valid please login"})
        }
    })

}

module.exports={
    authenticator
}