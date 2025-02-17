import { Router } from "express";
import { prisma } from "../db/client";

const router = Router();

router.get('/fetchslots/:cardId', async(req, res) => {
    try {
        const cardId = req.params.cardId;
        if(!cardId){
            return res.status(400).json({success: false, message: "Invalid cardId"})
        }
        // const slots = await prisma.slot.findMany({
        //     where: {
        //         cardId
        //     },
        //     orderBy: [
        //         { isActive: "desc" }, // Active slot first
        //         { start: "asc" } // Then order by start time
        //     ],
        //     select: {
        //        slotId: true,
        //        start: true,
        //        end: true,
        //        total: true,
        //        remaining: true
        //     }
        // })
        const slots = await prisma.card.findUnique({
            where:{
                cardId
            },
            select: {
                cardName: true,
                cardImage: true,
                slots: {
                    orderBy: [
                        { isActive: "desc" }, // Active slot first
                        { start: "asc" } // Then order by start time
                    ],
                    select: {
                       slotId: true,
                       start: true,
                       end: true,
                       total: true,
                       remaining: true
                    }
                }
            }
        })
        return res.status(200).json({success: true, slots})
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})

export default router