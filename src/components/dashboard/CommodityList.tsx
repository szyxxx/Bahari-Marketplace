import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function CommodityList() {
  const [commodities, setCommodities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommodities() {
      try {
        const response = await api.get('/commodities');
        setCommodities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch commodities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCommodities();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-['Outfit']">Katalog Komoditas</h2>
          <p className="text-muted-foreground text-sm">Daftar referensi komoditas yang didukung oleh platform.</p>
        </div>
      </div>

      <div className="bg-background rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Komoditas</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Karakteristik</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                </TableRow>
              ))
            ) : commodities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Tidak ada data komoditas.
                </TableCell>
              </TableRow>
            ) : (
              commodities.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="capitalize">{c.category.replace('_', ' ')}</TableCell>
                  <TableCell>{c.standard_unit}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    Perishable: {c.is_perishable ? 'Ya' : 'Tidak'} | Storage: {c.storage_type}
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
