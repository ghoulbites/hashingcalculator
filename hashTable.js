export const DEFAULTS = {
  DEFAULT_TABLE_SIZE: 7,
  DEFAULT_DISPLAY_TEXT:
'<div class="row my-1">\
  <span class="text-white">some sample text</span>\
</div>',
  DEFAULT_HASH_FUNCTION: "24 + k + 11 % s",
  DEFAULT_DOUBLE_HASH_FUNCTION: "7 - k",
  TABLE_DISPLAY: document.getElementById("table-display"),
  INT_REGEX_STRING: /[^ks+\/%^*\-\d()]/gm,
  DECIMAL_REGEX_STRING: /(\d+\.\d+)+[^ks+\/%^*\-\d()]+/gm,
  MAXIMUM_COLLISIONS: 100
}
import * as misc from "./misc.js"

export class HashTable {
  constructor(size = DEFAULTS.DEFAULT_TABLE_SIZE) {
    this.size = size
    this.table = []
    this.count = this.table.length
    this.loadFactor = this.count / this.size
    this.dataType = 1
    this.resolutionMethod = 1
    this.hashFunctionString = DEFAULTS.DEFAULT_HASH_FUNCTION
    this.doubleHashString = DEFAULTS.DEFAULT_DOUBLE_HASH_FUNCTION
    this.linearMultiplier = 1
    this.quadraticMultiplier = 1
    this.ResetTable()
  }

  UpdateLoadFactor() {
    this.loadFactor = Math.round((this.count / this.size) * 100) / 100
  }

  ResetTable() {
    this.count = 0
    this.loadFactor = 0
    this.table = []

    if (this.resolutionMethod === 1) {
      for (let i = 0; i < this.size; i++) {
        this.table[i] = []
      }
    } else {
      for (let i = 0; i < this.size; i++) {
        this.table[i] = undefined
      }
    }

    this.DisplayTable()
  }

  DisplayTable() {
    DEFAULTS.TABLE_DISPLAY.innerHTML = DEFAULTS.DEFAULT_DISPLAY_TEXT
    
    this.table.forEach((item, index) => {
      const TABLE_ELEMENT_ROW_CONTAINER = document.createElement("div")
      TABLE_ELEMENT_ROW_CONTAINER.classList.add("row")
      TABLE_ELEMENT_ROW_CONTAINER.classList.add("py-1")

      let itemString = ""
      if (this.resolutionMethod === 1) {
        itemString = item.toString().replaceAll(",", ", ")
        itemString = "[ " + itemString + " ]"
      } else {
        itemString = item
        if (itemString === undefined) {
          itemString = "Empty"
        }
      }

      const TABLE_ELEMENT_TEXT_SPAN = document.createElement("span")
      TABLE_ELEMENT_TEXT_SPAN.innerText = `Index ${index}: ${itemString}`
      TABLE_ELEMENT_TEXT_SPAN.classList.add("text-white")

      // Append the span containing the index contents to the row div
      TABLE_ELEMENT_ROW_CONTAINER.appendChild(TABLE_ELEMENT_TEXT_SPAN)
      // Append the row div to the table display container
      DEFAULTS.TABLE_DISPLAY.appendChild(TABLE_ELEMENT_ROW_CONTAINER)
    })
  }


  InsertKey(key) {
    let check = false;

    if (this.resolutionMethod === 1) {
      check = InsertKeyWithSeparateChaining(key, this)
    }

    //* Just return if the key isn't being inserted with separate chaining and the table is full
    if (this.count === this.size && this.resolutionMethod !== 1) {
      return console.log("Table is full")
    }

    if (this.resolutionMethod !== 1) {
      check = InsertKeyWithOpenAddressing(key, this)
    }

    if (check) {
      this.count += 1
      this.UpdateLoadFactor()
      this.DisplayTable()
    }
  }

  DeleteKey(key) {
    //? No need to do anything if the hashtable is empty
    if (this.count === 0) return console.log("The table is empty so... can't remove nothin'")

    //? Look for key in the array at the generated index
    if (this.resolutionMethod === 1) {
      let index = Math.floor(HashFunction(key, this)) % this.size
      for (let i = 0; i < this.table[index].length; i++) {
        if (key === this.table[index][i]) {
          this.table[index].splice(i, 1)
          this.count = this.count - 1
          this.UpdateLoadFactor()
          this.DisplayTable()
          return console.log("Removed " + key + " from the array at index " + index)
        }
      }
      //? If it reaches this point then it didn't return early and so it didn't find the key
      return console.log("The key " + key + " was not found")
    }


    let index = undefined
    let collisions = 0
    while (
      index === undefined
      || this.table[index] === undefined
    ) {
      if (this.resolutionMethod === 2) {
        index = Math.floor(HashFunction(key, this) + LinearProbe(collisions, this.linearMultiplier)) % this.size
      } else if (this.resolutionMethod === 3) {
        index = Math.floor(HashFunction(key, this) + QuadraticProbe(collisions, this.quadraticMultiplier)) % this.size
      } else if (this.resolutionMethod === 4) {
        index = Math.floor(HashFunction(key, this) + collisions * DoubleHashFunction(key, this)) % this.size
      }
      collisions = collisions + 1
    }

    //? Error berakpoints or in case the key was found
    if (index === "Ran too many times") {
      return console.log("Number of hashing attempts reached the cutoff point")
    }
    if (this.table[index] !== key) {
      return console.log("The key " + key + " was not found")
    }

    this.table[index] = null
    this.count = this.count - 1
    this.UpdateLoadFactor()
    this.DisplayTable()
    return console.log("Removed " + key + " from the array at index " + index)
  }
}


//* Hash and Probe Functions
function LinearProbe(collisions, multiplier = 1) {
  return multiplier * collisions
}

function QuadraticProbe(collisions, multiplier = 1) {
  return multiplier * collisions ** 2
}

function HashFunction(key, tableObject) {
  let tempHashString = tableObject.hashFunctionString
  //console.log(tempHashString)
  tempHashString = misc.FormatHashString(tempHashString, key, tableObject)
  //console.log(tempHashString)

  if (tempHashString === undefined) {
    console.log("The string was formatted as undefined")
    return undefined
  }
  if (!misc.CheckFunctionStringValidity(tempHashString, tableObject)) {
    console.log("The string is invalid")
    return undefined
  }

  const result = new Function("return " + tempHashString)() % tableObject.size
  //console.log(`Hash Function Result: ${result}`);
  return result
}

function DoubleHashFunction(key, tableObject) {
  let tempHashString = tableObject.doubleHashString
  //console.log(tempHashString)
  tempHashString = misc.FormatHashString(tempHashString, key, tableObject)
  //console.log(tempHashString)

  if (tempHashString === undefined) {
    console.log("The string was formatted as undefined")
    return undefined
  }
  if (!misc.CheckFunctionStringValidity(tempHashString, tableObject)) {
    console.log("The string is invalid")
    return undefined
  }

  const result = new Function("return " + tempHashString)() % tableObject.size
  //console.log(`Hash Function Result: ${result}`);
  return result
}


//* Specific Insertion Functions
function GetIndexWithLinearProbe(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined
    || (tableObject.table[index] !== undefined && tableObject.table[index] !== null)
  ) {
    //? if it gets to this many collisions then its probably an infinite loop so just stop it
    console.log(index);
    if (collisions === DEFAULTS.MAXIMUM_COLLISIONS) return "Ran too many times"

    index = Math.floor(HashFunction(key, tableObject)
                       + LinearProbe(collisions, tableObject.linearMultiplier)) % tableObject.size
    /* console.log("Index: " + index)
    console.log("Array Value at Index: " + tableObject.table[index]) */
    collisions = collisions + 1
    console.log(index);
  }
  return index
}

function GetIndexWithQuadraticProbe(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined
    || (tableObject.table[index] !== undefined && tableObject.table[index] !== null)
  ) {
    //? if it gets to this many collisions then its probably an infinite loop so just stop it
    console.log(index);
    if (collisions === DEFAULTS.MAXIMUM_COLLISIONS) return "Ran too many times"

    index = Math.floor(HashFunction(key, tableObject)
                       + QuadraticProbe(collisions, tableObject.quadraticMultiplier)) % tableObject.size
    /* console.log("Index: " + index)
    console.log("Array Value at Index: " + tableObject.table[index]) */
    collisions = collisions + 1
  }
  return index
}

function GetIndexWithDoubleHashing(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined
    || (tableObject.table[index] !== undefined && tableObject.table[index] !== null)
  ) {
    //? if it gets to this many collisions then its probably an infinite loop so just stop it
    console.log(index);
    if (collisions === DEFAULTS.MAXIMUM_COLLISIONS) return "Ran too many times"

    index = Math.floor(HashFunction(key, tableObject)
                       + collisions * DoubleHashFunction(key, tableObject)) % tableObject.size
    /* console.log("Index: " + index)
    console.log("Array Value at Index: " + tableObject.table[index]) */
    collisions = collisions + 1
  }
  return index
}

//* Combination Insertion Functions
function InsertKeyWithSeparateChaining(key, tableObject) {
  let index = Math.floor(HashFunction(key, tableObject)) % tableObject.size

  if (isNaN(index)) {
    return false
  }
  tableObject.table[index].push(key)
  return true
}

function InsertKeyWithOpenAddressing(key, tableObject) {
  //console.log(tableObject)
  let index
  if (tableObject.resolutionMethod === 2) {
    index = GetIndexWithLinearProbe(key, tableObject)
  } else if (tableObject.resolutionMethod === 3) {
    index = GetIndexWithQuadraticProbe(key, tableObject)
  } else if (tableObject.resolutionMethod === 4) {
    index = GetIndexWithDoubleHashing(key, tableObject)
  }

  if (index === "Ran too many times") {
    console.log("Number of hashing attempts reached the cutoff point")
    return false
  }

  if (tableObject.table[index] !== undefined) {
    console.log(
      "There was an error, help pls, I can't read my own code anymore"
    )
    return false
  }
  tableObject.table[index] = key
  //console.log("Inserted " + key + " with open addressing")
  return true
}
