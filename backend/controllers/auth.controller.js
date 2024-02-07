import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

const signup = async(req, res) => {
   const { username, email, password } = req.body;

   if(!username || !email || !password){
    res.status(400).json({ messag: "All fields are required" });
   }


  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

     const newUser = await User.create({ username, email, password: hashedPassword });
  
     res
     .status(200)
     .json(newUser)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}


export {
    signup
}