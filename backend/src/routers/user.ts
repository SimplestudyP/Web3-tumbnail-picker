import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "xyz";

//signin with wallet
router.post("/signin", async(req,res)=>{
    try {
        //add sign verification logic here
        const hardcodedwalletaddress =  "2121fe6d5c9d5599081c837a95477d21633156dcd3d1fb9c18b1452ee00e0252" 
        //mera NEAR wallet hai ye

        const existingUser = await prisma.user.findFirst({
            where: {
                address: hardcodedwalletaddress
            }
        })

        if(existingUser) {
            const token = jwt.sign({
                userId: existingUser.id
            }, JWT_SECRET);
            
            res.json({
                token,
                user: {
                    id: existingUser.id,
                    address: existingUser.address
                }
            })
        } else {
            const user = await prisma.user.create({
                data: {
                    address: hardcodedwalletaddress
                }
            })
            
            const token = jwt.sign({
                userId: user.id
            }, JWT_SECRET);
            
            res.json({
                token,
                user: {
                    id: user.id,
                    address: user.address
                }
            })
        }
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

export default router;