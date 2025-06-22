const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./backend/models/Post"); // Using the imported model
const axios = require("axios");
const newsAPIKey = "67b18bb74ac349cd9c2705a8b05b7bb1";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB (Only Once!)
mongoose
  .connect("mongodb://127.0.0.1:27017/fakeContentDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// POST route (Create Post)
app.post("/api/posts", async (req, res) => {
  const { username, content } = req.body;
  if (!username || !content) {
    return res.status(400).json({ message: "Username and content are required!" });
  }

  const newPost = new Post({ username, content, isFake: null });

  try {
    const savedPost = await newPost.save();
    res.status(201).json({ message: "✅ Post saved successfully!", post: savedPost });
  } catch (err) {
    res.status(500).json({ message: "❌ Error saving post", error: err });
  }
});

// PUT route (Mark Posts as Fake/Real)
app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { isFake } = req.body;

  if (isFake === null || isFake === undefined) {
    return res.status(400).json({ message: "isFake field is required" });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, { isFake }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "✅ Post updated successfully!", post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating post", error: err });
  }
});

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching posts", error: err });
  }
});

// GET a single post by ID
app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "❌ Post not found!" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "❌ Error retrieving post", error: err });
  }
});

// GET news from NewsAPI
app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: { apiKey: newsAPIKey, country: "us", category: "general" },
    });
    res.json(response.data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
});

// PUT route to check if post matches real news
app.put("/api/posts/:id/check", async (req, res) => {
  const postId = req.params.id;
  const postContent = req.body.content;

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: { apiKey: newsAPIKey, country: "us", category: "general" },
    });

    const newsArticles = response.data.articles;
    const isReal = newsArticles.some((article) =>
      article.title.includes(postContent) || article.description.includes(postContent)
    );

    const updatedPost = await Post.findByIdAndUpdate(postId, { isFake: !isReal }, { new: true });
    res.json({ message: "✅ Post updated successfully!", post: updatedPost });
  } catch (error) {
    console.error("Error checking news:", error);
    res.status(500).json({ message: "Error checking news" });
  }
});

// Start the server (Only Once!)
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});




