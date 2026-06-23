import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProducerForm } from "./ProducerForm";

export function ProducerList() {
  const [producers, setProducers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchProducers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/producers');
      setProducers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch producers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  if (showForm) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowForm(false)} className="mb-4">
          &larr; Kembali
        </Button>
        <ProducerForm 
          onSuccess={() => { setShowForm(false); fetchProducers(); }} 
          onCancel={() => setShowForm(false)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-['Outfit']">Manajemen Produsen</h2>
          <p className="text-muted-foreground text-sm">Kelola data nelayan dan petani anggota koperasi.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Tambah Produsen</Button>
      </div>
      
      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border">
        <Input placeholder="Cari nama atau NIK..." className="max-w-xs" />
        <Button variant="outline">Filter</Button>
      </div>

      <div className="bg-background rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                </TableRow>
              ))
            ) : producers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Tidak ada data produsen.
                </TableCell>
              </TableRow>
            ) : (
              producers.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}<br/><span className="text-xs text-muted-foreground">{p.nik_number}</span></TableCell>
                  <TableCell className="capitalize">{p.producer_type.replace('_', ' ')}</TableCell>
                  <TableCell>{p.production_area_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={p.verification_status === 'verified' ? 'success' : 'secondary'}>
                      {p.verification_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Detail</Button>
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
