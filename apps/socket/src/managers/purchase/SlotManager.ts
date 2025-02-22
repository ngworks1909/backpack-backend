import { prisma } from "../../db/client";
import { slot_collected } from "../../message/message";
import { socketManager } from "../socket/SocketManager";
import { userManager } from "../user/UserManager";

class SlotManager {
    private static instance: SlotManager
    static getInstance(){
        if(SlotManager.instance){
            return SlotManager.instance;
        }
        SlotManager.instance = new SlotManager();
        return SlotManager.instance;
    }

    async holdSlot(slotId: string, userId: string){
        try {
            const slot = await prisma.slot.findUnique({
                where: {
                    slotId
                },
                select: {
                    _count: {
                        select: {
                            purchases: true
                        }
                    },
                    total: true,
                    cardId: true
                }
            });
            if(!slot){
                return {success: false, message: "Slot not found"}
            }

            const user = await prisma.user.findUnique({
                where: {
                    userId
                }
            })

            if(!user){
                return {success: false, message: "User not found"}
            }


            if(slot._count.purchases === slot.total){
                return {success: false, message: "Slot is not available"}
            }

            const purchase = await prisma.purchase.create({
                data: {
                    slotId,
                    userId
                },
                select: {
                    purchaseId: true
                }
            });
            socketManager.broadcast(slot_collected, JSON.stringify({userId}))
            return {success: true, purchaseId: purchase.purchaseId, cardId: slot.cardId}
        } catch (error) {
            return {success: false, message: "Internal server error"}
        }
    }

    async releaseSlot(purchaseId: string, slotId: string){
        try {
            const purchase = await prisma.purchase.findUnique({
                where: {
                    purchaseId
                },
                select: {
                    payment: {
                        select: {
                            status: true
                        }
                    }
                }
            });
            if(!purchase){
                return true
            }
            if(purchase.payment && purchase.payment.status === "Success"){
                return false
            }
            await prisma.purchase.delete({
                where: {
                    purchaseId
                }
            })
            return true
        } catch (error) {
            return false
        }
    }
}

export const slotManager = SlotManager.getInstance();