import * as Methods from "./hashTableMethods.js"


export class HashTable {
  constructor(size = 7) {
    this.size = size
    this.table = [12,415,6127,882,12]
    this.count = 0
    this.loadFactor = this.count / this.size
  }

  display = Methods.DisplayTable(this);
  //updateLF = Methods.UpdateLoadFactor();
  //InsertKey(key);
  //DeleteKey(key);
}


/*
const DEFAULT_DISPLAY_TEXT = '<div class="row my-1">\
<span class="text-white">some sample text</span>\
</div>'

function DisplayTable() {
  const Table_Display = document.getElementById("table-display")
  if (HashTable.count === 0) {
    Table_Display.innerHTML = DEFAULT_DISPLAY_TEXT
  } else {
    HashTable.table.forEach((element) => {
      const TableIndexElementRow = document.createElement("div")
      TableIndexElementRow.classList.add("row")
      TableIndexElementRow.classList.add("py-1")

      const TableIndexElementSpan = document.createElement("span")
      TableIndexElementSpan.innerText = "Index " + i + ": " + HashTable.table[i]
      TableIndexElementSpan.classList.add("text-white")

      TableIndexElementRow.appendChild(TableIndexElementSpan)
      Table_Display.appendChild(TableIndexElementRow)
    })
  }
}
*/