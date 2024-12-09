const express = require("express");
const postRouter = require("./router/postRouter")
const commentRouter = require("./router/commentsRouter")

const PORT = 5000

const app = express();

app.get("/", (req, res)=>{
    res.send("Online")
})
app.use("/posts", postRouter);
app.use("/comments", commentRouter);



app.listen(PORT, ()=>console.log("http://localhost:" + PORT + "/"));