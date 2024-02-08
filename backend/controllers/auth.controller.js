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
     .status(200)
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
  try {
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
      { expiresIn: '15m' }
    )

    const { password: pass, ...rest} = validUser._doc; //get userdetails without password.

    res.status(200).cookie('access_token', token, { httpOnly: true }).json({ message: 'Login Successfully', rest });

  } catch (error) {
     next(error)
  }
}

export {
    signup,
    login
}