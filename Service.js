// Load express
require('dotenv').config()
const express  = require("express");
const app = express()
const bodyParser = require("body-parser");
const axios = require("axios");
const jwt = require('jsonwebtoken');
const CouponJS = require('couponjs');

var notify = require('./Notification.js');

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 


// Load Mongoose
const mongoose = require("mongoose");

// Global User Object which will be the instance of MongoDB document
var User;
var GeneratedDiscount;
var UserTakenCodes;
async function connectMongoose() {
	await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology:true }).then(() =>{
		console.log("mongoose connected..")
	})
	require("./Models/User")
	User = mongoose.model("User")

	require("./Models/GeneratedDiscount")
	GeneratedDiscount = mongoose.model("Generated_Discount")

	require("./Models/UserTakenCodes")
	UserTakenCodes = mongoose.model("User_Taken_Codes")
}


// Load initial modules
async function initialLoad() {
	await connectMongoose();
}

initialLoad()


// A function to authenticate authorization tokens
function authenticateToken(req, res, next){
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (token == null) return res.sendStatus(401)
   
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
	   if (err) return res.sendStatus(403)
	   req.user = user
	   next()
	})
   }

   //Validate User Creation
function validateUser(newUser){
	   if (
		   !newUser.firstName || newUser.firstName.trim() === '' 
	      || !newUser.lastName || newUser.lastName.trim() === ''
		  || !newUser.email || newUser.email.trim() === '' 
	      || !newUser.phone || newUser.phone.trim() === ''
		  || !newUser.userType || newUser.userType.trim() === ''
		  ) 
	   {
		 return false
	   }
	   return true
   }

//Log all chosen or pick codes
function logTakenCode(data)
{
	const taken = {
		"userID":data.userId,
		"brandUserID": data.brandUserId,
		"codeID":data.codeId,
		"createdAt": new Date(),
	}

	try
	{
			// Create new User instance..
			const codeTaken = new UserTakenCodes(taken)
			codeTaken.save().then((r) => {
				
			}).catch( (err) => {
				if(err) {
					throw err
				}
			})

			return true
	}
	catch(e){
		return false
	}
}


//check object is empty
function isObjectEmpty(obj)
{
	if(Object.keys(obj).length === 0)
		return true
	return false
}


// Main endpoint. Test the authentication middleware 
app.get("/",authenticateToken, (req, res) => {
	//get authenticated user session variables
	console.log(req.user.user._id)
	res.send("This is our main endpoint")
})


// Create new user ==> Brand User or Normal User 
app.post("/user", async (req, res) => {
	if(isObjectEmpty(req.body))
		return res.status(404).send({message:"Pass body parameters",data:[]})

	const newUser = {
		"firstName":req.body.firstName,
		"lastName": req.body.lastName,
		"email":req.body.email,
		"phone": req.body.phone,
		"userType": req.body.userType, // 1 for brand, 0 for normal user
		"createdAt": new Date(),
	}

	if(validateUser(newUser))
	{
			// Create new User instance..
			const user = new User(newUser)
			user.save().then((r) => {
				res.send({message:"User created successfully...", data:user})
			}).catch( (err) => {
				if(err) {
					throw err
				}
			})
	}
	else{
		res.status(400).send({message:"Post fields are all required.",data:[]})
	}
	
})


// GET all users
app.get("/users",async (req, res) => {
	User.find().then((users) => {
		res.send(users)
	}).catch((err) => {
		if(err) {
			throw err
		}
	})
})



// GET single user
app.get("/user/:uid",async (req, res) => {
	User.findById(req.params.uid).then((user) => {
		if(user){
			res.json(user)
		} else {
			res.sendStatus(404)
		}
	}).catch( err => {
		if(err) {
			throw err
		}
	})
})


//Generate discount Code by Brand 
app.post("/discount/generatecodes",authenticateToken, (req, res) => {
	if(isObjectEmpty(req.body))
		return res.status(404).send({message:"Pass body parameters",data:[]})
	try{
		let allCodes = []
		new CouponJS({ maxNumberOfCouponsToGenerate: 100})
			.generate({
				length: req.body.length,
				numberOfCoupons: req.body.numberOfCoupons,
				characterSet: {
					builtIn: ['CHARSET_ALPHA', 'CHARSET_DIGIT']
				}
			})
			.forEach(code => {
				const record = {
					"brandUserId":req.body.brandUserId,
					"discountCode": code,
					"createdAt":new Date(),
				}
				new GeneratedDiscount(record).save()
				allCodes.push(code)
			})
		
			res.send({"message": req.body.numberOfCoupons + " Discount codes Generated successfully by brand "+" ["+req.body.brandUserId+"]", 
			          "data": allCodes })
	}
	catch(error){
		if(error) {
			throw error
		}
	}

})


//Get all Codes By Brand User
app.get("/discount/codes",authenticateToken, async (req, res) => {
	if(isObjectEmpty(req.body))
		return res.status(404).send({message:"Pass body parameters",data:[]})
	try{
		
		if(req.body.brandUserId.trim().length === 0 ||  req.body.brandUserId.trim().length < 24)
		{
			return res.status(404).send({message:"Check Brand ID",data:[]})
		}
		GeneratedDiscount.find({brandUserId:req.body.brandUserId}).then((codes) => {
			if(codes){
				res.send({message:"Codes available",data:codes})
			} else {
				res.status(404).send({message:"No codes available",data:[]})
			}
		}).catch( err => {
			if(err) {
				throw err
			}
		})
  }
  catch(e)
  {
	throw e
  }
})





//Fetch a discount code for User
app.get("/discount/fetchcode",authenticateToken, async (req, res) => {
    
	if(isObjectEmpty(req.body))
		return res.status(404).send({message:"Pass body parameters",data:[]})
	if(req.body.brandUserId.trim().length === 0 ||  req.body.brandUserId.trim().length < 24)
		return res.status(404).send({message:"Check Brand ID",data:[]})
	if(req.body.UserId.trim().length === 0 ||  req.body.UserId.trim().length < 24)
		return res.status(404).send({message:"Check User ID",data:[]})


	await GeneratedDiscount.find({brandUserId:req.body.brandUserId}).then((code) => {
		if(code){
			var value = code[Math.floor(Math.random() * code.length)]
			
			//save taken discount code and notify Brand User
			if(logTakenCode({"userId":req.body.UserId,"brandUserId": req.body.brandUserId,"codeId":value._id}) === true)
			{  
				User.findById(value.brandUserId).then((user) => {
					if(user){
						notify.SendEmail({email:user.email,code:value.discountCode})
					} 
				})
				res.send({message:"You discount Code is: "+value.discountCode,data:value})
			}

		} else {
			res.status(404).send({message:"No codes available",data:[]})
		}
	}).catch( err => {
		if(err) {
			throw err
		}
	})
})




// APP listening on port 4040
app.listen(5050, () => {
	console.log("Up and running! -- Discount Generator service")
})
