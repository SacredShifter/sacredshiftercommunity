import { globby } from "globby"
import fs from "fs/promises"

const files = await globby(["src/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"])
const bad = []

for (const f of files) {
  const s = await fs.readFile(f, "utf8")
  // Adjust patterns to your project's real component paths if needed
  if (s.includes('from "@/components/ui/button-variants"') && !s.includes("button-variants"))
    bad.push(f)
  if (s.includes('from "@/components/ui/button"') && s.includes("button-variants"))
    bad.push(f)
}

if (bad.length) {
  console.error("Potential shadcn import drift in:")
  for (const f of bad) console.error(" -", f)
  process.exit(2)
} else {
  console.log("shadcn imports look OK")
}