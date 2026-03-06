require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL)
    .then(_result => {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error(err));

const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");
const usersRouter = require("./routes/users.routes");
const postsRouter = require("./routes/posts.routes");
const commentsRouter = require("./routes/comments.routes");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
