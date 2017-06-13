function copyFromRealm(objA, objB) {
  Object.keys(objA).forEach(k => {
    if (typeof objA[k] === "function") return; // We skip functions
    if (objA[k] === null) return (objB[k] = null);
    if (typeof objA[k] === "object") {
      if (objA[k].length !== undefined)
        return (objB[k] = objA[k].map(e => e.value !== undefined ? e.value : e));
      return (objB[k] = copyFromRealm(objA[k], {}));
    }

    if (objB[k] !== objA[k]) objB[k] = objA[k];
  });
  return objB;
}

function copyToRealm(objA, objB) {
  Object.keys(objA).forEach(k => {
    if (typeof objA[k] === "function") return; // We skip functions
    if (objA[k] === null) return (objB[k] = null);
    if (typeof objA[k] === "object") {
      if (objA[k] instanceof Array) return (objB[k] = objA[k].map(e => ({ value: e })));

      return (objB[k] = copyToRealm(objA[k], {}));
    }

    if (objB[k] !== objA[k]) objB[k] = objA[k];
  });
  return objB;
}

class RealmCollection {
  constructor(realm, name) {
    this.realm = realm;
    this.name = name;
  }

  findOne(queryObj) {
    const queryString = Object.keys(queryObj)
      .map(k => `${k} = ${JSON.stringify(queryObj[k])}`)
      .join(" AND ");
    const res = this.realm.objects(this.name).filtered(queryString);
    if (res.length > 1) return Promise.reject(new Error("Too many results returned"));

    if (res.length === 0) return Promise.resolve(null);

    return Promise.resolve(this.wrapRealmObj(res[0]));
  }

  wrapRealmObj(obj) {
    // Copy all properties to a new untracked, plain obj (no setters or getters)
    const ret = copyFromRealm(obj, {});

    // When saving we go into a write block and copy all properties back
    ret.save = () => this.promiseWrite(() => copyToRealm(ret, obj));

    ret.remove = () => this.promiseWrite(() => this.realm.delete(obj));

    ret.toObject = () => copyFromRealm(ret, {});

    return ret;
  }

  promiseWrite(func) {
    return new Promise((res, rej) => {
      try {
        this.realm.write(function() {
          try {
            res(func());
          } catch (ex) {
            rej(ex);
          }
        });
      } catch (ex) {
        rej(ex);
      }
    });
  }

  create(obj) {
    return this.promiseWrite(() => {
      const objToSave = {};
      Object.keys(obj).forEach(k => {
        if (obj[k] instanceof Array) objToSave[k] = obj[k].map(a => ({ value: a }));
        else objToSave[k] = obj[k];
      });
      const nObj = this.realm.create(this.name, objToSave);
      return this.wrapRealmObj(nObj);
    });
  }
}

exports.RealmCollection = RealmCollection;

exports.StringObjectSchema = {
  name: "StringObject",
  properties: { value: "string" }
};
