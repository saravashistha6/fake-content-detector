const Post = require('../models/Post');

const bannedKeywords = ['offer', 'win', 'free', 'click here', 'limited'];

exports.createPost = async (req, res) => {
    console.log("📥 Incoming POST request:", req.body); // <== Add this line
  
    try {
      const { username, content } = req.body;
      const verdict = await checkFakeContent(content);
  
      const newPost = new Post({
        username,
        content,
        verdict,
      });
  
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      console.error('🔥 Error creating post:', error); // Make sure this exists
      res.status(500).json({ message: 'Failed to create post' });
    }
  };
  

    
