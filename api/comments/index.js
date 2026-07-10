const { getTableClient, PARTITION } = require("../shared/tables");

/* Public endpoint: returns only owner-approved public comments.
   Emails and private notes are never included. */
module.exports = async function (context, req) {
  try {
    const client = await getTableClient();
    const iter = client.listEntities({
      queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
    });
    const out = [];
    let scanned = 0;
    for await (const e of iter) {
      scanned++;
      if (e.commentApproved && e.publicComment) {
        out.push({
          name: e.name,
          comment: e.publicComment,
          score: e.score,
          playedAt: e.playedAt || ""
        });
      }
      if (scanned >= 2000) break;
    }
    out.sort((a, b) => String(b.playedAt).localeCompare(String(a.playedAt))); // newest first
    context.res = {
      status: 200,
      headers: { "Cache-Control": "no-store" },
      body: { comments: out.slice(0, 20) }
    };
  } catch (err) {
    context.log("comments error:", err && err.message);
    context.res = { status: 500, body: { comments: [] } };
  }
};
