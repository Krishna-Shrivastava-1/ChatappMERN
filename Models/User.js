import mongoose, { Schema } from 'mongoose'


const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    descript:{
        type:String,
        default:'Hey! Iam using a Krix Product'
    }
    // ,
    // createdAt :{
    //     timestamps:true,
    //     default:new Date()
    // }
}, { timestamps: true })

export default  mongoose.model("User", userSchema)