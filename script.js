import { DEFAULT_DOUBLE_HASH_FUNCTION, DEFAULT_HASH_FUNCTION, HashTable } from "./hashTable.js"

//! Bootstrap garbage to allow tooltips for <input> element
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

//* Initializing the hash table
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
const TABLE_SIZE_INPUT = document.querySelector("input")
const TABLE_DATA_TYPE_SELECT = document.querySelector("select")
const HASH_FUNCTION_INPUT = document.querySelector("div.my-auto input")
const COLLISION_RESOLUTION_RADIO_OPTIONS = document.querySelector("fieldset")

const _GROUP_LINEAR_QUAD_DOUBLE_HASH_INPUTS = document.querySelectorAll(".input-group input")
const LINEAR_PROBE_MULTIPLIER_INPUT = _GROUP_LINEAR_QUAD_DOUBLE_HASH_INPUTS[0]
const QUADRATIC_PROBE_MULTIPLIER_INPUT = _GROUP_LINEAR_QUAD_DOUBLE_HASH_INPUTS[1]
const DOUBLE_HASH_FUNCTION_INPUT = _GROUP_LINEAR_QUAD_DOUBLE_HASH_INPUTS[2]

const _GROUP_INSERT_DELETE_FIELDS = document.querySelectorAll(".col-sm-8")
const INSERT_KEY_INPUT = _GROUP_INSERT_DELETE_FIELDS[0]
const DELETE_KEY_INPUT = _GROUP_INSERT_DELETE_FIELDS[1]
const _GROUP_INSERT_DELETE_BUTTONS = document.querySelectorAll("button")
const INSERT_KEY_BUTTON = _GROUP_INSERT_DELETE_BUTTONS[0]
const DELETE_KEY_BUTTON = _GROUP_INSERT_DELETE_BUTTONS[1]


//* Listener Functions
TABLE_SIZE_INPUT.addEventListener("focusout", (event) => {
  let inputValue = event.target.value
  if (inputValue < 1) inputValue = 7
  hashTable.size = parseInt(inputValue)
  LogSize()
  hashTable.ResetTable()
})

TABLE_DATA_TYPE_SELECT.addEventListener("change", (event) => {
  hashTable.dataType = parseInt(event.target.value)
  LogDataType()
  hashTable.ResetTable()
})

HASH_FUNCTION_INPUT.addEventListener("focusout", (event) => {
	let inputValue = event.target.value
  if (inputValue === "") inputValue = DEFAULT_HASH_FUNCTION
  hashTable.hashFunctionString = inputValue
  LogHashFunction()
  hashTable.ResetTable()
})

COLLISION_RESOLUTION_RADIO_OPTIONS.addEventListener("change", (event) => {
  hashTable.resolutionMethod = parseInt(event.target.value)
  LogResolutionMethod()
  hashTable.ResetTable()
})

LINEAR_PROBE_MULTIPLIER_INPUT.addEventListener("focusout", (event) => {
  let inputValue = event.target.value
  if (inputValue < 1) inputValue = 1
  hashTable.linearMultiplier = parseInt(inputValue)
  LogLinearProbeMultiplier()
  hashTable.ResetTable()
})

QUADRATIC_PROBE_MULTIPLIER_INPUT.addEventListener("focusout", (event) => {
  let inputValue = event.target.value
  if (inputValue < 1) inputValue = 1
  hashTable.quadraticMultiplier = parseInt(inputValue)
  LogQuadraticProbeMultiplier()
  hashTable.ResetTable()
})

DOUBLE_HASH_FUNCTION_INPUT.addEventListener("focusout", (event) => {
	let inputValue = event.target.value
  if (inputValue === "") inputValue = DEFAULT_DOUBLE_HASH_FUNCTION
  hashTable.doubleHashString = inputValue
  LogDoubleHashFunction()
  hashTable.ResetTable()
})

INSERT_KEY_BUTTON.addEventListener("click", () => {
  const key = INSERT_KEY_INPUT.value
  console.log(key);
  if (isNaN(key)) {
    return console.log("not a number")
  } else {
    hashTable.InsertKey(key)
    return console.log("a number")
  }
})

DELETE_KEY_BUTTON.addEventListener("click", () => {
  const key = DELETE_KEY_INPUT.value
  console.log(key);
  if (isNaN(key)) {
    return console.log("not a number")
  } else {
    return console.log("a number")
  }
})


//! Starting the page
document.addEventListener("DOMContentLoaded", () => {
  //* Setting Texts on page load
  //? Hash Function Input Texts
  HASH_FUNCTION_INPUT.placeholder = hashTable.hashFunctionString
  HASH_FUNCTION_INPUT.setAttribute(
    // Tooltip text
    "title",
    "Use 'k' to symbolise the key, use 's' to symbolise the table size. The operators are: + for addition, - for subtraction, * for multiplication, / for decimal division, ** for powers, and % for modulus/remainder. Note that // integer division is not supported."
  )

  //* Display the table right away
  hashTable.DisplayTable()
  hashTable.InsertKey(1)
  hashTable.InsertKey(2)
  hashTable.InsertKey(124)
  hashTable.InsertKey(9)
})


