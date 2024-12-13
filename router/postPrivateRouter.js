const {Router} = require("express");
const postPrivateRouter = Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminValidation = async (req, res, next) => {
    console.log("Validation:")
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

postPrivateRouter.post("/", adminValidation, async (req, res)=>{
    const {title, content, public} = req.body;
    const post = await prisma.posts.create({
        data:{
            title: title,
            content: content,
            public: public ==="true"
        }
    })
    res.json(post)
})

postPrivateRouter.put("/:id", adminValidation, async (req, res)=>{
    const {title, content, public} = req.body;
    const post = await prisma.posts.update({
        where: {
            id: parseInt(req.params.id)
        },
        data:{
            title: title,
            content: content,
            public: public ==="true"
        }
    })
    res.json(post)
})

postPrivateRouter.delete("/:id", adminValidation, async (req, res)=>{
    const post = await prisma.posts.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.json(post)
})
module.exports = postPrivateRouter;