import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ListingForm } from "./ListingForm";

export function ListingList() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/listings');
      setListings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (showForm) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowForm(false)} className="mb-4">
          &larr; Kembali
        </Button>
        <ListingForm 
          onSuccess={() => { setShowForm(false); fetchListings(); }} 
          onCancel={() => setShowForm(false)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-['Outfit']">Marketplace Listings</h2>
          <p className="text-muted-foreground text-sm">Kelola produk yang dipublikasikan ke B2B Marketplace.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Buat Listing Baru</Button>
      </div>

      <div className="bg-background rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Harga / Unit</TableHead>
              <TableHead>Stok Tersedia</TableHead>
              <TableHead>Min. Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                </TableRow>
              ))
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada listing marketplace.
                </TableCell>
              </TableRow>
            ) : (
              listings.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium max-w-xs truncate">{l.title}</TableCell>
                  <TableCell>Rp {parseInt(l.price_per_unit).toLocaleString('id-ID')}</TableCell>
                  <TableCell>{l.available_stock} {l.unit}</TableCell>
                  <TableCell>{l.min_order_quantity} {l.unit}</TableCell>
                  <TableCell>
                    <Badge variant={l.status === 'active' ? 'success' : 'secondary'}>
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
