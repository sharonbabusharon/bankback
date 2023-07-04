//imports
const express=require("express")

//import cors
const cors=require("cors")

//import logic.js

const logic=require('./services/logic')

//import jwt token

const jwt=require('jsonwebtoken')

//create a server using express

const server =express()

//use cors in server app
server.use(cors({
	origin:"http://localhost:4200"
}))

server.use(express.json())

//to resolve client requests
// server.get("/",(req,res)=>{
// 	res.send('GET METHOD')
// })

// server.post("/",(req,res)=>{
// 	  res.send('post method')
// })

//setup port for the sever

server.listen(5000,()=>{
	console.log("server has started at port 5000");
})

//application specific middleware

const appMiddleware=(req,res,next)=>{
	next()
	console.log("application specifc middleware");
}

//use application specific middleware
server.use(appMiddleware)

//middleware for verifying token to check user is logined or not
const jwtMiddleware=(req,res,next)=>{

	//get token from request header
	const token=req.headers['verify-token'];
	console.log(token);//verify token

	try{
		const data=jwt.verify(token,'heloworld123');
		console.log(data);
		req.currentAcno=data.loginAcno
		next()
	}
	catch{
		res.status(401).json({message:"please login"})
	}
}

//Bank request 
//register
//login
//balace enquiry
//fund transfer


//register
server.post('/register',(req,res)=>{
	
	console.log("inside the register api call");
	console.log(req.body);
	
	logic.register(req.body.acno,req.body.username,req.body.password)
	 .then((result)=>{
	 	res.status(result.statusCode).json(result)
	 })
	// res.send("resgister succesfull")
	//res.status(200).json({message:"Request Recived"})
})

//login api call

server.post("/login",(req,res)=>{
	console.log("inside login api call"); 
	console.log(req.body);
	logic.login(req.body.acno,req.body.password).then((result)=>{
		res.status(result.statusCode).json(result)
	
	})
})

//get balance api call

server.get('/getbalance/:acno',jwtMiddleware,(req,res)=>{

	console.log(req.params)
	  logic.getBalance(req.params.acno).then((result)=>{
		res.status(result.statusCode).json(result)
	});

})

//fund transfer api call

server.post("/fund-transfer",jwtMiddleware,(req,res)=>{
	console.log("inside the fund transfer");
	console.log(req.body);
	logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
		res.status(result.statusCode).json(result)
	})
})

//get transaction api call

server.get('/getTransactionHistory',jwtMiddleware,(req,res)=>{
	console.log("inside GetTransactionHostory");
	logic.transactionHistory(req.currentAcno).then((result)=>{
		res.status(result.statusCode).json(result)
	})
})


//delete account
server.delete("/delete-account",jwtMiddleware,(req,res)=>{
	console.log("inside delete account");
	logic.deleteUserAccount(req.currentAcno).then((result)=>{
		res.status(result.statusCode).json(result)
	})
})