const { tokenize, sha256 } = require("../utils/text");
const Repo = require("../repositories/resume.repo");

function overlapScore(cvText, jdText) {
  const cvSet = new Set(tokenize(cvText));
  const jdArr = tokenize(jdText);
  const jdSet = new Set(jdArr);

  const inter = [...jdSet].filter(t => cvSet.has(t));
  const score = jdSet.size ? inter.length / jdSet.size : 0;

  // pick top 20 “missing” JD terms not in CV, sorted by JD frequency
  const freq = {};
  for (const t of jdArr) freq[t] = (freq[t] || 0) + 1;
  const missing = [...jdSet].filter(t => !cvSet.has(t))
    .sort((a,b) => (freq[b]||0) - (freq[a]||0))
    .slice(0, 20);

  return { score: Number(score.toFixed(4)), missing };
}

exports.align = async ({ userId, cvText, jdText }) => {
  const { score, missing } = overlapScore(cvText, jdText);
  const doc = await Repo.createScore({
    user: userId,
    cvHash: sha256(cvText),
    jdHash: sha256(jdText),
    score,
    missingSkills: missing,
    method: "overlap_v0"
  });
  return { score, missingSkills: missing, method: "overlap_v0", id: String(doc._id), createdAt: doc.createdAt };
};
