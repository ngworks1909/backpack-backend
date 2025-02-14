
import { User } from "./User";

class UserManager {
    private static instance: UserManager
    private readonly onlineUsers: Map<string, User>
    constructor(){
        this.onlineUsers = new Map()
    }
    static getInstance(){
        if(UserManager.instance){
            return UserManager.instance;
        }
        UserManager.instance = new UserManager();
        return UserManager.instance;
    }

    addUser(user: User) {
        console.log("adding user")
        this.onlineUsers.set(user.userId, user);
    }

    removeUser(userId: string) {
        console.log("Removing user with userId: ", userId);
        this.onlineUsers.delete(userId)
    }

    getUser(userId: string) {
        return this.onlineUsers.get(userId)
    }


}

export const userManager = UserManager.getInstance()