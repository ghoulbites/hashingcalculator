import {HashTable} from "./hashTable.js"

let newHashTable = new HashTable();

console.log(newHashTable.size);

newHashTable.DisplayTable()

console.log(newHashTable.count);

newHashTable.table = [12, 41, 676];

console.log(newHashTable.size);

newHashTable.DisplayTable()

console.log(newHashTable.count);

newHashTable.ClearTable();