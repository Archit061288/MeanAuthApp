var express = require("express");
var router = express.Router();
const User = require("../models/user");
var jwt = require('jsonwebtoken');
var config = require('../config/database')
//const passport = require("passport");

// Register
router.post('/register',(req,res,next)=>{
	var newuser = new User({
		name:req.body.name,
		email:req.body.email,
		username:req.body.username,
		password:req.body.password
	})
	User.addUser(newuser,(err,docs)=>{
		if(err){
			res.json({success:false,msg:'Failed to register user'})
		}else{
			res.json({success:true,msg:'User registered'})
		}
	})
})

// Authenticate
router.post('/authenticate',(req,res,next)=>{
	const username =  req.body.username;
	const password =  req.body.password;

	User.getUserByUsername(username,(err,user)=>{
		if(err) throw err;
		if(!user){
			return res.json({success:false,msg:'User not found'})
		}
		User.comparepassword(password,user.password,(err,isMatch)=>{
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user,config.secret,{
					expiresIn:604800
				})
				res.json({
					success:true,
					token:token,
					user:{
						id:user.id,
						name:user.name,
						username:user.username,
						password:user.password
					}
				})

			}else{
				res.json({success:false,msg:'Wrong password'})
			}
		})
	})
})


// Profile
router.get('/profile',ensuretoken,(req,res,next)=>{
	jwt.verify(req.token,config.secret,function(err,data){
		if(err){
			res.sendStatus(403);
		}else{
			console.log("here")
			res.json({
				text:'this is protected',
				data:data
			})
		}
	})

})

function ensuretoken(req,res,next){
	const bearerheader = req.headers["authorization"];	
	if(typeof bearerheader != 'undefined'){
		req.token = bearerheader;
		next();
	}else{
		res.sendStatus(403);
	}
}

// Validate
router.get('/validate',(req,res,next)=>{
	res.send("Validate");
})

module.exports = router;