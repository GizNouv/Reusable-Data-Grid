import { DataGridDemo } from "@/components/demo/DataGridDemo";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 lg:p-8 p-4">
      <h1 className="text-2xl font-bold text-center mb-8">📊 Reusable Data Grid</h1>
      <Suspense fallback={'Loading...'}>
        <DataGridDemo />
      </Suspense>
    </main>
  );
}