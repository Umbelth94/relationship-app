//Checks if the userProfile state object matches the field values, returns true if they're equal

export function isEqual(obj1: any, obj2: any) {
  // Check if both are the same object reference
  if (obj1 === obj2) {
    return true;
  }

  // Check if either is not an object or is null
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is different
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check each key in obj1
  for (const key of keys1) {
    // Check if obj2 has the key
    if (!keys2.includes(key)) {
      return false;
    }

    // Recursively compare values
    if (!isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
