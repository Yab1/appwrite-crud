"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IInterpretations {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<IInterpretations[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/interpretations");
        if (!response.ok) throw new Error("Failed to fetch interpretations");

        const data = await response.json();
        setInterpretations(data);
      } catch (error) {
        console.log(error);
        setError(
          "Failed to fetch interpretations. Please try reloading the page."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterpretations();
  }, []);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/interpretations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete interpretation");
      setInterpretations((prevState) =>
        prevState?.filter((interpretation) => interpretation.$id !== id)
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p className="border bg-red-300 text-red-600 px-5 py-3">{error}</p>
      )}
      {isLoading && <p>Loading Interpretations ...</p>}
      {interpretations?.map(({ $id, term, interpretation }) => (
        <div key={$id} className="p-4 my-2 rounded-md border-b leading-8">
          <h2 className="font-semibold">{term}</h2> <p>{interpretation}</p>
          <div className="flex gap-3 justify-end mt-4">
            <Link
              href={`/edit/${$id}`}
              className="rounded-md px-4 py-2 bg-gray-200 text-sm font-bold uppercase tracking-widest"
            >
              Edit
            </Link>
            <button
              className="rounded-md px-4 py-2 bg-red-500 text-white font-bold text-sm uppercase tracking-widest"
              onClick={() => handleDelete($id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
