const express = require("express");
const { z } = require("zod");
const Score = require("../../../models/Score");

const router = express.Router();

const SubmitSchema = z.object({
	userId: z.string().min(8).max(128),
	name: z.string().min(1).max(16),
	stage: z.string().min(1).max(32),
	score: z.number().int().min(0).max(100000000),
});

// POST /api/v1/score
router.post("/", async (req, res) => {
	try {
		const key = req.header("x-api-key");
		if (!process.env.API_KEY || key !== process.env.API_KEY) {
			return res.status(401).json({ ok: false, message: "unauthorized" });
		}

		const parsed = SubmitSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ ok: false, message: "bad request" });
		}

		const { userId, name, stage, score } = parsed.data;

		const doc = await Score.findOne({ userId, stage });

		if (!doc) {
			await Score.create({ userId, name, stage, score });
			return res.json({ ok: true, updated: true });
		}

		doc.name = name;

		let updated = false;
		if (score > doc.score) {
			doc.score = score;
			updated = true;
		}

		await doc.save();
		return res.json({ ok: true, updated });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ ok: false });
	}
});

module.exports = router;
