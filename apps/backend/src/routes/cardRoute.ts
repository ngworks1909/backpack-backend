import { Router } from "express";
import { verifySession } from "../middlewares/user/verifySession";
import { prisma } from "../db/client";


const router = Router()

router.get("/fetchcards", async(req, res) =>{
    try {
        const cards = await prisma.card.findMany({
            select: {
                cardId: true,
                cardName: true,
                cardImage: true,
                slots: {
                    where: {
                        isActive: true
                    },
                    select: {
                        total: true,
                        remaining: true
                    }
                }
            }
        });
        return res.status(200).json({success: true, cards})
    } catch (error) {
        return res.status(200).json({success: false, message: "Internal server error"})
    }
})

export default router