const path = require("path");
const backfillSlugs = require(path.resolve("src", "database", "backfill"));

async function connection() {

    const db = require(path.resolve("config","db"));

    await db.sync({ alter: true }).then(()=>{
        console.log("Connected DataBase");
    })
    .catch((e)=>{
        console.log(e);
    });

    await backfillSlugs().catch((e) => console.log("Backfill error:", e));
}

module.exports = connection;