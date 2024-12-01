import { PimCollection } from "./pimdb";
import { createPimDB } from "./pimdb";
import { PimPrimaryIndex } from "./primary";
import { PimSortedIndex } from "./sorted";
import { PimSubstringIndex } from "./substring";

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
  age: new PimSortedIndex<User>("age"),
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
