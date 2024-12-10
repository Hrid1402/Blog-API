const {Router} = require("express");
const userRouter = Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

userRouter.get("/:id", async (req, res)=>{
    const userIDtoSearch = parseInt(req.params.id);
    if (isNaN(userIDtoSearch)) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }
    if(req.user.id != userIDtoSearch){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const user = await prisma.users.findUnique({
        where: {
            id: userIDtoSearch
        }
    })
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    res.json(user)
})
module.exports = userRouter;