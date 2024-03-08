import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

const create = async (req, res, next) => {
   const { title, content } = req.body;
   
   if(!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
   }
  if(!title || !content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  } 

  const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

 try {
    const newPost = await Post.create({
        ...req.body,
        slug,

    })
    res.status(201).json(newPost);
 } catch (error) {
    next(error)
 }

}

export {
    create
}