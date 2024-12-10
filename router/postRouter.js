const {Router} = require("express");
const postRouter = Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


postRouter.get("/", async (req, res)=>{
    const posts = await prisma.posts.findMany({
        select:{
            id: true,
            public: true,
            title: true,
            date: true
        }
    })
    res.json(posts)
})
postRouter.get("/:id", async (req, res)=>{
    const post = await prisma.posts.findUnique({
        where: {
            id: parseInt(req.params.id)
        },
        include: {
            comments: true
        }
    })
    res.json(post)
})

postRouter.post("/", async (req, res)=>{
    console.log(req.query)
    const post = await prisma.posts.create({
        data:{
            title: req.query.title,
            content: req.query.content,
            public: req.query.public ==="true"
        }
    })
    res.json(post)
})

postRouter.put("/:id", async (req, res)=>{
    const post = await prisma.posts.update({
        where: {
            id: parseInt(req.params.id)
        },
        data:{
            title: req.query.title,
            content: req.query.content,
            public: req.query.public ==="true"
        }
    })
    res.json(post)
})

postRouter.delete("/:id", async (req, res)=>{
    const post = await prisma.posts.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.json(post)
})
module.exports = postRouter;