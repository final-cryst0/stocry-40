
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNewsData } from "@/hooks/useNewsData";
import { NewsSearch } from "@/components/news/NewsSearch";
import { CategoryFilter } from "@/components/news/CategoryFilter";
import { NewsList } from "@/components/news/NewsList";
import { Card, CardContent } from "@/components/ui/card";

export default function News() {
  const { data: news, isLoading, error } = useNewsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    "Cryptocurrency",
    "Bitcoin",
    "Ethereum",
    "DeFi",
    "NFT",
    "Trading",
    "Technology",
    "Business",
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNews = news?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const hasSearchMatch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.source.toLowerCase().includes(searchLower) ||
      item.categories.some(cat => cat.toLowerCase().includes(searchLower));

    const hasCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat => 
        item.categories.some(itemCat => 
          itemCat.toLowerCase() === cat.toLowerCase()
        )
      );

    const tabFilter = activeTab === "all" || 
      (activeTab === "crypto" && item.categories.some(cat => cat === "Cryptocurrency")) ||
      (activeTab === "stocks" && item.categories.some(cat => cat === "Stocks"));

    return hasSearchMatch && hasCategory && tabFilter;
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

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

        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <NewsSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <div className="flex gap-2">
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All News</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {error ? (
                <Card>
                  <CardContent className="text-center py-6">
                    <p className="text-muted-foreground">Failed to load news. Please try again later.</p>
                  </CardContent>
                </Card>
              ) : (
                <NewsList
                  news={filteredNews}
                  isLoading={isLoading}
                  formatDate={formatDate}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
