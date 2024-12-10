const {Router} = require("express");
const postRouter = Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminValidation = async (req, res, next) => {
    console.log(req.user);
    const user = await prisma.users.findUnique({
        where: {
            id: req.user.id
        }
    });

    if (!user || !user.admin) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    next();
};


postRouter.get("/", adminValidation, async (req, res)=>{
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
postRouter.get("/:id", adminValidation, async (req, res)=>{
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

postRouter.post("/", adminValidation, async (req, res)=>{
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

postRouter.put("/:id", adminValidation, async (req, res)=>{
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

postRouter.delete("/:id", adminValidation, async (req, res)=>{
    const post = await prisma.posts.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.json(post)
})
module.exports = postRouter;