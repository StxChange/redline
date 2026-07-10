const { getTableClient, PARTITION, MAX_SCORE } = require("../shared/tables");
const { cleanIp, lookupLocation } = require("../shared/geo");

function bad(context, msg) {
  context.res = { status: 400, body: { ok: false, error: msg } };
}

module.exports = async function (context, req) {
  try {
    const b = req.body || {};
    const name = String(b.name || "").trim().replace(/[<>]/g, "").slice(0, 24);
    const email = String(b.email || "").trim().toLowerCase().slice(0, 254);
    const score = Math.round(Number(b.score));
    const car = String(b.car || "").slice(0, 32);
    // optional comments: privateNote goes only to the site owner; publicComment
    // is shown on the site only after the owner approves it
    const privateNote = String(b.privateNote || "").trim().replace(/[<>]/g, "").slice(0, 500);
    const publicComment = String(b.publicComment || "").trim().replace(/[<>]/g, "").slice(0, 280);

    if (name.length < 1) return bad(context, "Name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad(context, "A valid email is required");
    if (!Number.isFinite(score) || score < 1 || score > MAX_SCORE) return bad(context, "Invalid score");

    const client = await getTableClient();
    const ip = cleanIp(req.headers);
    const location = await lookupLocation(ip);
    // RowKey trick: inverted zero-padded score sorts the table highest-score-first,
    // so the leaderboard query can just read the first rows in natural order.
    const inverted = String(MAX_SCORE - score).padStart(6, "0");
    const rowKey = inverted + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);

    await client.createEntity({
      partitionKey: PARTITION,
      rowKey,
      name,
      email,
      score,
      car,
      privateNote,
      publicComment,
      commentApproved: false,
      commentRejected: false,
      ip,
      location,
      playedAt: new Date().toISOString()
    });

    context.res = { status: 200, body: { ok: true } };
  } catch (err) {
    context.log("submit-score error:", err && err.message);
    context.res = { status: 500, body: { ok: false, error: "Server error" } };
  }
};
