
const { query } = require("express-validator");

// Validate query params for GET /api/resume/history
exports.historyRules = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50")
    .toInt()
];

// Note: You already have `exports.validate = (req,res,next)=>{...}` above.
// We’ll reuse that for history too.




const { body, validationResult } = require("express-validator");

exports.alignRules = [
  body("cvText").isString().trim().isLength({ min: 10, max: 200000 }),
  body("jdText").isString().trim().isLength({ min: 10, max: 100000 })
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ msg: "Invalid input", errors: errors.array() });
  next();
};




