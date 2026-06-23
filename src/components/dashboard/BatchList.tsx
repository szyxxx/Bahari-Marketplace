import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { BatchForm } from "./BatchForm";

export function BatchList() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await api.get('/batches');
      setBatches(response.data || []);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  if (showForm) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowForm(false)} className="mb-4">
          &larr; Kembali
        </Button>
        <BatchForm 
          onSuccess={() => { setShowForm(false); fetchBatches(); }} 
          onCancel={() => setShowForm(false)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-['Outfit']">Manajemen Batch</h2>
          <p className="text-muted-foreground text-sm">Lacak suplai masuk, verifikasi kualitas, dan inventory.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Terima Batch Baru</Button>
      </div>

      <div className="bg-background rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Batch</TableHead>
              <TableHead>Produsen</TableHead>
              <TableHead>Komoditas</TableHead>
              <TableHead>Kuantitas</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                </TableRow>
              ))
            ) : batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Tidak ada data batch.
                </TableCell>
              </TableRow>
            ) : (
              batches.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.batch_code}</TableCell>
                  <TableCell>{b.producer?.name || 'Unknown'}</TableCell>
                  <TableCell>{b.commodity?.name || 'Unknown'}</TableCell>
                  <TableCell>{b.quantity} {b.unit}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{b.quality_grade || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      b.quality_status === 'verified' ? 'success' : 
                      b.quality_status === 'rejected' ? 'destructive' : 'warning'
                    }>
                      {b.quality_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Review</Button>
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
