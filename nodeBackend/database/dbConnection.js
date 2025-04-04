const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB")
}).catch(err => {
    console.error("Connection error:", err)
})
module.exports=mongoose