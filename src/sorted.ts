import { BaseDocument, PimIndex } from "./pimdb";

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
