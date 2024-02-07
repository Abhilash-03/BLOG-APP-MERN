import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

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


export {
    signup
}