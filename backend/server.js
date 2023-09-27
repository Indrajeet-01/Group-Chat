import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import userRoutes from './routes/user.js'
import groupRoutes from './routes/group.js'
import chatRoutes from './routes/chat.js'

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


app.use('/user',userRoutes)
app.use('/group',groupRoutes)
app.use('/chat', chatRoutes)



app.listen(8000, ()=>{
    console.log("server is running!")
})