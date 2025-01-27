import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://127.0.0.1:5501'],
    credentials: true,
    methods: ['GET', 'POST', 'UPDATE', 'DELETE', 'HEAD', 'OPTIONS']
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'
import expenseRouter from './routes/expense.route.js'

// routes declaration
app.use('/api/v1/users', userRouter)
app.use('/api/v1/expenses', expenseRouter)

export { app }