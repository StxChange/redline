const { getTableClient, PARTITION } = require("../shared/tables");

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
      const pending = [], notes = [];
      let scanned = 0;
      const iter = client.listEntities({
        queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
      });
      for await (const e of iter) {
        scanned++;
        if (e.publicComment && !e.commentApproved && !e.commentRejected) {
          pending.push({
            rowKey: e.rowKey, name: e.name, email: e.email, score: e.score,
            comment: e.publicComment, playedAt: e.playedAt || ""
          });
        }
        if (e.privateNote) {
          notes.push({
            name: e.name, email: e.email, score: e.score,
            note: e.privateNote, playedAt: e.playedAt || ""
          });
        }
        if (scanned >= 2000) break;
      }
      const newestFirst = (a, b) => String(b.playedAt).localeCompare(String(a.playedAt));
      pending.sort(newestFirst);
      notes.sort(newestFirst);
      context.res = {
        status: 200,
        headers: { "Cache-Control": "no-store" },
        body: { ok: true, pending, notes: notes.slice(0, 100) }
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
