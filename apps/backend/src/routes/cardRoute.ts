import { Router } from "express";
import { verifySession } from "../middlewares/user/verifySession";
import { prisma } from "../db/client";
import { verifyAdmin } from "../middlewares/admin/verifyAdmin";
import { createCardSchema } from "../zod/cardSchema";


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
                        _count: {
                            select: {
                                purchases: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json({success: true, cards})
    } catch (error) {
        return res.status(200).json({success: false, message: "Internal server error"})
    }
})

router.post('/createcard', verifyAdmin, async(req, res) => {
    try {
        const isValidCard = createCardSchema.safeParse(req.body);
        if(!isValidCard.success){
            return res.status(400).json({success: false, message: "Invalid details"});
        }
        const {cardName} = isValidCard.data;
        const cardImage = "card.png"
        const card = await prisma.card.create({
            data: {
                cardName,
                cardImage
            },
            select: {
                cardId: true
            }
        });

        const slots = [];
        const currentHour = new Date().getHours();

        // Generate slots from 0 to 23
        for (let start = 0; start <= 23; start++) {
          const total = Math.floor(Math.random() * (200 - 100 + 1)) + 100; // Random between 100 and 200
          slots.push({
            cardId: card.cardId,
            start,
            end: (start + 1) % 24, // Ensures wrapping from 23 to 0
            total,
            remaining: total,
            isActive: start === currentHour, // Set active slot based on the current hour
          });
        }

        const newCard = await prisma.card.findUnique({
            where: {
                cardId: card.cardId
            },
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
                        _count: {
                            select: {
                                purchases: true
                            }
                        }
                    }
                }
            }
        })

        return res.status(200).json({success: true, card: newCard});
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})




export default router