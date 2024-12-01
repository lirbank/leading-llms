import { bench, describe } from "vitest";
import { PimSortedIndex } from "./sorted";
import testData100000 from "./benchmark-data.json";
import { makeExactMatchPredicate, Spaceship } from "./test-helpers";
const unsortedDocs = testData100000 as Spaceship[];

// The number of documents to test
const marks = [100000];

const query = "Nostromo";
const indexField: keyof Spaceship = "name";
const predicate = makeExactMatchPredicate(indexField)(query);

/**
 * find
 */
describe.each(marks)(`sorted.find on %d docs`, (count) => {
  const docs = unsortedDocs.slice(0, count);

  const index = new PimSortedIndex<Spaceship>(indexField);
  docs.forEach((doc) => index.insert(doc));

  bench(
    `array.filter ${count}`,
    () => {
      docs.filter(predicate);
    },
    { iterations: 1000 },
  );

  bench(
    `sorted.find ${count}`,
    () => {
      index.find(query);
    },
    { iterations: 1000 },
  );
});
