"use client";

export default function Dashboard({ selectedClass }) {
  return (
    <div className="text-white p-10">
      <h1 className="text-3xl font-bold">
        Dashboard – Class {selectedClass}
      </h1>
    </div>
  );
}
