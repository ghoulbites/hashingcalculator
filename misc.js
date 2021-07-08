//* Misc Functions
import { DEFAULTS } from "./hashTable.js"

export function CheckFunctionStringValidity(hashString, tableObject) {
  let regex = DEFAULTS.INT_REGEX_STRING
  if (tableObject.dataType === 1) {
    regex = DEFAULTS.INT_REGEX_STRING
  } else if (tableObject.dataType === 2 || tableObject.dataType === 3) {
    regex = DEFAULTS.DECIMAL_REGEX_STRING
  }
  if (hashString.match(regex) !== null) return false
  return true
}

export function CheckIfInteger(inputString) {
  const regex = /[^\d+]/m

  if (inputString.match(regex) !== null) return false
  return true
}

export function CheckIfFloat(inputString) {
  const regex = /[^\d\.]/m

  if (inputString.match(regex) !== null) return false
  return true
}

export function FormatHashString(inputString, key, tableObject) {
  inputString = inputString.replace("k", key)
  inputString = inputString.replace("s", tableObject.size)
  inputString = inputString.replaceAll(" ", "")

  //console.log(inputString)

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
        //console.log("The string: " + inputString + ", matched the criteria for a valid function")
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
        //console.log("The string: " + inputString + ", matched the criteria for a valid function")
        return inputString
      }
    else {
      return undefined
    }
  }
}

