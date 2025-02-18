
import { hold_slot, slot_collected } from "../../message/message";
import { slotValidator } from "../../zod/slotValidator";
import { slotManager } from "../purchase/SlotManager";
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
        this.addListener(user);
    }

    removeUser(userId: string) {
        console.log("Removing user with userId: ", userId);
        this.onlineUsers.delete(userId)
    }

    getUser(userId: string) {
        return this.onlineUsers.get(userId)
    }

    private addListener(user: User){
        user.socket.on(hold_slot, async(data) => {
            console.log("Holding slot");
            const isValidSlot = slotValidator.safeParse(data);
            if(!isValidSlot.success) {
                console.log("Invalid slot");
                return;
            }
            const slotId = isValidSlot.data;
            console.log("This is slotId: ", slotId);
            const {success, message} = await slotManager.holdSlot(slotId, user.userId)
            console.log(`${success} ${message}`)
            if(success){
                const data = JSON.stringify({message})
                user.socket.emit(slot_collected, data);
            }
        })
    }
}

export const userManager = UserManager.getInstance()