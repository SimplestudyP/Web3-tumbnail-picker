import express from "express";
import cors from "cors";
import userRouter from './routers/user';
import workerRouter from './routers/worker';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Thumbnail Picker API is running" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});