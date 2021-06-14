import {HashTable} from "./hashTable.js"

const DEFAULT_DISPLAY_TEXT = '<div class="row my-1">\
<span class="text-white">some sample text</span>\
</div>'

function DisplayTable(HashTableInstance) {
  const Table_Display = document.getElementById("table-display")
  console.log("ran once");
  console.log(HashTableInstance);
  if (HashTableInstance.count === 0) {
    Table_Display.innerHTML = DEFAULT_DISPLAY_TEXT
  } else {
    HashTableInstance.table.forEach((element) => {
      const TableIndexElementRow = document.createElement("div")
      TableIndexElementRow.classList.add("row")
      TableIndexElementRow.classList.add("py-1")

      const TableIndexElementSpan = document.createElement("span")
      TableIndexElementSpan.innerText = "Index " + i + ": " + element
      TableIndexElementSpan.classList.add("text-white")

      TableIndexElementRow.appendChild(TableIndexElementSpan)
      Table_Display.appendChild(TableIndexElementRow)
    })
  }
}

export {DisplayTable}