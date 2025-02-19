import { Router } from "express";
import { UserRequest, verifySession } from "../../middlewares/auth/verifySession";
import { prisma } from "../../db/client";

const router = Router();


router.put('/update', verifySession, async(req: UserRequest, res) => {
    try {
        //verify the payment
        //find purchase id through orderId
        //if success then SlotManager.approveSlot(purchaseId)
        //else call SlotManager.releaseSlot(purchaseId)
    } catch (error) {
        
    }
})