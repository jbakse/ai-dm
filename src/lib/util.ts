// removes whitespace from start end of every line and strips empty lines
export function dedent(s: string): string {
  return s
    .split("\n")
    .map((s) => s.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

export function buildPrompt(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  const o = strings.reduce((acc, str, i) => {
    if (typeof values[i] === "string") {
      return acc + str + (values[i] ?? "");
    } else {
      return acc + str + JSON.stringify(values[i] ?? "");
    }
  }, "");

  return dedent(o);
}
