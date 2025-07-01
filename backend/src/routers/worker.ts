import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "xyz";

router.post("/signin", async (req, res) => {
    try {
        // Add worker signin logic here
        const hardcodedWorkerAddress = "worker_address_placeholder";
        
        const existingWorker = await prisma.worker.findFirst({
            where: {
                address: hardcodedWorkerAddress
            }
        });

        if (existingWorker) {
            const token = jwt.sign({
                workerId: existingWorker.id
            }, JWT_SECRET);
            
            res.json({
                token,
                worker: {
                    id: existingWorker.id,
                    address: existingWorker.address,
                    pending_amount: existingWorker.pending_amount,
                    locked_amount: existingWorker.locked_amount
                }
            });
        } else {
            const worker = await prisma.worker.create({
                data: {
                    address: hardcodedWorkerAddress,
                    pending_amount: 0,
                    locked_amount: 0,
                    balance_id: 0
                }
            });
            
            const token = jwt.sign({
                workerId: worker.id
            }, JWT_SECRET);
            
            res.json({
                token,
                worker: {
                    id: worker.id,
                    address: worker.address,
                    pending_amount: worker.pending_amount,
                    locked_amount: worker.locked_amount
                }
            });
        }
    } catch (error) {
        console.error('Worker signin error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

export default router;