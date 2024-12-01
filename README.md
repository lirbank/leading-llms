# PimDB

A lightweight **Persisted In-Memory Database** written in TypeScript.

⚠️ **Alpha notice:** PimDB is in an early stage of development. Persistence is not yet available, and features as well as the API are subject to change. Use with caution in experimental or non-critical projects.

A lightweight, persisted in-memory database built from the ground up for the browser. PimDB delivers fast and efficient text indexing with substring, n-gram, and sorted indexes, enabling quick lookups for both partial and exact matches. On a dataset of 100,000 documents, it's currently **4,000x+ faster** than `Array.filter` for sorted lookups and **700x+ faster** for substring searches.

## Features

- 🚀 Lightweight and fast
- 📦 Zero dependencies
- 💪 TypeScript support
- 🔒 Type-safe operations
- 🛠️ Simple API
- 🔍 Pluggable indexes
- 🔄 _Reactivity (React hook coming soon)_

## Installation

PimDB is published on [npmjs.com](https://www.npmjs.com/package/pimdb).

```bash
# Using bun
bun add pimdb

# Using pnpm
pnpm add pimdb

# Using npm
npm install pimdb

# Using yarn
yarn add pimdb
```

## Quick start

### 1. Setting up the database

```typescript
// db.ts

import {
  createPimDB,
  PimCollection,
  PimPrimaryIndex,
  PimSortedIndex,
  PimSubstringIndex,
} from "pimdb";

interface User {
  id: string;
  name: string;
  age: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  isPublished?: boolean;
}

// Define user indexes
const userIndexes = {
  primary: new PimPrimaryIndex<User>(),
  byName: new PimSortedIndex<User>("name"),
  nameSearch: new PimSubstringIndex<User>("name"),
};

// Define post indexes
const postIndexes = {
  primary: new PimPrimaryIndex<Post>(),
  byTitle: new PimSortedIndex<Post>("title"),
  titleSearch: new PimSubstringIndex<Post>("title"),
};

// Create and export database with collections
export const db = createPimDB({
  users: new PimCollection<User, typeof userIndexes>(userIndexes),
  posts: new PimCollection<Post, typeof postIndexes>(postIndexes),
});
```

### 2. Using the database

```typescript
import { db } from "./db";

// Insert data
db.users.insert({
  id: "1",
  name: "Alice",
  age: 30,
});

db.posts.insert({
  id: "1",
  title: "Hello, world!",
  content: "Welcome to the universe.",
  isPublished: true,
});

// All read operations are performed directly on the indexes
const user = db.users.indexes.primary.get("1");
const aliceUsers = db.users.indexes.byName.find("Alice");
const searchResults = db.users.indexes.nameSearch.search("li");
const thirtyPlus = db.users.indexes.byAge.findInRange({ gte: 30 });
```

## Indexes

PimDB comes with three index types to optimize your data queries.

### Primary index

```typescript
const primaryIndex = new PimPrimaryIndex<User>();
```

- Unique index, mandatory for each collection
- Supports retrieving single documents or all documents in the collection
- Provides O(1) performance for lookups by document ID

### Sorted index

```typescript
const sortedIndex = new PimSortedIndex<User>("name");
```

- Enables efficient exact matches and range queries (case-sensitive)
- Maintains documents sorted by a specified field, with document ID as a tie-breaker for consistent result ordering
- Provides O(log n) performance for lookups

### Substring index

```typescript
const substringIndex = new PimSubstringIndex<User>("name");
```

- Optimized for real-time search and partial text matching
- Supports case-insensitive substring searches within text fields
- Provides O(1) performance for partial matches

### Trigram index

- Coming soon.

### Custom index

Create your own indexes by implementing the `PimIndex` interface.

```typescript
interface PimIndex<T> {
  insert(item: T): boolean;
  update(item: T): boolean;
  delete(item: T): boolean;
}

export class MyIndex<T extends BaseDocument> implements PimIndex<T> {
  /**
   * Insert a document into the index.
   *
   * Returns true if the document was updated, false if it was not found.
   */
  insert(doc: T): boolean {
    // Implement me
    return false;
  }

  /**
   * Update a document in the index.
   *
   * Returns true if the document was updated, false if it was not found.
   */
  update(doc: T): boolean {
    // Implement me
    return false;
  }

  /**
   * Delete a document from the index.
   *
   * Returns true if the document was deleted, false if it was not found.
   */
  delete(doc: T): boolean {
    // Implement me
    return false;
  }

  /**
   * Implement your query methods here.
   */
  myQuery(id: T["id"]): T | undefined {
    // Implement me
    return undefined;
  }
}
```

## Benchmarks

Initial benchmarks were conducted on a MacBook Pro M1 Max with 64 GB RAM.

### Sorted index - Chromium

Setup: [100,000 documents](pimdb/src/indexes/benchmarks/benchmark-data.json) with a `name` field.

| Name         | Hz           | Min    | Max    | Mean   | P75    | P99    | P995   | P999   | RME    | Samples | Notes   |
| ------------ | ------------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- |
| array.filter | 1,592.61     | 0.5000 | 1.1000 | 0.6279 | 0.7000 | 0.9000 | 1.0000 | 1.1000 | ±0.85% | 1000    |         |
| sorted.find  | 3,512,770.00 | 0.0000 | 0.2000 | 0.0003 | 0.0000 | 0.0000 | 0.0000 | 0.1000 | ±2.77% | 1756385 | Fastest |

Summary: **2205.67x faster** than native [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

### Substring index - Chromium

Setup: [100,000 documents](pimdb/src/indexes/benchmarks/benchmark-data.json) with a `title` field.

| Name               | Hz         | Min    | Max    | Mean   | P75    | P99    | P995   | P999   | RME    | Samples | Notes   |
| ------------------ | ---------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- |
| `array.filter`     | 183.81     | 4.8000 | 7.2000 | 5.4404 | 5.6000 | 6.5000 | 6.8000 | 7.0000 | ±0.43% | 1000    |         |
| `substring.search` | 151,486.00 | 0.0000 | 0.3000 | 0.0066 | 0.0000 | 0.1000 | 0.1000 | 0.1000 | ±2.72% | 75743   | Fastest |

| Name             | Hz         | Min    | Max    | Mean   | P75    | P99    | P995   | P999   | RME    | Samples | Notes   |
| ---------------- | ---------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- |
| array.filter     | 185.97     | 4.7000 | 7.6000 | 5.3772 | 5.7000 | 7.0000 | 7.2000 | 7.5000 | ±0.67% | 1000    |         |
| substring.search | 120,455.91 | 0.0000 | 1.2000 | 0.0083 | 0.0000 | 0.1000 | 0.1000 | 0.7000 | ±4.17% | 60240   | Fastest |

Summary: **647.72x faster** than native [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

## Contributing

Contributions are welcome! Please feel free to [submit a Pull Request](https://github.com/lirbank/pimdb/pulls).

1. [Fork the repository](https://github.com/lirbank/pimdb/fork)
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. [Open a pull request](https://github.com/lirbank/pimdb/compare)

## License

This project is [open-source](https://github.com/lirbank/pimdb) and available under the [MIT License](LICENSE). Feel free to use it in your projects!

Authored and maintained by Mikael Lirbank ([@lirbank](https://github.com/lirbank)).

If you find this project helpful, consider giving it a ⭐️ on [GitHub](https://github.com/lirbank/pimdb)!

## About the author

I'm an experienced developer passionate about building performant and elegant solutions. Currently open to new consulting projects or full-time opportunities. Visit [lirbank.com](https://www.lirbank.com/) to connect.
