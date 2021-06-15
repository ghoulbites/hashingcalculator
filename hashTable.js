//* Default Texts
const DEFAULT_DISPLAY_TEXT = '<div class="row my-1">\
<span class="text-white">some sample text</span>\
</div>'

//* Page Elements
const TABLE_DISPLAY = document.getElementById("table-display")

export class HashTable {
  constructor(size = 7) {
    this.size = size
    this.table = [14, 51, 125, 124]
    this.count = this.table.length
    this.loadFactor = this.count / this.size
    this.dataType = 1
    this.resolutionMethod = 1
    this.hashFunctionString = "24 + k + 11 % s"
    this.doubleHashString = "7 - k"
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
        this.table[i] = [-1, 14]
      }
    } else {
      for (let i = 0; i < this.size; i++) {
        this.table[i] = undefined
      }
    }

    this.DisplayTable()
  }

  DisplayTable() {
    TABLE_DISPLAY.innerHTML = DEFAULT_DISPLAY_TEXT
    if (this.count !== 0) {
      this.table.forEach((item, index) => {
        const TABLE_ELEMENT_ROW_CONTAINER = document.createElement("div")
        TABLE_ELEMENT_ROW_CONTAINER.classList.add("row")
        TABLE_ELEMENT_ROW_CONTAINER.classList.add("py-1")

        let itemString = ""
        if (this.resolutionMethod === 1) {
          itemString = item.toString().replaceAll(",", ", ")
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
        TABLE_DISPLAY.appendChild(TABLE_ELEMENT_ROW_CONTAINER)
      })
    }
  }

  InsertKey(key) {
    if (this.resolutionMethod === 1) {
      let index
      try {
        index = HashFunction(key, this) % this.size
      } catch (error) {
        return console.log("Couldn't insert key because of:\n" + error)
      }
      this.table[index].push(key)
      return
    }

    if (this.count === this.size) {
      return console.log("Table is full")
    } else {
      let index = undefined
      let collisions = 0
      while (index === undefined || this.table[index] !== undefined || this.table[index] !== null) {
        //? Linear Probe
        if (this.resolutionMethod === 2) {
          try {
            index = (HashFunction(key, this) + LinearProbe(collisions)) % this.size
          } catch (error) {
            return console.log("Couldn't insert key because of:\n" + error)
          }
        }
        //? Quadratic Probe
        else if (this.resolutionMethod === 3) {
          try {
            index = (HashFunction(key, this) + QuadraticProbe(collisions)) % this.size
          } catch (error) {
            return console.log("Couldn't insert key because of:\n" + error)
          }
        }
        //? Double Hashing
        else if (this.resolutionMethod === 4) {
          try {
            index = (HashFunction(key, this) + collisions * DoubleHashFunction(key, this)) % this.size
          } catch (error) {
            return console.log("Couldn't insert key because of:\n" + error)
          }
        }
        collisions += 1
      }
      // If its a valid index, then push the key
      this.table[index].push(key)
    }
    this.DisplayTable()
  }

  DeleteKey(key) {}
}

//* Misc Functions
function CheckFunctionStringValidity(hashString) {
  if (hashString.match(/[^ks+\/%^*\-\d()]/gm) != null) return false
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

  if (!CheckFunctionStringValidity(tempHashString)) return undefined

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

  if (!CheckFunctionStringValidity(tempHashString)) return undefined

  const result = new Function("return " + tempHashString)() % tableObject.size
  //console.log(`Hash Function Result: ${result}`);
  return result
}

//* Specific Insertion Functions
function GetIndexWithLinearProbe(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (index === undefined || tableObject.table[index] === undefined || tableObject.table[index] === null) {
    index = (HashFunction(key, tableObject) + LinearProbe(collisions, tableObject.linearMultiplier)) % tableObject.size
    collisions = collisions + 1
  }
  return index
}

function GetIndexWithQuadraticProbe(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (index === undefined || tableObject.table[index] === undefined || tableObject.table[index] === null) {
    index = (HashFunction(key, tableObject) + QuadraticProbe(collisions, tableObject.quadraticMultiplier)) % tableObject.size
    collisions = collisions + 1
  }
}

function GetIndexWithDoubleHashing(key, tableObject) {
  let index = undefined
  let collisions = 0
  while (index === undefined || tableObject.table[index] === undefined || tableObject.table[index] === null) {
    index = (HashFunction(key, tableObject) + collisions * DoubleHashFunction(key, tableObject)) % tableObject.size
    collisions = collisions + 1
  }
}

//* Combination Insertion Functions
function InsertKeyWithSeparateChaining(key, tableObject) {
  let index
  try {
    index = HashFunction(key, tableObject) % tableObject.size
  } catch (error) {
    return console.log("Couldn't insert key because of:\n" + error)
  }
  return tableObject.table[index].push(key)
}

function InsertKeyWithOpenAddressing(key, tableObject) {
  let index = undefined
  if (tableObject.resolutionMethod === 2) {
    index = GetIndexWithLinearProbe(key, tableObject)
  } else if (tableObject.resolutionMethod === 3) {
    index = GetIndexWithQuadraticProbe(key, tableObject)
  } else if (tableObject.resolutionMethod === 4) {
    index = GetIndexWithDoubleHashing(key, tableObject)
  }

  if (index === undefined || index === null) {
    return console.log("There was an error, help pls, I can't read my own code anymore")
  }
  return tableObject.table[index].push(key)
}
