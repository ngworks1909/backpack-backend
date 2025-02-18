import { prisma } from "../../db/client";

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
                    total: true
                }
            });
            if(!slot){
                return {success: false, message: "Slot not found"}
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
            })

            return {success: true, message: purchase.purchaseId}
        } catch (error) {
            return {success: false, message: "Internal server error"}
        }
    }

    async releaseSlot(purchaseId: string){
        try {
            await prisma.purchase.delete({
                where: {
                    purchaseId
                }
            });
            return true
        } catch (error) {
            return false
        }
    }
}

export const slotManager = SlotManager.getInstance();