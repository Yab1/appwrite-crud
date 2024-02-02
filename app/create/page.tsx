"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface IInterpretations {
  term: string;
  interpretation: string;
}

export default function CreatePage() {
  const [interpretations, setInterpretations] = useState<IInterpretations>({
    term: "",
    interpretation: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTermChange = (term: string) => {
    setInterpretations((prevState) => ({ ...prevState, term }));
  };

  const handleInterpretationChange = (interpretation: string) => {
    setInterpretations((prevState) => ({ ...prevState, interpretation }));
  };

  const handleSubmit = async () => {
    if (!interpretations.term || !interpretations.interpretation) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/interpretations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interpretations),
      });

      if (!response.ok) throw new Error("Faild to create Interetation");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
      {error && (
        <p className="border bg-red-300 text-red-600 px-5 py-3">{error}</p>
      )}
      {isLoading && <p>Loading Interpretations ...</p>}
      <form className="flex flex-col gap-3">
        <input
          required
          type="text"
          name="term"
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
          value={interpretations.term}
          onChange={(e) => handleTermChange(e.target.value)}
        />

        <textarea
          required
          name="interpretation"
          rows={10}
          placeholder="Interpretation"
          className="py-1 px-4 border rounded-md resize-none"
          value={interpretations.interpretation}
          onChange={(e) => handleInterpretationChange(e.target.value)}
        ></textarea>

        <button
          className="text-white bg-black mt-5 px-4 py-1 rounded-md cursor-pointer"
          onClick={handleSubmit}
        >
          Add Interpretation
        </button>
      </form>
    </div>
  );
}
