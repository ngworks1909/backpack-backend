import { userManager } from "../user/UserManager";

class SocketManager {
    private static instance: SocketManager
    static getInstance(){
        if(SocketManager.instance){
            return SocketManager.instance;
        }
        SocketManager.instance = new SocketManager();
        return SocketManager.instance;
    }

    broadcast(event: string, message: string){
        userManager.onlineUsers.forEach((user) => {
            user.socket.emit(event, message)
        })
    }
}

export const socketManager = SocketManager.getInstance();