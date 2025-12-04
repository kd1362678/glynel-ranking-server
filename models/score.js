const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    stage: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

scoreSchema.index({ userId: 1, stage: 1 }, { unique: true });
scoreSchema.index({ stage: 1, score: -1, updatedAt: -1 });

module.exports = mongoose.model("Score", scoreSchema);
