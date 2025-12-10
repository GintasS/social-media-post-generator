"use client";

import { useState, useEffect } from "react";
import { generatePosts, getDefaultProduct, getPlatforms } from "../api";
import OpenAISettings, { OpenAISettingsData } from "./OpenAISettings";
import GeneratedPosts from "./GeneratedPosts";
import HistoricalPosts, { HistoricalPostBatch } from "./HistoricalPosts";

interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

export default function Home() {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
  });
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch default product and platforms on mount
  useEffect(() => {
    getDefaultProduct()
      .then((defaultProduct) => {
        setProduct(defaultProduct);
      })
      .catch((error) => {
        console.error("Failed to fetch default product:", error);
      });

    getPlatforms()
      .then((response) => {
        const platforms = response.platforms.map((id) => ({
          id,
          label: response.details[id]?.name || id.charAt(0).toUpperCase() + id.slice(1),
        }));
        setAvailablePlatforms(platforms);
        setSelectedPlatforms(response.platforms);
      })
      .catch((error) => {
        console.error("Failed to fetch platforms:", error);
      });
  }, []);
  const [activeTab, setActiveTab] = useState<"generator" | "settings" | "posts" | "history">("generator");
  const [postHistory, setPostHistory] = useState<HistoricalPostBatch[]>([]);
  const [openAISettings, setOpenAISettings] = useState<OpenAISettingsData>({
    model: "gpt-5.1",
    temperature: 0.7,
    webSearch: true,
  });
  const [numberOfPosts, setNumberOfPosts] = useState(3);
  const [availablePlatforms, setAvailablePlatforms] = useState<{ id: string; label: string }[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformsDropdownOpen, setPlatformsDropdownOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    description?: string;
    price?: string;
  }>({});
  const [generateError, setGenerateError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { name?: string; description?: string; price?: string } = {};
    if (product.name.trim() === "") {
      newErrors.name = "Product Name is required";
    }
    if (product.description.trim() === "") {
      newErrors.description = "Description is required";
    }
    if (product.price < 0) {
      newErrors.price = "Price cannot be negative";
    }
    return newErrors;
  };

  const handleGeneratePosts = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setGenerateError(null);
    setIsLoading(true);
    try {
      const result = await generatePosts(product, openAISettings, { numberOfPosts, platforms: selectedPlatforms });
      if (result.isError) {
        setGenerateError("An error occurred while generating posts. Please check your settings and try again.");
      } else if (result.posts && result.posts.length > 0) {
        setPosts(result.posts);
        // Save to history
        const newBatch: HistoricalPostBatch = {
          id: Date.now().toString(),
          productName: product.name,
          posts: result.posts,
          generatedAt: new Date(),
        };
        setPostHistory((prev) => [newBatch, ...prev]);
        setActiveTab("posts");
      } else {
        setGenerateError("No posts were generated. Please try again or adjust your product details.");
      }
    } catch (error) {
      setGenerateError("Failed to generate posts. Please check your connection and try again.");
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Social Media Post Generator</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("generator")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "generator"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Post Generator
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "settings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            OpenAI Settings
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "posts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Generated Posts
            {posts.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {posts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "history"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            History
            {postHistory.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {postHistory.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "generator" && (
        <>
          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${fieldErrors.name ? 'border-red-500 bg-red-50' : ''}`}
                  value={product.name}
                  onChange={(e) => {
                    setProduct({ ...product, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                  }}
                  placeholder="EcoBottle Pro"
                  maxLength={100}
                  required
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium mb-2">Price <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  className={`w-full px-3 py-2 border rounded-md ${fieldErrors.price ? 'border-red-500 bg-red-50' : ''}`}
                  value={product.price || 0}
                  onChange={(e) => {
                    setProduct({ ...product, price: parseFloat(e.target.value)});
                    if (fieldErrors.price) setFieldErrors({ ...fieldErrors, price: undefined });
                  }}
                  placeholder="49.99"
                  required
                />
                {fieldErrors.price && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                className={`w-full px-3 py-2 border rounded-md ${fieldErrors.description ? 'border-red-500 bg-red-50' : ''}`}
                rows={4}
                value={product.description}
                onChange={(e) => {
                  setProduct({ ...product, description: e.target.value });
                  if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: undefined });
                }}
                placeholder="Revolutionary reusable water bottle with built-in UV purification..."
                maxLength={400}
                required
              />
              {fieldErrors.description && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category (optional)
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-white"
                value={product.category || ""}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Books & Media">Books & Media</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Posts</label>
              <input
                type="number"
                className="w-24 px-3 py-2 border rounded-md"
                placeholder="3"
                min="1"
                max="10"
                step="1"
                value={numberOfPosts}
                onChange={(e) => setNumberOfPosts(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">Platforms</label>
              <button
                type="button"
                onClick={() => setPlatformsDropdownOpen(!platformsDropdownOpen)}
                className="w-44 px-3 py-2 border rounded-md bg-white text-left flex justify-between items-center"
              >
                <span className="truncate">
                  {selectedPlatforms.length === 0
                    ? "Select"
                    : selectedPlatforms.length === availablePlatforms.length
                    ? "All platforms"
                    : selectedPlatforms.map(p => {
                        const platform = availablePlatforms.find(ap => ap.id === p);
                        return platform?.label || p.charAt(0).toUpperCase() + p.slice(1);
                      }).join(", ")}
                </span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${platformsDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {platformsDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {availablePlatforms.map((platform) => (
                    <label
                      key={platform.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlatforms([...selectedPlatforms, platform.id]);
                          } else {
                            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">{platform.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleGeneratePosts}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Generating...' : 'Generate Posts'}
            </button>
          </div>

          {generateError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="text-red-700 text-sm">{generateError}</p>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "settings" && (
        <OpenAISettings
          initialSettings={openAISettings}
          onSave={setOpenAISettings}
        />
      )}

      {activeTab === "posts" && <GeneratedPosts posts={posts} />}

      {activeTab === "history" && (
        <HistoricalPosts
          history={postHistory}
          onClear={() => setPostHistory([])}
        />
      )}
    </main>
  );
}
