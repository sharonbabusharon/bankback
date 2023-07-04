// //database connection with nodejs
// //import mongoose

const mongoose=require("mongoose")

// //define a connection string between express and mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/BankServer')


// //create a model and schema for storing data in to the database
// //model=user schema=inside{}
const User=mongoose.model('User',{
	acno:Number,
	username:String,
	password:String,
	balance:Number,
	transaction:[]
})

// //export the collection
module.exports={
	User
}








