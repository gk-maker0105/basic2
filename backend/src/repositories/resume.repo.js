const ResumeScore = require("../models/ResumeScore");

/**
 * Persist a new score document
 * Used by /align service/route
 */
exports.createScore = (doc) => ResumeScore.create(doc);

/**
 * Infinite-scroll style listing (hasMore)
 * Pass in userId = req.user.uid (string of ObjectId)
 */
exports.listByUser = async ({ userId, page = 1, limit = 10 }) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  const docs = await ResumeScore.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit + 1)
    .select({ score: 1, missingSkills: 1, method: 1, createdAt: 1 })
    .lean();

  const hasMore = docs.length > safeLimit;
  const items = (hasMore ? docs.slice(0, safeLimit) : docs).map(d => ({
    id: String(d._id),
    score: d.score ?? 0,
    missingSkills: d.missingSkills || [],
    method: d.method || "overlap_v0",
    createdAt: d.createdAt
  }));

  return { items, hasMore, page: safePage, limit: safeLimit };
};

/**
 * Paged listing (total)
 * Pass in userId = req.user.uid (string of ObjectId)
 */
exports.getHistory = async (userId, page = 1, limit = 10) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  const [docs, total] = await Promise.all([
    ResumeScore.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .select({ score: 1, missingSkills: 1, method: 1, createdAt: 1 })
      .lean(),
    ResumeScore.countDocuments({ user: userId })
  ]);

  const items = docs.map(d => ({
    id: String(d._id),
    score: d.score ?? 0,
    missingSkills: d.missingSkills || [],
    method: d.method || "overlap_v0",
    createdAt: d.createdAt
  }));

  return { items, total };
};
