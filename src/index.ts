/**
 * BaseDocument
 */
export interface BaseDocument {
  /** Primary key */
  id: string;
}

/**
 * Index interface
 */
export interface PimIndex<T extends BaseDocument> {
  insert(doc: T): boolean;
  update(doc: T): boolean;
  delete(doc: T): boolean;
}

/**
 * Primary Index
 *
 * This is a unique index.
 *
 * Write operations work with document references, mutating the documents in
 * place, allowing documents to be shared across multiple indexes.
 *
 * Read operations return a new array containing references (not clones) to the
 * indexed documents.
 */
export class PimPrimaryIndex<T extends BaseDocument> implements PimIndex<T> {
  /**
   * Insert a document into the index.
   *
   * Returns true if the document was updated, false if it was not found.
   */
  insert(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Update a document in the index.
   *
   * Returns true if the document was updated, false if it was not found.
   */
  update(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Delete a document from the index.
   *
   * Returns true if the document was deleted, false if it was not found.
   */
  delete(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Get a document from the index by id.
   */
  get(id: T["id"]): T | undefined {
    return undefined;
  }

  /**
   * Get all documents from the index.
   */
  all(): T[] {
    return [];
  }
}

/**
 * Sorted Index
 *
 * This index relies on binary search to find individual documents and ranges
 * of documents.
 *
 * Write operations work with document references, mutating the documents in
 * place, allowing documents to be shared across multiple indexes.
 *
 * Read operations return a new array containing references (not clones) to the
 * indexed documents.
 */
export class PimSortedIndex<T extends BaseDocument> implements PimIndex<T> {
  private indexField;

  constructor(
    indexField: {
      [K in keyof T]: T[K] extends string | number ? K : never;
    }[keyof T],
  ) {
    this.indexField = indexField;
  }

  /**
   * Insert a document into the index.
   *
   * Returns true if the document was updated, false if it was not found.
   */
  insert(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Update a document in the index.
   *
   * Returns true if the document was updated, false if it was not found.
   */
  update(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Delete a document from the index.
   *
   * Returns true if the document was deleted, false if it was not found.
   */
  delete(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Find documents in the index.
   *
   * - Returns all documents if no value is provided.
   * - Matches are case sensitive.
   * - Documents are secondarily sorted by id.
   */
  find(value?: T[typeof this.indexField]): T[] {
    // TODO: Implement
    return [];
  }

  /**
   * Find documents in a range.
   *
   * - Returns all documents if no range is provided.
   * - Matches are case sensitive.
   * - Documents are secondarily sorted by id.
   * - Includes exact matches at both boundaries.
   * - Can use either or both bounds (gte/lte).
   */
  findInRange(
    range: {
      gte?: string | number;
      lte?: string | number;
    } = {},
  ): T[] {
    // TODO: Implement
    return [];
  }
}

/**
 * Substring Index
 *
 * A fast substring search index that enables partial text matching on document
 * fields.
 *
 * Features:
 * - Case-insensitive matching
 * - Matches any part of the indexed text field
 * - Supports document updates and deletions
 *
 * Limitations:
 * - Results are returned in insertion order
 * - Not a compound index (only supports indexing a single field)
 * - No advanced text search features (stemming, synonyms, relevance scoring)
 */
export class PimSubstringIndex<T extends BaseDocument> implements PimIndex<T> {
  private indexField;

  constructor(
    indexField: {
      [K in keyof T]: T[K] extends string | number ? K : never;
    }[keyof T],
  ) {
    this.indexField = indexField;
  }

  /**
   * Insert a document into the index.
   *
   * Returns true if the document was inserted, false if it was already in the
   * index.
   */
  insert(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Update a document in the index.
   *
   * Returns true if the document was updated, false if it was not found.
   */
  update(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Delete a document from the index.
   *
   * Returns true if the document was deleted, false if it was not found.
   */
  delete(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  /**
   * Search for documents by a query string.
   *
   * - An empty query string will return all documents.
   * - The query is case insensitive.
   * - The search result is currently not sorted, documents are returned in the
   *   order they were inserted (this restriction will be lifted in the future).
   */
  search(query: string): T[] {
    // TODO: Implement
    return [];
  }
}

/**
 * Collection
 *
 * This is a collection of documents with indexes.
 */
export class PimCollection<
  T extends BaseDocument,
  TIndexes extends Record<string, PimIndex<T>>,
> {
  indexes: TIndexes;
  primary: PimPrimaryIndex<T>;

  constructor(indexes: TIndexes) {
    this.indexes = indexes;

    const primary = Object.values(this.indexes).find(
      (index) => index instanceof PimPrimaryIndex,
    );
    if (!primary) throw new Error("Primary index not found");

    this.primary = primary;
  }

  insert(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  update(doc: T): boolean {
    // TODO: Implement
    return true;
  }

  delete(id: string): boolean {
    // TODO: Implement
    return true;
  }
}

/**
 * Database
 *
 * This is a database of collections.
 */
export class PimDB<
  TCollections extends Record<
    string,
    PimCollection<BaseDocument, Record<string, PimIndex<BaseDocument>>>
  >,
> {
  constructor(collections: TCollections) {
    Object.assign(this, collections);
  }
}

/**
 * Factory function to create PimDB instances
 */
export function createPimDB<
  TCollections extends Record<
    string,
    PimCollection<BaseDocument, Record<string, PimIndex<BaseDocument>>>
  >,
>(collections: TCollections): PimDB<TCollections> & TCollections {
  return Object.assign(new PimDB(collections), collections);
}

/**
 *
 * USAGE - setup
 *
 */
interface User {
  id: string;
  name: string;
  age: number;
  admin?: boolean;
}

const usersIdx = {
  primary: new PimPrimaryIndex<User>(),
  age: new PimSortedIndex<User>("name"),
  name: new PimSubstringIndex<User>("name"),
};

const db = createPimDB({
  users: new PimCollection<User, typeof usersIdx>(usersIdx),
});

/**
 *
 * USAGE - queries
 *
 */
db.users.insert({ id: "1", name: "Alice", age: 30 });
db.users.insert({ id: "2", name: "Bob", age: 25 });
db.users.insert({ id: "3", name: "Charlie", age: 35 });

const alice = db.users.indexes.primary.get("1");
console.log("Get by primary key (id = 1):", alice);

// Access the name index
const usersNamedAlice = db.users.indexes.age.find("Alice");
console.log("Users named Alice:", usersNamedAlice);

// Access the age range index
const usersInThirties = db.users.indexes.age.findInRange({
  gte: 30,
  lte: 39,
});
console.log("Users in their thirties:", usersInThirties);

// Update Alice's age
db.users.update({ id: "1", name: "Alice", age: 31 });

// Verify the update
const updatedAlice = db.users.indexes.primary.get("1");
console.log("Updated Alice:", updatedAlice);

// Verify that indexes are updated
const usersInThirtiesAfterUpdate = db.users.indexes.age.findInRange({
  gte: 30,
  lte: 39,
});
console.log(
  "Users in their thirties after update:",
  usersInThirtiesAfterUpdate,
);

// Delete Bob
db.users.delete("2");

// Verify deletion
const bob = db.users.indexes.primary.get("2");
console.log("Bob after deletion:", bob); // Should be undefined

// Verify that indexes are updated
const usersInTwentiesAfterDeletion = db.users.indexes.age.findInRange({
  gte: 20,
  lte: 29,
});
console.log(
  "Users in their twenties after deletion:",
  usersInTwentiesAfterDeletion,
);

const allUsers = db.users.indexes.primary.all();
console.log("All users:", allUsers);
