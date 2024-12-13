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
    console.log(req.body)
    const {content, postID} = req.body;
    const comment = await prisma.comments.create({
        data:{
            userID: req.user.id,
            username: req.user.username,
            content: content,
            postID: parseInt(postID)
        }
    })
    res.json(comment)
})

commentRouter.put("/:id", async (req, res)=>{
    
    const user = await prisma.users.findUnique({
        where: {
            id: req.user.id
        }
    });
    const tempComment = await prisma.comments.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if((!tempComment || tempComment.userID != user.id) && !user.admin){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const comment = await prisma.comments.update({
        where: {
            id: parseInt(req.params.id)
        },
        data:{
            userID: req.user.id,
            username: req.user.username,
            content: req.query.content
        }
    })
    res.json(comment)
})

commentRouter.delete("/:id", async (req, res)=>{
    const user = await prisma.users.findUnique({
        where: {
            id: req.user.id
        }
    });
    const tempComment = await prisma.comments.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if((!tempComment || tempComment.userID != user.id) && !user.admin){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const comment = await prisma.comments.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.json(comment);
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Comment not found' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
})
module.exports = commentRouter;