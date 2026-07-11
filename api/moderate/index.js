const { getTableClient, PARTITION, RUN_PARTITION } = require("../shared/tables");

/* Owner-only moderation endpoint, protected by the ADMIN_KEY app setting.
   GET  /api/moderate?key=...            -> pending public comments + private notes
   POST /api/moderate {key, rowKey, action: "approve"|"reject"} */
module.exports = async function (context, req) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    context.res = { status: 500, body: { ok: false, error: "ADMIN_KEY app setting is not configured" } };
    return;
  }
  const supplied = req.method === "GET"
    ? String((req.query && req.query.key) || "")
    : String((req.body && req.body.key) || "");
  if (supplied !== adminKey) {
    context.res = { status: 401, body: { ok: false, error: "Invalid key" } };
    return;
  }

  try {
    const client = await getTableClient();

    if (req.method === "GET") {
      const pending = [], all = [];
      let scanned = 0;
      const iter = client.listEntities({
        queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
      });
      for await (const e of iter) {
        scanned++;
        const row = {
          rowKey: e.rowKey,
          name: e.name,
          email: e.email,
          score: e.score,
          car: e.car || "",
          publicComment: e.publicComment || "",
          privateNote: e.privateNote || "",
          commentApproved: !!e.commentApproved,
          commentRejected: !!e.commentRejected,
          distance: e.distance,
          duration: e.duration,
          finished: !!e.finished,
          endReason: e.endReason || "",
          mobile: !!e.mobile,
          hasTelemetry: e.distance !== undefined,
          ip: e.ip || "",
          location: e.location || "",
          playedAt: e.playedAt || ""
        };
        all.push(row);
        if (row.publicComment && !row.commentApproved && !row.commentRejected) {
          pending.push(row);
        }
        if (scanned >= 2000) break;
      }
      const newestFirst = (a, b) => String(b.playedAt).localeCompare(String(a.playedAt));
      pending.sort(newestFirst);
      all.sort(newestFirst);

      // anonymous run log (separate partition, rowKeys already newest-first)
      const runs = [];
      const runIter = client.listEntities({
        queryOptions: { filter: `PartitionKey eq '${RUN_PARTITION}'` }
      });
      for await (const r of runIter) {
        runs.push({
          score: r.score, car: r.car || "", distance: r.distance || 0,
          duration: r.duration || 0, finished: !!r.finished,
          endReason: r.endReason || "", mobile: !!r.mobile,
          ip: r.ip || "", location: r.location || "", playedAt: r.playedAt || ""
        });
        if (runs.length >= 100) break;
      }

      context.res = {
        status: 200,
        headers: { "Cache-Control": "no-store" },
        body: { ok: true, pending, all: all.slice(0, 300), runs }
      };
      return;
    }

    // POST: approve or reject one comment
    const b = req.body || {};
    const rowKey = String(b.rowKey || "");
    const action = String(b.action || "");
    if (!rowKey || (action !== "approve" && action !== "reject")) {
      context.res = { status: 400, body: { ok: false, error: "rowKey and action (approve|reject) are required" } };
      return;
    }
    await client.updateEntity({
      partitionKey: PARTITION,
      rowKey,
      commentApproved: action === "approve",
      commentRejected: action === "reject"
    }, "Merge");
    context.res = { status: 200, body: { ok: true } };
  } catch (err) {
    context.log("moderate error:", err && err.message);
    context.res = { status: 500, body: { ok: false, error: "Server error" } };
  }
};
