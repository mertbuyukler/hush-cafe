import StationGrid from '@/components/StationGrid';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
      {/* Simple Header */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-100 tracking-tight">
          Hush Cafe
        </h1>
        <p className="mt-4 text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Curated lo-fi radio for focus, relaxation, and uninterrupted deep work.
        </p>
      </header>

      {/* Main Content Area */}
      <main>
        <StationGrid />
      </main>
    </div>
  );
}
