exports.schema = {
  name: "Tresor",
  primaryKey: "id",
  properties: {
    /**
     * The id of the tresor
     */
    id: "string",
    /**
     * A list of ids of the members.
     * Denormalized because we don't usually need anything else, it's mostly just used to see if the current user is a member.
     */
    members: { type: "list", objectType: "StringObject" }
  }
};
