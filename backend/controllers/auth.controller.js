import bcrypt from 'bcrypt'
import User from '../models/user.model.js';
import errorHandler from '../utils/errors.js'
import jwt from 'jsonwebtoken'

export const signup = async(req ,res ,next) => {
    const {username,email,password } = req.body;

    if(!username || !email || !password || username === "" || email === "" || password === ""){
        // return res.status(400).json({
        //     message: "All fields are required"
        // })
        return next(errorHandler(400 ,"All fields are required"))
    }

    const hashedPassword = bcrypt.hashSync(password ,10);

    const newUser = new User({
        username,
        email,
        password:hashedPassword
    })

    try {
        await newUser.save();
        res.json("Signup Successful");
    }
    catch(err) {
        // res.status(500).json({
        //     message:err.message
        // })
        next(err)
    }
}

export const signin = async(req ,res ,next) => {
    const {email ,password} = req.body;

    if(!email || !password || email === "" || password === ""){
        return next(errorHandler(400 ,"All fields are required"))
    }

    try {
        const validUser = await User.findOne({email});

        if(!validUser) {
            return next(errorHandler(404 ,"User not found"));
        }

        const validPassword = bcrypt.compareSync(password ,validUser.password)
        if(!validPassword) {
            return next(errorHandler(400 ,"Wrong Credentials"))
        }

        const token = jwt.sign({id: validUser._id} ,process.env.JWT_SECERT)
        const {password:pass, ...rest} = validUser._doc

        res.status(200).cookie("access_token" ,token ,{
            httpOnly: true,
        }).json(rest)
    }
    catch(err) {
        next(err);
    }
}

// export default {signup ,signin};