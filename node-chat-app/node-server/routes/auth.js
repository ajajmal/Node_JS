const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) =>{
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new user({username, password: hashedPassword});
        await newUser.save();
        res.json({message: "User registered successfully"});
    } catch (err)
    {
        res.status(400).json({error: "User already exists"});
    }
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({error: "Invalid Credentials"});
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.json({token});
})