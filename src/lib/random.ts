// returns a random sample of up to n elements from the given array.
// if n is greater than the length of the array, the entire array is returned.
export function sample<T>(array: T[], n = 1): T[] {
  if (n > array.length) {
    return [...array];
  }

  const result = [];
  const copy = [...array];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }
  return result;
}

// returns a random element from an array
export function choose<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}
