import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

const signup = async(req, res, next) => {
   const { username, email, password } = req.body;

   if(!username || !email || !password){
     next(errorHandler(400, 'All fields are required'));
   }


  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

     const newUser = await User.create({ username, email, password: hashedPassword });
  
     res
     .status(201)
     .json(newUser)
  } catch (error) {
    next(error);
  }

}

const login = async(req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
    next(errorHandler(400, 'All fields are required'));
  }
  try{
    const validUser = await User.findOne({ email });
    if(!validUser) {
      next(errorHandler(404, 'User not found'));
    }
    const validPassword = await bcryptjs.compare(password, validUser.password);

    if(!validPassword){
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    )

    const { password: pass, ...rest} = validUser._doc; //get userdetails without password.

    res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);

  } catch (error) {
     next(error)
  }
}

const google = async(req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({email});
    if(user){
        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        )
        const { password, ...rest } = user._doc;
        res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest)
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      const newUser = await User.create({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl
      })

      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      const { password, ...rest } = newUser._doc;
      res
       .status(200)
       .cookie('access_token', token, {
        httpOnly: true
       })
       .json(rest);

    }
  } catch (error) {
    next(error)
  }

}

export {
    signup,
    login,
    google
}