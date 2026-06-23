import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function EcoPointList() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoints() {
      try {
        const response = await api.get('/ecopoints');
        setTransactions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch eco points:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPoints();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-['Outfit'] text-green-700 dark:text-green-500">Eco Points</h2>
          <p className="text-muted-foreground text-sm">Reward berkelanjutan untuk nelayan dan petani pesisir.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">Berikan Points</Button>
      </div>

      <div className="bg-background rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead>Jenis Aktivitas</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Poin</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada riwayat transaksi Eco Points.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground text-sm">{new Date(t.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="font-medium">{t.producer?.name || 'Unknown'}</TableCell>
                  <TableCell className="capitalize">{t.source_type.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-xs">{t.description}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">+{t.points}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'approved' ? 'success' : 'secondary'}>
                      {t.status}
                    </Badge>
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
