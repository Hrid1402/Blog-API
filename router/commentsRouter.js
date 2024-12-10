const {Router} = require("express");
const commentRouter = Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


commentRouter.get("/", async (req, res)=>{
    const comments = await prisma.comments.findMany({
    })
    res.json(comments)
})
commentRouter.get("/:id", async (req, res)=>{
    const comment = await prisma.comments.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.json(comment)
})

commentRouter.post("/", async (req, res)=>{
    console.log(req.query)
    const comment = await prisma.comments.create({
        data:{
            user: req.query.user,
            content: req.query.content,
            postID: parseInt(req.query.postID)
        }
    })
    res.json(comment)
})

commentRouter.put("/:id", async (req, res)=>{
    const comment = await prisma.comments.update({
        where: {
            id: parseInt(req.params.id)
        },
        data:{
            user: req.query.user,
            content: req.query.content
        }
    })
    res.json(comment)
})

commentRouter.delete("/:id", async (req, res)=>{
    const comment = await prisma.comments.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.json(comment)
})
module.exports = commentRouter;