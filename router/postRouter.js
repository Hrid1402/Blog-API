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
        },orderBy:{
            id: "desc"
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
            comments: {
                orderBy:{
                    id: "desc"
                }
            }
        }
    })
    res.json(post)
})

module.exports = postRouter;