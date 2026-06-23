import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/orders'); // Assuming buyer auth token gets their own orders
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="container py-12 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-['Outfit']">Riwayat Pesanan</h1>
        <p className="text-muted-foreground mt-2">Lacak status pesanan dan riwayat pembelian dari marketplace BAHARI.</p>
      </div>

      <div className="bg-background rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Koperasi</TableHead>
              <TableHead>Total Tagihan</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead>Status Pesanan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Anda belum memiliki riwayat pesanan. <br/>
                  <a href="/marketplace" className="text-primary hover:underline mt-2 inline-block">Mulai belanja di Marketplace</a>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs font-medium">{o.order_code}</TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{o.cooperative?.name || 'Unknown'}</TableCell>
                  <TableCell className="font-semibold">Rp {parseInt(o.total_amount).toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Badge variant={o.payment_status === 'paid' ? 'success' : 'warning'}>
                      {o.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      o.order_status === 'delivered' || o.order_status === 'completed' ? 'success' : 
                      o.order_status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                      {o.order_status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <a href={`/orders/${o.id}`}>
                      <Button variant="outline" size="sm">Lacak</Button>
                    </a>
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
