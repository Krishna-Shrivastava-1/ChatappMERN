import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    message: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
   
}, { timestamps: true })

export default mongoose.model("Message", messageSchema)