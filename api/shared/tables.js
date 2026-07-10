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

module.exports = { getTableClient, PARTITION, RUN_PARTITION: "RUNLOG", MAX_SCORE };
