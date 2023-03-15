// removes whitespace from start end of every line and strips empty lines
export function dedent(s: string): string {
  return s
    .split("\n")
    .map((s) => s.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}
