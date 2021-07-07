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

  ResetTable() {
    this.count = 0
    this.loadFactor = 0
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
    console.log(this.table);

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
    console.log("Size of table: " + this.size + ", count: " + this.count);

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
  if (hashString.match(regex) !== null) return false
  return true
}

function CheckIfInteger(inputString) {
  const regex = /[^\d+]/m

  if (inputString.match(regex) !== null) return false
  return true
}

function CheckIfFloat(inputString) {
  const regex = /[^\d\.]/m

  if (inputString.match(regex) !== null) return false
  return true
}

function FormatHashString(inputString, key, tableObject) {
  inputString = inputString.replace("k", key)
  inputString = inputString.replace("s", tableObject.size)
  inputString = inputString.replaceAll(" ", "")

  console.log(inputString)

  //? They should all be null
  const regexFilteringCharactersForInt = /[^\d+%/*-]/gm
  const regexFilteringCharactersForDecimal = /[^\d\.+%/*-]/gm
  const regexOperatorAmounts = /(\*{3,}|\+{2,}|-{2,}|%{2,}|\/{2,})/gm
  const regexOperatorsSeparatedByNumbers = /(\D+\*{1,2}\D+|\D+\+\D+|\D+-\D+|\D+%\D+|\D+\/\D+)/gm

  if (tableObject.dataType === 1) {
    if (
      inputString.match(regexFilteringCharactersForInt) === null
      && inputString.match(regexOperatorAmounts) === null
      && inputString.match(regexOperatorsSeparatedByNumbers) === null
      ) {
        console.log("The string: " + inputString + ", matched the criteria for a valid function")
        return inputString
      }
    else {
      return undefined
    }
  } else if (tableObject.dataType === 2 || tableObject.dataType === 3) {
    if (
      inputString.match(regexFilteringCharactersForDecimal) === null
      && inputString.match(regexOperatorAmounts) === null
      && inputString.match(regexOperatorsSeparatedByNumbers) === null
      ) {
        console.log("The string: " + inputString + ", matched the criteria for a valid function")
        return inputString
      }
    else {
      return undefined
    }
  }
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
  tempHashString = FormatHashString(tempHashString, key, tableObject)
  /*
  tempHashString = tempHashString.replace("k", key)
  tempHashString = tempHashString.replace("s", tableObject.size)
  tempHashString = tempHashString.replaceAll(" ", "")
  */
  //console.log(tempHashString)

  if (tempHashString === undefined) {
    console.log("The string was formatted as undefined")
    return undefined
  }
  if (!CheckFunctionStringValidity(tempHashString, tableObject)) {
    console.log("The string is invalid")
    return undefined
  }

  const result = new Function("return " + tempHashString)() % tableObject.size
  //console.log(`Hash Function Result: ${result}`);
  return result
}

function HashFunction(key, tableObject) {
  //console.log(hashString)
  let tempHashString = tableObject.hashFunctionString
  tempHashString = FormatHashString(tempHashString, key, tableObject)
  /*
  tempHashString = tempHashString.replace("k", key)
  tempHashString = tempHashString.replace("s", tableObject.size)
  tempHashString = tempHashString.replaceAll(" ", "")
  */
  //console.log(tempHashString)

  if (tempHashString === undefined) {
    console.log("The string was formatted as undefined")
    return undefined
  }
  if (!CheckFunctionStringValidity(tempHashString, tableObject)) {
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
    index === undefined ||
    tableObject.table[index] !== undefined
  ) {
    //? if it gets to this many collisions then its probably an infinite loop so just stop it
    if (collisions === DEFAULTS.MAXIMUM_COLLISIONS) return undefined

    index = Math.floor(HashFunction(key, tableObject)
                       + LinearProbe(collisions, tableObject.linearMultiplier)) % tableObject.size
    console.log("Index: " + index)
    console.log("Array Value at Index: " + tableObject.table[index])
    collisions = collisions + 1
  }
  return index
}

function GetIndexWithQuadraticProbe(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined ||
    tableObject.table[index] !== undefined
  ) {
    //? if it gets to this many collisions then its probably an infinite loop so just stop it
    if (collisions === DEFAULTS.MAXIMUM_COLLISIONS) return undefined

    index = Math.floor(HashFunction(key, tableObject)
                       + QuadraticProbe(collisions, tableObject.quadraticMultiplier)) % tableObject.size
    console.log("Index: " + index)
    console.log("Array Value at Index: " + tableObject.table[index])
    collisions = collisions + 1
  }
  return index
}

function GetIndexWithDoubleHashing(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (
    index === undefined ||
    tableObject.table[index] !== undefined
  ) {
    //? if it gets to this many collisions then its probably an infinite loop so just stop it
    if (collisions === DEFAULTS.MAXIMUM_COLLISIONS) return undefined

    index = Math.floor(HashFunction(key, tableObject)
                       + collisions * DoubleHashFunction(key, tableObject)) % tableObject.size
    collisions = collisions + 1
  }
  return index
}

//* Combination Insertion Functions
function InsertKeyWithSeparateChaining(key, tableObject) {
  let index = Math.floor(HashFunction(key, tableObject)) % tableObject.size

  if (isNaN(index)) {
    console.log("Undefined index using separate chaining")
    return false
  }
  tableObject.table[index].push(key)
  return true
}

function InsertKeyWithOpenAddressing(key, tableObject) {
  console.log(tableObject)
  let index
  if (tableObject.resolutionMethod === 2) {
    index = GetIndexWithLinearProbe(key, tableObject)
    console.log("First + " + index)
  } else if (tableObject.resolutionMethod === 3) {
    index = GetIndexWithQuadraticProbe(key, tableObject)
    console.log("Second + " + index)
  } else if (tableObject.resolutionMethod === 4) {
    index = GetIndexWithDoubleHashing(key, tableObject)
    console.log("Third + " + index)
  }

  if (tableObject.table[index] !== undefined) {
    console.log(
      "There was an error, help pls, I can't read my own code anymore"
    )
    return false
  }
  tableObject.table[index] = key
  console.log("Inserted " + key + " with open addressing")
  return true
}
