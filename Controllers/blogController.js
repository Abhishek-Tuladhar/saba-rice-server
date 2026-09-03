const Blog = require("../Models/Blogs");

exports.getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tag, status = "published" } = req.query;

    const filter = { status };
    if (tag) filter.tags = tag;

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, author, tags, status } =
      req.body;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author,
      tags,
      status,
      publishedAt: status === "published" ? new Date() : null,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.status === "published" && !updates.publishedAt) {
      updates.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    next(err);
  }
};
