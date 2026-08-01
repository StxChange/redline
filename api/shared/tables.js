const { TableClient } = require("@azure/data-tables");

const TABLE_NAME = "racerscores";
const PARTITION = "S16RACER";
const MAX_SCORE = 30000; // generous ceiling above any legitimately reachable score

let clientPromise = null;

function getTableClient() {
  if (!clientPromise) {
    const conn = process.env.TABLES_CONNECTION_STRING;
    if (!conn) throw new Error("TABLES_CONNECTION_STRING app setting is not configured");
    const client = TableClient.fromConnectionString(conn, TABLE_NAME);
    clientPromise = client
      .createTable()
      .catch((err) => {
        if (!err || err.statusCode !== 409) throw err; // 409 = table already exists
      })
      .then(() => client);
  }
  return clientPromise;
}

/* Monthly competition window: the public leaderboard only shows scores from
   the current UTC calendar month, so it resets automatically on the 1st.
   SEASON_FLOOR additionally hides everything from the July 2026 contest:
   scores posted before midnight Aug 1, 2026 US Eastern (04:00 UTC). */
const SEASON_FLOOR = "2026-08-01T04:00:00.000Z";
function seasonCutoff() {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  return monthStart > SEASON_FLOOR ? monthStart : SEASON_FLOOR;
}

module.exports = { getTableClient, PARTITION, RUN_PARTITION: "RUNLOG", MAX_SCORE, seasonCutoff };
