import { BaseDocument, PimIndex } from "./pimdb";

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
