const express = require("express");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PORT = 5000

const app = express();

app.get("/posts", async (req, res)=>{
    const posts = await prisma.posts.findMany({
        select:{
            id: true,
            title: true
        }
    })
    res.json(posts)
})
app.get("/posts/:id", async (req, res)=>{
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

app.post("/post", async (req, res)=>{
    console.log(req.query)
    const post = await prisma.posts.create({
        data:{
            title: req.query.title,
            content: req.query.content
        }
    })
    res.json(post)
})

app.put("/posts/:id", async (req, res)=>{
    const post = await prisma.posts.update({
        where: {
            id: parseInt(req.params.id)
        },
        data:{
            title: req.query.title,
            content: req.query.content
        }
    })
    res.json(post)
})

app.delete("/posts/:id", async (req, res)=>{
    const post = await prisma.posts.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.json(post)
})




app.listen(PORT, ()=>console.log("http://localhost:" + PORT + "/"));