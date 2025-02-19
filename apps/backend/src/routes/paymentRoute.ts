import Razorpay from "razorpay";
import { Router } from "express";
import { UserRequest, verifySession } from "../middlewares/user/verifySession";
import { prisma } from "../db/client";
import { createPaymentSchema } from "../zod/paymentSchema";
import crypto from 'crypto';

const key_secret = process.env.RAZORPAY_KEY_SECRET ?? ""

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? "",
    key_secret
});

const router = Router();

router.post('/createPayment', verifySession, async(req: UserRequest, res) => {
    try {
        const userId = req.userId!
        const user = await prisma.user.findUnique({
            where: {
                userId
            }
        });

        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        };

        const isValidCreation = createPaymentSchema.safeParse(req.body);
        if(!isValidCreation.success){
            return res.status(400).json({success: false, message: "Invalid request"})    
        }

        const { purchaseId, amount } = isValidCreation.data;

        const options = {
            amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
            currency: 'INR',
            receipt: `receipt_order_${new Date().getTime()}`, // Dynamic receipt
            payment_capture: 1, // Auto-capture
        };

        const order = await razorpay.orders.create(options);

        await prisma.payment.create({
            data: {
                purchaseId,
                userId,
                orderId: order.id,
                amount,
                paymentId: order.id,
            }
        })

        return res.json({success: true, orderId: order.id, amount: order.amount})
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }
});



