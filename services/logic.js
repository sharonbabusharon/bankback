//import db.js

const db=require('./db')

//import jwt token
const jwt=require('jsonwebtoken')

//logic for register
//asymchornous function-comes with promise-handled with .then

const register=(acno,username,password)=>{
	console.log("REGISTER WORKS");

	//acno in db?
	// if yes
	return db.User.findOne({acno}).then((response)=>{
		if(response){
			return{
				statusCode:401,
				message:"Account Already Exist!!"
			}
		}else{
		//    create new object for registration
		   const newUser=new db.User({
			acno,
			username,
			password,
			balance:5000,
			transaction:[]
		   })

	// 	   //to save in database
		   newUser.save()

	// 	   //to send response back to the sever
		   return{
			statusCode:200,
			message:"succesfully registered"
		   }
		}
	})

}

//logic for login function-asynchornous function

const login=(acno,password)=>{
	console.log("inside the login function");

	return db.User.findOne({acno,password}).then((result)=>{
		if(result){
			
			//token generated
			const token=jwt.sign({loginAcno:acno},'heloworld123')


			return{
				statusCode:200,
				message:"Login Succesfull",
				currentUser:result.username,
				token,//send to client automatically
				currentAcno:acno//sent to client or front end-send to login .ts
			}

		}
		//acno not present in database
		else{
			return{
				statusCode:401,
				message:"Invalid Data"
			}
		}
	})
}

//logic for balace enquiry
const getBalance=(acno)=>{
	//check acno in database

	return db.User.findOne({acno}).then((result)=>{
		if(result){
			return{
				statusCode:200,
				balance:result.balance
			}
			
		}else{
			return{
				statusCode:401,
				message:'Invalid Data'
			}
		}
	})
}

//fund trnasfer

const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
	//convert amt to number
	let amount=parseInt(amt)

	//check from acnt in mongodb
	return db.User.findOne({
		acno:fromAcno,
		password:fromAcnoPswd
	}).then((debitDetails)=>{
		if(debitDetails){
			// to ckeck to-account number
			return db.User.findOne({
				acno:toAcno
			}).then((creditDetails)=>{
				if(creditDetails){
					//check the balance in from acc>amount
					if(debitDetails.balance>amount){
							debitDetails.balance-=amount;
							debitDetails.transaction.push({
								type:"Debit",
								amount,
								fromAcno,
								toAcno
							})
							//save changes to the mongodb
							debitDetails.save()

							//update to the toAcno
							creditDetails.balance+=amount
							creditDetails.transaction.push({
								type:"Credit",
								amount,
								fromAcno,
								toAcno
							})

							//save changes to mongodb
							creditDetails.save()

							//send response to the client side
							return{
								statusCode:200,
								message:"Fund Transfer Succesfull!!"
							}
					}else{
						return{
							statusCode:401,
							message:"Insufficient Balance!!"
						}
					}

				}else{
					return{
						statusCode:401,
						message:'Invalid Data!!'
					}
				}
			})
		}else{
			return{
				statusCode:401,
				message:"Invalid Details!!"
			}
			
		}
	})
}

//get transaction history

const transactionHistory=(acno)=>{
	return db.User.findOne({acno}).then((result)=>{
		if(result){
			return{
				statusCode:200,
				transaction:result.transaction
			}
		}else{
			return{
				statusCode:401,
				message:"Invalid Data!!"
			}
		}
	})
}

const deleteUserAccount=(acno)=>{
	//acno delete from monggodb
	return db.User.deleteOne({acno}).then((result)=>{
		return{
			statusCode:200,
			message:"Account deleted succesfully"
		}
	})
}

//exporrt function
module.exports={
	register,
	login,
	getBalance,
	fundTransfer,
	transactionHistory,
	deleteUserAccount
}
