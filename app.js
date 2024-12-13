const express = require("express");
const postRouter = require("./router/postRouter")
const postPrivateRouter = require("./router/postPrivateRouter")
const commentRouter = require("./router/commentsRouter")
const userRouter = require("./router/userRouter")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors')

const jwt = require("jsonwebtoken")
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const PORT = 5000

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
  }, (jwtPayload, done) => {
    const user = { id: jwtPayload.id};
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }));
  
passport.use(
new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password'
},async (username, password, done) => {
    try {
    const user = await prisma.users.findFirst({
        where:{
            username: username
        }
    })
    if (!user) {
        console.log("Incorrect username");
        return done(null, false, { message: "Incorrect username" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        console.log("Incorrect password");
        return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
    } catch(err) {
    return done(err);
    }
})
);

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }));


const authenticateJWT = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    console.log("header: " + authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'

        jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }
            req.user = user; // Attach user data to the request object
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};


app.get("/", (req, res)=>{
    res.json({
        message: 'Online'
    })
})
app.use("/posts", postRouter);
app.use("/posts/private", authenticateJWT, postPrivateRouter);
app.use("/comments", authenticateJWT, commentRouter);
app.use("/users", authenticateJWT, userRouter);

app.post("/login", passport.authenticate('local', { session: false }), (req, res)=>{
    const token = jwt.sign({id: req.user.id, username: req.user.username}, JWT_SECRET_KEY, {expiresIn: '30m'});
    console.log({id: req.user.id, username: req.user.username});
    res.json({ message: 'Login successful', token });
})


const validateSignUp = [
    body("user")
      .notEmpty().withMessage("Username is required.")
      .isLength({ min: 1, max: 15 })
      .withMessage("The username must have between 1 to 15 characters."),
    body("password")
      .notEmpty().withMessage("Password is required.")
      .isLength({ min: 8 }).withMessage("Password must have at least 8 characters."),
    
    body("confirmPassword")
      .notEmpty().withMessage("Please confirm your password.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      })
  ];


app.post("/sign-up", validateSignUp, async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.errors);
      return res.json(errors.errors);
    }
    console.log('Full request body:', req.body);
    const {user, password} = req.body;
    const userName = await prisma.users.findFirst({
        where:{
            username: user
        }
    })
    if(userName){
        return res.status(409).json({
            error: 'Error, the username already exists'
        })
    }
    bcrypt.hash(password, 10, async(error, hashedPassword) => {
        try{
            const newUser = await prisma.users.create({
                data:{
                    username: user,
                    password: hashedPassword
                }
            })
            return res.json(newUser)
        }catch(err){
            console.error("Database error:", err)
            return res.status(409).json({
                error: "Unable to create a user. Please try again later."
            })
        }
    } )
})

app.listen(PORT, ()=>console.log("http://localhost:" + PORT + "/"));