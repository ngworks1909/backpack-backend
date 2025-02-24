import { Router } from "express";
import { UserRequest, verifySession } from "../middlewares/user/verifySession";
import { prisma } from "../db/client";

const router = Router();

router.get('/fetchwallet', verifySession, async(req: UserRequest, res) => {
    try {
        const userId = req.userId!
        const wallet = await prisma.wallet.findUnique({
            where: {
                userId
            },
            select: {
                amount: true
            }
        });
        if(!wallet){
            return res.status(400).json({success: false, message: "Wallet not found"});
        }
        return res.status(200).json({success: true, amount: wallet.amount});
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})

export default router;