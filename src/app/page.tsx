"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  publicationYear: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [searchAuthor, setSearchAuthor] = useState<string>("");

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "http://localhost:8080/books";
      if (searchTitle || searchAuthor) {
        const params = new URLSearchParams();
        if (searchTitle) params.append("title", searchTitle);
        if (searchAuthor) params.append("author", searchAuthor);
        url = `http://localhost:8080/books/search?${params.toString()}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data.content);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  if (loading) return <p className="text-center text-gray-600 text-lg">Loading books...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Book List</h1>
      
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="p-2 border rounded-lg shadow-sm"
        />
        <input
          type="text"
          placeholder="Search by author"
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
          className="p-2 border rounded-lg shadow-sm"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
              <p className="text-gray-600">by {book.author} ({book.publicationYear})</p>
              <Link href={`/books/${book.id}`}>
                <span className="mt-2 inline-block text-blue-500 hover:text-blue-700 cursor-pointer">View Details</span>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No books found.</p>
        )}
      </div>
    </div>
  );
}
