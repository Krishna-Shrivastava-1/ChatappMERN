import express from 'express'
import dotenv from 'dotenv'
const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import Authroutes from './Routes/Authroutes.js'
import Messageroutes from './Routes/Messageroutes.js'
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
    origin:'https://krixy.netlify.app',
    credentials:true,
    methods:"GET,POST",
    allowedHeaders:'Content-Type,Authorization'
}))
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("Database Connected")).catch((err)=>console.log(err))


app.use('/auth',Authroutes)
app.use('/message',Messageroutes)

app.listen(port,()=>{
    console.log("Server is listen on ", port)
})




