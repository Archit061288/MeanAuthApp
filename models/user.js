const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userschema =  mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	username:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	}
});

const User = module.exports = mongoose.model("User",userschema);

module.exports.getUserById = function(id,callback){
	User.findById(id,callback);
}

module.exports.getUserByUsername = function(username,callback){
	const query = {username:username}
	User.findOne(query,callback);
}

module.exports.addUser = function(newuser,callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newuser.password, salt, function(err, hash) {
	        newuser.password = hash;
	        newuser.save(callback);
	    });
	});
}

module.exports.comparepassword = function(candpass,hash,callback){
	bcrypt.compare(candpass,hash,(err,isMatch)=>{
		if(err) throw err;
		callback(null,isMatch);
	})
}
