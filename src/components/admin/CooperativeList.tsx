import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function CooperativeList() {
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCooperatives() {
      try {
        const response = await api.get('/cooperatives');
        setCooperatives(response.data || []);
      } catch (error) {
        console.error("Failed to fetch cooperatives:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCooperatives();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-['Outfit']">Manajemen Koperasi</h2>
          <p className="text-muted-foreground text-sm">Review dan kelola akses Koperasi Desa (Kopdes).</p>
        </div>
        <Button>Onboard Koperasi Baru</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Koperasi</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Legalitas</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                </TableRow>
              ))
            ) : cooperatives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Tidak ada data koperasi.
                </TableCell>
              </TableRow>
            ) : (
              cooperatives.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.region || '-'}</TableCell>
                  <TableCell className="text-xs font-mono">{c.legal_entity_number || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={c.verification_status === 'verified' ? 'success' : 'warning'}>
                      {c.verification_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Review</Button>
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
