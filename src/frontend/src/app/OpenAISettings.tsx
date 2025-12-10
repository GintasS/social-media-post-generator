"use client";

import { useState } from "react";

export interface OpenAISettingsData {
  model: string;
  temperature: number;
  webSearch: boolean;
}

interface OpenAISettingsProps {
  initialSettings?: OpenAISettingsData;
  onSave: (settings: OpenAISettingsData) => void;
}

export default function OpenAISettings({ initialSettings, onSave }: OpenAISettingsProps) {
  const [model, setModel] = useState(initialSettings?.model ?? "gpt-5.1");
  const [temperature, setTemperature] = useState(initialSettings?.temperature ?? 0.7);
  const [webSearch, setWebSearch] = useState(initialSettings?.webSearch ?? true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ model, temperature, webSearch });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">OpenAI Configuration</h2>
        <p className="text-gray-600 text-sm mb-6">
          Configure your OpenAI API settings for generating social media posts.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            className="w-full px-3 py-2 border rounded-md bg-white"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gpt-5.1">GPT-5.1</option>
            <option value="gpt-5-mini">GPT-5 Mini</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Temperature</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="0.7"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
          <p className="text-gray-500 text-xs mt-1">Controls randomness (0 = focused, 1 = creative)</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">Web Search</label>
            <p className="text-gray-500 text-xs">Enable web search for more up-to-date content</p>
          </div>
          <button
            type="button"
            onClick={() => setWebSearch(!webSearch)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              webSearch ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                webSearch ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        {saved ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Saved!
          </>
        ) : (
          "Save Settings"
        )}
      </button>
    </div>
  );
}

