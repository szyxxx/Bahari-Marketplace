import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";

export function MarketplaceView() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await api.get('/listings?status=active');
        setListings(response.data || []);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase()) || 
    (l.cooperative?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div className="w-full md:w-1/3">
          <label className="text-sm font-medium mb-1.5 block">Cari Produk</label>
          <Input 
            placeholder="Cari rumput laut, ikan tuna..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/4">
          <label className="text-sm font-medium mb-1.5 block">Kategori</label>
          <Select options={[
            { label: "Semua Kategori", value: "" },
            { label: "Rumput Laut", value: "seaweed" },
            { label: "Ikan Tangkap", value: "fish" }
          ]} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p>Tidak ada produk yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 bg-muted relative overflow-hidden">
                {/* Fallback image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-primary/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    {listing.available_stock} {listing.unit}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {listing.cooperative?.name || 'Koperasi Pesisir'}
                </div>
                <h3 className="font-semibold leading-tight line-clamp-2">{listing.title}</h3>
                <div className="pt-2 flex items-baseline gap-1 text-primary">
                  <span className="text-sm font-medium">Rp</span>
                  <span className="text-xl font-bold">{parseInt(listing.price_per_unit).toLocaleString('id-ID')}</span>
                  <span className="text-xs text-muted-foreground">/{listing.unit}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <a href={`/marketplace/${listing.id}`} className="w-full">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Lihat Detail
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
