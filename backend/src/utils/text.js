const crypto = require("crypto");

const STOP = new Set([
  "a","an","the","and","or","but","to","of","in","on","for","with","by","as","at","from","is","are","was","were",
  "this","that","it","be","has","have","had","i","you","we","they","he","she","them","their","our","your"
]);

function normalize(text="") {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s.+#-]/gu, " ").replace(/\s+/g, " ").trim();
}

function tokenize(text="") {
  const toks = normalize(text).split(/\s+/);
  return toks.filter(t => t.length > 1 && !STOP.has(t));
}

function sha256(text="") {
  return crypto.createHash("sha256").update(text).digest("hex");
}

module.exports = { normalize, tokenize, sha256 };
