require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const app = express();

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

if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);

app.use((req, res, next) => next(res.status(404).json({
    error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route ${req.method} ${req.path} not found`,
    },
})));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message =
        process.env.NODE_ENV === "production" && statusCode === 500
            ? "An unexpected error occurred"
            : err.message;

    return next(res.status(statusCode).json({
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: message,
            stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        },
    }));
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
