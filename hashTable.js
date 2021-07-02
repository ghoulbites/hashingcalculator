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
}

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
  }

  UpdateCount() {
    this.count = this.table.length
  }
  UpdateLoadFactor() {
    this.loadFactor = this.count / this.size
  }
  UpdateProperties() {
    this.UpdateCount()
    this.UpdateLoadFactor()
  }

  ClearTable() {
    this.table = []
    if (this.resolutionMethod === 1) {
      console.log("Using separate Chaining")
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
    if (this.count === 0) {
      for (let i = 0; i < this.size; i++) {
        if (this.resolutionMethod === 1) {
          this.table.push([])
        }
        else {
          this.table.push(undefined)
        }
      }
    }

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

  ResetTable() {
    this.ClearTable()
    this.DisplayTable()
  }

  InsertKey(key) {
    if (this.resolutionMethod === 1) {
      InsertKeyWithSeparateChaining(key, this)
      console.log("Inserted " + key + " with separate chaining")
    }

    //! Just return if the key isn't being inserted with separate chaining and the table is full
    if (this.count === this.size && this.resolutionMethod !== 1) {
      return console.log("Table is full")
    }

    if (this.resolutionMethod !== 1) {
      InsertKeyWithOpenAddressing(key, this)
    }

    this.count += 1
    this.UpdateLoadFactor()
    this.DisplayTable()
  }

  DeleteKey(key) {
  }
}


//* Misc Functions
function CheckFunctionStringValidity(hashString, tableObject) {
  let regex = DEFAULTS.INT_REGEX_STRING
  if (tableObject.dataType === 1) {
    regex = DEFAULTS.INT_REGEX_STRING
  } else if (tableObject.dataType === 2 || tableObject.dataType === 3) {
    regex = DEFAULTS.DECIMAL_REGEX_STRING
  }
  if (hashString.match(regex) != null) return false
  return true
}

//* Hash and Probe Functions
function LinearProbe(collisions, multiplier = 1) {
  return multiplier * collisions
}

function QuadraticProbe(collisions, multiplier = 1) {
  return multiplier * collisions ** 2
}

function DoubleHashFunction(key, tableObject) {
  //console.log(hashString)
  let tempHashString = tableObject.doubleHashString
  tempHashString = tempHashString.replace("k", key)
  tempHashString = tempHashString.replace("s", tableObject.size)
  tempHashString = tempHashString.replaceAll(" ", "")
  //console.log(tempHashString)

  if (!CheckFunctionStringValidity(tempHashString, tableObject)) return undefined

  const result = new Function("return " + tempHashString)() % tableObject.size
  //console.log(`Hash Function Result: ${result}`);
  return result
}

function HashFunction(key, tableObject) {
  //console.log(hashString)
  let tempHashString = tableObject.hashFunctionString
  tempHashString = tempHashString.replace("k", key)
  tempHashString = tempHashString.replace("s", tableObject.size)
  tempHashString = tempHashString.replaceAll(" ", "")
  //console.log(tempHashString)

  if (!CheckFunctionStringValidity(tempHashString, tableObject)) return undefined

  const result = new Function("return " + tempHashString)() % tableObject.size
  //console.log(`Hash Function Result: ${result}`);
  return result
}

//* Specific Insertion Functions
function GetIndexWithLinearProbe(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined ||
    tableObject.table[index] === undefined ||
    tableObject.table[index] === null
  ) {
    index =
      (HashFunction(key, tableObject) +
        LinearProbe(collisions, tableObject.linearMultiplier)) %
      tableObject.size
    collisions = collisions + 1
  }
  return index
}

function GetIndexWithQuadraticProbe(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined ||
    tableObject.table[index] === undefined ||
    tableObject.table[index] === null
  ) {
    index =
      (HashFunction(key, tableObject) +
        QuadraticProbe(collisions, tableObject.quadraticMultiplier)) %
      tableObject.size
    collisions = collisions + 1
  }
}

function GetIndexWithDoubleHashing(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined ||
    tableObject.table[index] === undefined ||
    tableObject.table[index] === null
  ) {
    index =
      (HashFunction(key, tableObject) +
       + collisions * DoubleHashFunction(key, tableObject))
       % tableObject.size
    collisions = collisions + 1
  }
}

//* Combination Insertion Functions
function InsertKeyWithSeparateChaining(key, tableObject) {
  let index
  try {
    index = Math.round(HashFunction(key, tableObject) % tableObject.size)
  } catch (error) {
    console.log("Couldn't insert key because of:\n" + error)
    return undefined
  }
  console.log("index: " + index);
  tableObject.table[index].push(key)
  return true
}

function InsertKeyWithOpenAddressing(key, tableObject) {
  console.log(tableObject);
  let index = undefined
  if (tableObject.resolutionMethod === 2) {
    index = GetIndexWithLinearProbe(key, tableObject)
    console.log("First + " + index);
  } else if (tableObject.resolutionMethod === 3) {
    index = GetIndexWithQuadraticProbe(key, tableObject)
    console.log("Second + " + index);
  } else if (tableObject.resolutionMethod === 4) {
    index = GetIndexWithDoubleHashing(key, tableObject)
    console.log("Third + " + index);
  }

  if (tableObject.table[index] === undefined || tableObject.table[index] === null) {
    console.log(
      "There was an error, help pls, I can't read my own code anymore"
    )
    return undefined
  }
  tableObject.table[index] = key
  return true
}
