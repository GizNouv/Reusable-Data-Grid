import { DataGridDemo } from "@/components/demo/DataGridDemo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 lg:p-8 p-4">
      <h1 className="text-2xl font-bold text-center mb-8">📊 Reusable Data Grid</h1>
      <DataGridDemo />
    </main>
  );
}