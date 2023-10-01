import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import userRoutes from './routes/user.js'
import groupRoutes from './routes/group.js'
import chatRoutes from './routes/chat.js'

import multer from 'multer'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'trusted-cdn.com'],
        },
    },
    
    })
);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/files')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
})

const upload = multer({storage})

app.post('/mediaChat',upload.single('file'),function (req,res){
    const file = req.file
res.status(200).json(file.filename)
})


app.use('/user',userRoutes)
app.use('/group',groupRoutes)
app.use('/chat', chatRoutes)



app.listen(8000, ()=>{
    console.log("server is running!")
})