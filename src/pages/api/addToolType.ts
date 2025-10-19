import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, selectedColumns } = req.body;

  if (!slug || !selectedColumns) {
    return res.status(400).json({ error: "Missing slug or parameters" });
  }

  try {
    const filePath = path.join(process.cwd(), "src/types/tool_types.ts");

    // Ensure the file exists and has a valid template. If empty or malformed, initialize it.
    let content = "";
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch (readErr) {
      // If read fails, we'll initialize below
      console.warn("Could not read tool_types.ts, will initialize new file", readErr);
      content = "";
    }

    if (!content || !/\bexport\s+const\s+tool_types\b/.test(content)) {
      // initialize with a predictable structure
      content = `export const tool_types: Record<string, string[]> = {\n};\n`;
    }

    // Добавляем новый тип
    const newType = `\n  "${slug}": [${selectedColumns.map((c: string) => `"${c}"`).join(", ")}],`;

    // Попробуем вставить перед закрывающей скобкой `};` — если не найдено, просто добавим внутрь {}
    if (/\};\s*$/.test(content)) {
      content = content.replace(/(\};\s*)$/, `${newType}\n$1`);
    } else {
      // fallback: replace the closing brace of object
      content = content.replace(/\{\s*\}/, `{${newType}\n}`);
    }

    fs.writeFileSync(filePath, content, "utf-8");

    // return the inserted raw snippet for debugging in client
    res.status(200).json({ message: "Тип додано", inserted: newType, fullFile: content });
  } catch (err) {
    console.error("Failed to update tool_types.ts:", err);
    res.status(500).json({ error: "Не вдалося оновити Tool_Types.ts", details: String(err) });
  }
}
