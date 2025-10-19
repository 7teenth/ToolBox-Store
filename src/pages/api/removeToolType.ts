import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.body || {};
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const filePath = path.join(process.cwd(), "src/types/tool_types.ts");
    let content = "";
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch (e) {
      // If file is missing or unreadable, nothing to remove
      console.warn("removeToolType: could not read file, treating as empty", e);
      content = "export const tool_types: Record<string, string[]> = {\n};\n";
    }

    // Build regex to remove an entry like: \n  "slug": ["a", "b"],\n  (or without trailing comma if last)
    const entryRegex = new RegExp(`\\n\\s*"${slug}"\\s*:\\s*\\[[^\\]]*\\]\\s*,?\\s*`, "g");

    if (!entryRegex.test(content)) {
      // Try alternative: maybe entry is last and there's no leading newline
      const altRegex = new RegExp(`"${slug}"\\s*:\\s*\\[[^\\]]*\\]\\s*,?`, "g");
      if (!altRegex.test(content)) {
        return res.status(404).json({ message: "Entry not found", slug });
      }
      content = content.replace(altRegex, "");
    } else {
      content = content.replace(entryRegex, "\n");
    }

    // Cleanup: remove any trailing commas before closing brace
    content = content.replace(/,\s*\n\s*};/, "\n};");

    fs.writeFileSync(filePath, content, "utf-8");
    return res.status(200).json({ message: "Removed", slug, fullFile: content });
  } catch (err) {
    console.error("removeToolType error:", err);
    return res.status(500).json({ error: "Failed to update tool_types.ts", details: String(err) });
  }
}
