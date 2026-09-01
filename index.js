require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/database");
const contactRoutes = require("./Routes/contactRoutes");
const notFound = require("./Middleware/notFound");
const errorHandler = require("./Middleware/errorHandler");
const newsletterRoutes = require("./Routes/newsLetterRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
