const mongoose = require("mongoose");

const resumeScoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cvHash: { type: String },
    jdHash: { type: String },
    score: { type: Number, default: 0 },          // 0..1
    missingSkills: { type: [String], default: [] },
    method: { type: String, default: "overlap_v0" }
  },
  { timestamps: true }
);

resumeScoreSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ResumeScore", resumeScoreSchema);
