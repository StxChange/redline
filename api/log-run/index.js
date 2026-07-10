const { getTableClient, RUN_PARTITION, MAX_SCORE } = require("../shared/tables");
const { cleanIp, lookupLocation } = require("../shared/geo");

/* Anonymous run telemetry: the game calls this automatically at the end of
   every run, whether or not the player posts to the leaderboard. No name or
   email is collected here — only gameplay stats. */
module.exports = async function (context, req) {
  try {
    const b = req.body || {};
    const score = Math.round(Number(b.score));
    const distance = Math.round(Number(b.distance));
    const duration = Math.round(Number(b.duration) * 10) / 10;
    if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
      context.res = { status: 400, body: { ok: false } };
      return;
    }

    const client = await getTableClient();
    const ip = cleanIp(req.headers);
    const location = await lookupLocation(ip);
    // inverted-timestamp RowKey => listing the partition returns newest first
    const rowKey = String(99999999999999 - Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
    await client.createEntity({
      partitionKey: RUN_PARTITION,
      rowKey,
      score,
      car: String(b.car || "").slice(0, 32),
      distance: Number.isFinite(distance) ? Math.max(0, Math.min(distance, 99999)) : 0,
      duration: Number.isFinite(duration) ? Math.max(0, Math.min(duration, 60)) : 0,
      finished: !!b.finished,
      endReason: String(b.reason || "").slice(0, 60),
      mobile: !!b.mobile,
      ip,
      location,
      playedAt: new Date().toISOString()
    });
    context.res = { status: 200, body: { ok: true } };
  } catch (err) {
    context.log("log-run error:", err && err.message);
    context.res = { status: 500, body: { ok: false } };
  }
};
