import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma";

const router = Router();
const prismaClient = new PrismaClient();
const JWT_SECRET = "xyz"

//signin with wallet
router.post("/signin", async(req,res)=>{
    //add sign verification logic here
    const hardcodedwalletaddress =  "2121fe6d5c9d5599081c837a95477d21633156dcd3d1fb9c18b1452ee00e0252" 
    //mera NEAR wallet hai ye

    const existingUser = await prismaClient.user.findFirst({
        where: {
            address: hardcodedwalletaddress
        }
    })

    if(existingUser)
    {
        const token=jwt.sign({
            userId: existingUser.id
        }, JWT_SECRET);
        res.json({
            token
        })
    }
    else {
        const user = await prismaClient.user.create({
            data: {
                address: hardcodedwalletaddress
            }
        })
        const token=jwt.sign({
            userId: user.id
        }, JWT_SECRET);
        res.json({
            token
        })
    }
    
});
export default router;