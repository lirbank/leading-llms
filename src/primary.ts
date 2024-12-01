import { BaseDocument, PimIndex } from "./pimdb";

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
