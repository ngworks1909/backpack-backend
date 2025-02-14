import express from 'express';
import http from 'http'
import { Server } from "socket.io";
import dotenv from 'dotenv'
import { extractJwtToken } from './middlewares/auth/auth';
import { userManager } from './managers/user/UserManager';

dotenv.config()
const app = express();


const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*", // Allow any origin (adjust as needed for production)
        methods: ["GET", "POST"], // Allow only specific HTTP methods
    }
});


io.on('connection', (socket) => {
    const token = socket.handshake.auth?.session;
    const user = extractJwtToken(token, socket);
    if(user){
        userManager.addUser(user);
    }
    socket.on('disconnect', () => {
        console.log("disconnected");
        if(user){
            userManager.removeUser(user.userId);
        }
    }); 
})


server.listen(process.env.PORT || 8080, () => {
    console.log(`Websocket server is running on port ${process.env.PORT || 8080}`)
})