
import { decrement_slot, hold_slot, slot_collected, slot_failed } from "../../message/message";
import { slotValidator } from "../../zod/slotValidator";
import { slotManager } from "../purchase/SlotManager";
import { socketManager } from "../socket/SocketManager";
import { User } from "./User";

class UserManager {
    private static instance: UserManager
    private readonly _onlineUsers: Map<string, User>
    constructor(){
        this._onlineUsers = new Map()
    }
    static getInstance(){
        if(UserManager.instance){
            return UserManager.instance;
        }
        UserManager.instance = new UserManager();
        return UserManager.instance;
    }

    get onlineUsers(){
        return this._onlineUsers
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
            const isValidSlot = slotValidator.safeParse(data);
            if(!isValidSlot.success) {
                console.log("Invalid slot");
                return;
            }
            const slotId = isValidSlot.data;
            const {success, message, purchaseId, cardId} = await slotManager.holdSlot(slotId, user.userId)
            if(success){
                user.socket.emit(slot_collected, purchaseId)
                socketManager.broadcast(decrement_slot, cardId??"");
            }
            else{
                user.socket.emit(slot_failed, message)
            }
        })
    }
}

export const userManager = UserManager.getInstance()