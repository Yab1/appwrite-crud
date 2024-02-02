"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IInterpretations {
  $id: string;
  term: string;
  interpretation: string;
}

export default function EditPage({ params }: { params: { id: string } }) {
  const [interpretations, setInterpretations] = useState<IInterpretations>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInterpretation = async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/interpretations/${id}`);
        if (!response.ok) throw new Error("Failed to fetch Interpretation");
        const data = await response.json();
        setInterpretations(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterpretation(params.id);
  }, [params.id]);

  const handleTermChange = (term: string) => {
    setInterpretations((prevState) => {
      if (prevState) return { ...prevState, term };
    });
  };
  const handleInterpretationChange = (interpretation: string) => {
    setInterpretations((prevState) => {
      if (prevState) return { ...prevState, interpretation };
    });
  };

  const handleSubmit = async () => {
    if (!interpretations) return;

    setIsLoading(true);
    setError(null);

    try {
      const { $id, term, interpretation } = interpretations;

      if (!$id || !term || !interpretation)
        throw new Error("Invalid Interpretation data");

      const data = { term, interpretation };

      await updateInterpretation($id, data);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }

    async function updateInterpretation(
      id: string,
      data: { term: string; interpretation: string }
    ) {
      try {
        const response = await fetch(`/api/interpretations/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update interpetation");
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Edit Interpretation</h2>
      {error && (
        <p className="border bg-red-300 text-red-600 px-5 py-3">{error}</p>
      )}
      {isLoading && <p>Loading Interpretations ...</p>}
      <form className="flex flex-col gap-3">
        <input
          type="text"
          name="term"
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
          value={interpretations?.term}
          onChange={(e) => handleTermChange(e.target.value)}
        />

        <textarea
          name="interpretation"
          rows={10}
          placeholder="Interpretation"
          className="py-1 px-4 border rounded-md resize-none"
          value={interpretations?.interpretation}
          onChange={(e) => handleInterpretationChange(e.target.value)}
        ></textarea>

        <button
          className="text-white bg-black mt-5 px-4 py-1 rounded-md cursor-pointer"
          onClick={handleSubmit}
        >
          Update Interpretation
        </button>
      </form>
    </div>
  );
}
