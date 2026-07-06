const { getTableClient, PARTITION } = require("../shared/tables");

module.exports = async function (context, req) {
  try {
    const client = await getTableClient();
    const iter = client.listEntities({
      queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
    });

    // Entities come back sorted by RowKey = inverted score, i.e. best first.
    // Keep only each player's best entry (dedupe by email) and never expose emails.
    const top = [];
    const seen = new Set();
    let scanned = 0;
    for await (const e of iter) {
      scanned++;
      const key = String(e.email || "").toLowerCase();
      if (!key || !seen.has(key)) {
        seen.add(key);
        top.push({ name: e.name, score: e.score, car: e.car || "" });
      }
      if (top.length >= 10 || scanned >= 500) break;
    }

    context.res = {
      status: 200,
      headers: { "Cache-Control": "no-store" },
      body: { top }
    };
  } catch (err) {
    context.log("leaderboard error:", err && err.message);
    context.res = { status: 500, body: { top: [], error: "Server error" } };
  }
};
