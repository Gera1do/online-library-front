"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface BookDetails {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  description: string;
}

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter()
  const [book, setBook] = useState<BookDetails | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState<boolean>(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch book");
        return res.json();
      })
      .then((data) => setBook(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchAiInsights = async () => {
    setInsightLoading(true);
    setInsightError(null);
    try {
      const res = await fetch(`http://localhost:8080/books/${id}/ai-insights`);
      if (!res.ok) throw new Error("Failed to fetch AI insights");
      const data = await res.text(); 
      setAiInsight(data);
    } catch (err) {
      setInsightError((err as Error).message);
    } finally {
      setInsightLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600 text-lg">Loading book details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!book) return <p className="text-center text-gray-500">Book not found</p>;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
         <button
        onClick={() => router.push("/")}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
      >
        ← Back to Home
      </button>
      <h1 className="text-4xl font-bold text-blue-600">{book.title}</h1>
      <p className="text-gray-700 text-lg mt-2">by {book.author} ({book.publicationYear})</p>
      <p className="mt-4 text-gray-600">{book.description}</p>

      {/* Fetch AI Insights Button */}
      <button
        onClick={fetchAiInsights}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        disabled={insightLoading}
      >
        {insightLoading ? "Fetching Insights..." : "Get AI Insights"}
      </button>

      {/* Display AI Insights */}
      {insightLoading && <p className="mt-4 text-gray-500">Loading AI insights...</p>}
      {insightError && <p className="mt-4 text-red-500">Error: {insightError}</p>}
      {aiInsight && (
        <div className="mt-6 p-4 border-l-4 border-blue-500 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold text-blue-700">AI Insight:</h3>
          <p className="text-gray-700">{aiInsight}</p>
        </div>
      )}
    </div>
  );
}
