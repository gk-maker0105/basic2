const express = require("express");
const auth = require("../middleware/auth");
const resumeController = require("../controllers/resume.controller");
const validators = require("../validators/resume.validator"); // import once

const router = express.Router();

// POST /api/resume/align
// If you have body rules for align, use them like:
// router.post("/align", auth, validators.alignRules, validators.validate, resumeController.align);
// Otherwise, just do:
router.post("/align", auth, resumeController.align);

// GET /api/resume/history (paged)
router.get(
  "/history",
  auth,
  validators.historyRules,
  validators.validate,
  resumeController.history
);

module.exports = router;
