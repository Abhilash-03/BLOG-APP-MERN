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
        userId: req.user.id,
    })
    res.status(201).json(newPost);
 } catch (error) {
    next(error)
 }

}

const getPosts = async(req, res, next) => {
   const { startIndex, limit, order, userId, category, slug, postId, searchTerm } = req.query;
    try {
      const index = parseInt(startIndex) || 0;
      const limits = parseInt(limit) || 9;
      const sortDirection = order === 'asc' ? 1 : -1;
      const posts = await Post.find({
         ...(userId && {userId}),
         ...(category && {category}),
         ...(slug && {slug}),
         ...(postId && {postId}),
         ...(searchTerm && {
            $or: [
               { title: {$regex: searchTerm, $options: 'i'}},
               { content: {$regex: searchTerm, $options: 'i'}},
            ]
         }),

      })
      .sort({ updatedAt: sortDirection })
      .skip(index)
      .limit(limits)

      const totalPosts = await Post.countDocuments();
      const now = new Date();

      const oneMonthAgo = new Date(
         now.getFullYear(),
         now.getMonth() - 1,
         now.getDate()
      );

      const lastMonthPosts = await Post.countDocuments({
         createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({
         posts,
         totalPosts,
         lastMonthPosts
      })
      
    } catch (error) {
      next(error);
    }
}

export {
    create,
    getPosts
}