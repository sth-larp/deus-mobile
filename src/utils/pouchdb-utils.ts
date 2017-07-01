
export function upsert(db: PouchDB.Database<{}>, doc: any): Promise<any> {
  return db.get(doc._id)
  .then((existingDoc) => {
    doc._rev = existingDoc._rev;
    return db.put(doc);
  })
  .catch(() => {
    return db.put(doc);
  });
}

export function insertIfNotExists(db: PouchDB.Database<{}>, doc: any): Promise<any> {
  return db.get(doc._id)
  .catch(() => {
    return db.put(doc);
  });
}
