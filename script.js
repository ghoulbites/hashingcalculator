import { HashTable } from "./hashTable.js"

//! Bootstrap garbage to allow tooltips for <input> element
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

//* Main Code
let hashTable = new HashTable()

//* Property Logging Functions
const LogSize = () => console.log(`Size: ${hashTable.size}`)
const LogTable = () => console.log(`Table: ${hashTable.table}`)
const LogCount = () => console.log(`Count: ${hashTable.count}`)
const LogLoadFactor = () => console.log(`Load Factor: ${hashTable.loadFactor}`)
const LogDataType = () => console.log(`Data Type: ${hashTable.dataType}`)
const LogResolutionMethod = () => console.log(`Resolution Method: ${hashTable.resolutionMethod}`)
const LogHashFunction = () => console.log(`Hash Function: ${hashTable.hashFunctionString}`)
const LogDoubleHashFunction = () => console.log(`Double Hash Function: ${hashTable.doubleHashString}`)
const LogLinearProbeMultiplier = () => console.log(`Linear Probe Multiplier: ${hashTable.linearMultiplier}`)
const LogQuadraticProbeMultiplier = () => console.log(`Quadratic Probe Multiplier: ${hashTable.quadraticMultiplier}`)

//* Site Items
const TableSizeInput = document.querySelector("input")
const TableDataTypeSelect = document.querySelector("select")
const HashFunctionInput = document.querySelector("div.my-auto input")
console.log(HashFunctionInput)
const CollisionResolutionOptions = document.querySelector("fieldset")


//* Listener Functions
TableSizeInput.addEventListener("focusout", (event) => {
  let inputValue = event.target.value
  if (inputValue === "") inputValue = 7
  hashTable.size = parseInt(inputValue)
  LogSize()
})

TableDataTypeSelect.addEventListener("change", (event) => {
  hashTable.dataType = parseInt(event.target.value)
  LogDataType()
})


HashFunctionInput.placeholder = hashTable.hashFunctionString
// Tooltip Text
HashFunctionInput.setAttribute(
	"title",
	"Use 'k' to symbolise the key, use 's' to symbolise the table size. The operators are: + for addition, - for subtraction, * for multiplication, / for decimal division, ** for powers, and % for modulus/remainder. Note that // integer division is not supported."
)

HashFunctionInput.addEventListener("focusout", (event) => {
	let inputValue = event.target.value;
  if (inputValue === "") inputValue = hashTable.hashFunctionString
	console.log("Hash Function String: " + Hash_Function_String);
})

CollisionResolutionOptions.addEventListener("change", (event) => {
  hashTable.resolutionMethod = parseInt(event.target.value)
  LogResolutionMethod()
})


hashTable.DisplayTable()
LogSize()
LogCount()

//newHashTable.table = [12, 41, 676];
hashTable.ClearTable()
LogSize()
LogCount()
hashTable.InsertKey(1)
LogResolutionMethod()
LogHashFunction()

hashTable.DisplayTable()



