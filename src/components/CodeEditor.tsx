"use client";

import { useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    onChange(code);
    setLineCount(code.split("\n").length);
  };

  return (
    <div className="border-2 border-gray-800 rounded-xl overflow-hidden bg-gray-900 shadow-lg hover:border-gray-700 transition-all duration-200">
      <div className="flex">
        {/* Line numbers */}
        <div className="bg-gray-800/50 text-gray-500 px-6 py-4 select-none text-right text-sm font-mono border-r-2 border-gray-800 min-w-fit">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i + 1} className="h-6 leading-6 font-medium">{i + 1}</div>
          ))}
        </div>

        {/* Code editor */}
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder || "Paste your code here..."}
          className="flex-1 p-6 bg-gray-900 text-gray-100 font-mono text-sm outline-none resize-none focus:bg-gray-850 transition-colors"
          style={{ minHeight: "500px" }}
          spellCheck="false"
        />
      </div>
    </div>
  );
}
