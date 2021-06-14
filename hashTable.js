//* Default Texts
const DEFAULT_DISPLAY_TEXT = '<div class="row my-1">\
<span class="text-white">some sample text</span>\
</div>'


//* Page Elements
const TABLE_DISPLAY = document.getElementById("table-display")



export class HashTable {
  constructor(size = 7) {
    this.size = size
    this.table = [14, 51, 125]
    this.count = 2
    this.loadFactor = 0
  }

  SetCount() {
    this.count = this.table.length
  }
  SetLoadFactor() {
    this.loadFactor = this.count / this.size
  }


  ClearTable() {
    this.table = []
    this.DisplayTable()
  }


  DisplayTable() {
    TABLE_DISPLAY.innerHTML = DEFAULT_DISPLAY_TEXT
    if (this.count !== 0) {
      this.table.forEach((item, index) => {
        const TABLE_ELEMENT_ROW_CONTAINER = document.createElement("div")
        TABLE_ELEMENT_ROW_CONTAINER.classList.add("row")
        TABLE_ELEMENT_ROW_CONTAINER.classList.add("py-1")

        const TABLE_ELEMENT_TEXT_SPAN = document.createElement("span")
        TABLE_ELEMENT_TEXT_SPAN.innerText = `Index ${index}: ${item}`
        TABLE_ELEMENT_TEXT_SPAN.classList.add("text-white")

        TABLE_ELEMENT_ROW_CONTAINER.appendChild(TABLE_ELEMENT_TEXT_SPAN)
        TABLE_DISPLAY.appendChild(TABLE_ELEMENT_ROW_CONTAINER)
      })
    }
  }
}


