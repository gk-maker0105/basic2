const service = require("../services/resume.service");
const resumeRepo = require("../repositories/resume.repo");

// POST /api/resume/align
exports.align = async (req, res) => {
  try {
    const { cvText, jdText } = req.body;
    const out = await service.align({ userId: req.user.uid, cvText, jdText });
    return res.json(out);
  } catch (e) {
    console.error("align error:", e);
    return res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/resume/history  (paged)
exports.history = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const userId = req.user.uid; // <- consistent with auth middleware
    const { items, total } = await resumeRepo.getHistory(userId, page, limit);

    return res.json({
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total
    });
  } catch (err) {
    console.error("History fetch error:", err);
    return res.status(500).json({ msg: "Error fetching history" });
  }
};
