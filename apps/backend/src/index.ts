import express from "express"
import userRouter from "./routes/userRoute"
import cardRouter from './routes/cardRoute'
import slotRouter from './routes/slotRoute'
import cors from 'cors'
import dotenv from 'dotenv'
import walletRouter from './routes/walletRoute'
import paymentRouter from './routes/paymentRoute'


dotenv.config()
const app = express();

app.use(express.json())
app.use(express.static("public"))
app.use(cors())

app.use("/api/auth", userRouter);
app.use('/api/cards', cardRouter);
app.use('/api/slots', slotRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/payment', paymentRouter);



app.listen(3000)