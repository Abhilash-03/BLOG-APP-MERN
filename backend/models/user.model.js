import { Schema, model } from "mongoose";

const userSchema = new Schema({
   username: {
    type: String,
    required: true,
    unique: true,
   },
   email: {
    type: String,
    required: true,
    unique: true,
   },
   password: {
    type: String,
    required: true,
   },
   profilePicture: {
      type: String,
      default: "https://tse1.mm.bing.net/th?id=OIP.TpqSE-tsrMBbQurUw2Su-AHaHk&pid=Api&P=0&h=180"
   },
   isAdmin: {
      type: Boolean,
      default: false
   }

}, { timestamps: true });

const User = model('User', userSchema);

export default User;