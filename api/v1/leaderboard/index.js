const express = require("express");
const Score = require("../../../models/Score");

const router = express.Router();

router.get("/", async (req, res) => {
	const stage = (req.query.stage ?? "default").toString();
	const limitRaw = parseInt((req.query.limit ?? "50").toString(), 10);
	const limit = Math.max(1, Math.min(limitRaw, 100));

	const docs = await Score.find({ stage })
		.sort({ score: -1, updatedAt: -1 })
		.limit(limit)
		.select({ _id: 0, name: 1, score: 1, updatedAt: 1 })
		.lean();

	return res.json({
		stage,
		items: docs.map((d, i) => ({
			rank: i + 1,
			name: d.name,
			score: d.score,
			updatedAt: d.updatedAt,
		})),
	});
});

module.exports = router;
