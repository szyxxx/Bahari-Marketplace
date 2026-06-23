import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";

export function ListingDetail({ id }: { id: string }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState<number>(1);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  const handleOrder = async () => {
    if (!listing) return;
    setOrdering(true);
    try {
      const payload = {
        listing_id: listing.id,
        cooperative_id: listing.cooperative_id,
        buyer_id: "1", // MVP hardcoded for now, real app uses token
        quantity: qty,
        unit: listing.unit,
        total_amount: qty * parseInt(listing.price_per_unit),
      };
      await api.post('/orders', payload);
      window.location.href = '/orders'; // Redirect to buyer orders page
    } catch (error: any) {
      alert("Gagal membuat pesanan: " + (error.message || "Unknown error"));
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 grid md:grid-cols-2 gap-8">
        <Skeleton className="h-96 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold">Produk Tidak Ditemukan</h2>
        <p className="text-muted-foreground mt-2">Listing mungkin sudah dihapus atau tidak aktif.</p>
      </div>
    );
  }

  const price = parseInt(listing.price_per_unit);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <a href="/" className="hover:text-foreground">Home</a>
        <span>/</span>
        <a href="/marketplace" className="hover:text-foreground">Marketplace</a>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">{listing.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image Gallery Placeholder */}
        <div className="bg-muted rounded-xl h-[400px] flex items-center justify-center border relative overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <div className="absolute top-4 left-4">
            <Badge variant="success" className="text-sm font-medium">Terverifikasi Kopdes</Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-['Outfit']">{listing.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {listing.cooperative?.name || 'Koperasi Pesisir'}
              </span>
              <Badge variant="outline">Grade {listing.quality_grade || 'A'}</Badge>
            </div>
          </div>

          <div className="text-3xl font-bold text-primary flex items-baseline gap-2">
            Rp {price.toLocaleString('id-ID')}
            <span className="text-base font-normal text-muted-foreground">/ {listing.unit}</span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {listing.description || 'Komoditas pesisir berkualitas tinggi yang dikurasi langsung oleh Koperasi Desa, menjamin kesegaran dan harga yang adil bagi produsen lokal.'}
          </p>

          <Card className="bg-muted/30 border-primary/10 shadow-none">
            <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Stok Tersedia</span>
                <span className="font-semibold text-lg">{listing.available_stock} {listing.unit}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Minimal Order</span>
                <span className="font-semibold text-lg">{listing.min_order_quantity} {listing.unit}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-end gap-4">
              <div className="w-1/3 space-y-2">
                <label className="text-sm font-medium">Jumlah ({listing.unit})</label>
                <Input 
                  type="number" 
                  min={listing.min_order_quantity} 
                  max={listing.available_stock} 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </div>
              <Button size="lg" className="flex-1 text-base" onClick={handleOrder} disabled={ordering}>
                {ordering ? "Memproses..." : "Pesan Sekarang"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Pembayaran diproses secara aman melalui platform BAHARI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
