
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function News() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Market News</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with the latest market news and trends
          </p>
        </header>

        <div className="grid gap-6">
          {/* Placeholder for news items */}
          <div className="p-6 rounded-lg border bg-card">
            <p className="text-muted-foreground text-sm">Coming soon...</p>
            <h3 className="text-xl font-semibold mt-2">
              News section is under development
            </h3>
            <p className="mt-2 text-muted-foreground">
              We're working on bringing you the latest market news and updates.
              Check back soon!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
