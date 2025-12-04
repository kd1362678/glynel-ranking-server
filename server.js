require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const scoreRouter = require("./api/v1/score");
const leaderboardRouter = require("./api/v1/leaderboard");

const app = express();

app.use(helmet());
app.use(express.json());
app.use("/api/", rateLimit({ windowMs: 60 * 1000, max: 60 }));

app.get("/health", (req, res) => res.send("ok"));

// v1 routes
app.use("/api/v1/score", scoreRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);

//-----------
// MongoDB Ú‘±
//-----------
async function connectDb() {
	if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
	await mongoose.connect(process.env.MONGODB_URI);
	console.log("MongoDB connected!");
}

const port = process.env.PORT || 8080;

connectDb()
	.then(() => {
		const server = app.listen(port, "0.0.0.0", () => {
			console.log(`LISTEN OK http://0.0.0.0:${port}`);
		});

		server.on("error", (err) => {
			console.error("LISTEN ERROR:", err);
		});
	})
	.catch((e) => {
		console.error("BOOT ERROR:", e);
		process.exit(1);
	});