exports.schema = {
  name: "Data",
  primaryKey: "id",
  properties: {
    /**
     * The id of the stored data
     */
    id: "string",
    /**
     * A reference to the tresor that was used to encrypt the data
     */
    tresor: { type: "Tresor" },

    /**
     * The data itself
     */
    data: { type: "string", default: "" }
  }
};
