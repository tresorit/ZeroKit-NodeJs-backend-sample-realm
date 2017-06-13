/**
 * Sets up the db connection and sets a cleanup action that will forcibly close it.
 */

const { RealmCollection, StringObjectSchema } = require("./zkitApi/db/RealmCollection");

const Data = require("./zkitApi/db/Data");
const User = require("./zkitApi/db/User");
const Tresor = require("./zkitApi/db/Tresor");

const Realm = require("realm");

const db = new Realm({
  schema: [Data.schema, User.schema, User.regInfoSchema, Tresor.schema, StringObjectSchema],
  path: "localRealmDb/zkitApiDb"
});

require("./zkitApi/utils/cleanup").cleanup(() => {
  console.log("\n\nDb disconnecting\n");
  db.close();
});

exports.User = new RealmCollection(db, "User");
exports.Data = new RealmCollection(db, "Data");
exports.Tresor = new RealmCollection(db, "Tresor");
