require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

// Load Mongoose
const mongoose = require("mongoose");

// Global User Object which will be the instance of MongoDB document
var User;

async function connectMongoose() {
	await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology:true }).then(() =>{
		console.log("mongoose connected..")
	})
	require("./Models/User")
	User = mongoose.model("User")
}

// Load initial modules
async function initialLoad() {
	await connectMongoose();
}

initialLoad()


let refreshTokens = []
app.post('/user/token',(req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.email})
        res.json({accessToken:accessToken})
    })
})

app.delete('/user/logout', (req,res) => {
    refreshTokens=refreshTokens.filter(token=>token !== req.body.token)
    res.sendStatus(204)
})


app.post('/user/login', (req,res) => {
    //Authenticate User
    User.find({email:req.body.email}).then((user) => {
		if(user){
            user = user[0];
			const accessToken = generateAccessToken(user)
            const refreshToken=jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)
            res.json({accessToken: accessToken,user:user, refreshToken:refreshToken})
		} else {
			res.sendStatus(404)
		}
	}).catch( err => {
		if(err) {
			throw err
		}
	})
    
    
    

})

function generateAccessToken(user)
{
   return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '10m' }) 
}

app.listen(4000)