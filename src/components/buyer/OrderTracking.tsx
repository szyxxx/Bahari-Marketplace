import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export function OrderTracking({ id }: { id: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-12 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold">Pesanan Tidak Ditemukan</h2>
        <p className="text-muted-foreground mt-2">Pesanan mungkin tidak ada atau Anda tidak memiliki akses.</p>
      </div>
    );
  }

  const steps = [
    { key: "pending", label: "Menunggu Konfirmasi" },
    { key: "confirmed", label: "Pesanan Dikonfirmasi" },
    { key: "packed", label: "Pesanan Dikemas" },
    { key: "ready_for_pickup", label: "Siap Dikirim" },
    { key: "delivered", label: "Pesanan Diterima" },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.order_status) >= 0 
    ? steps.findIndex(s => s.key === order.order_status) 
    : 0;

  return (
    <div className="container py-12 max-w-4xl space-y-8">
      <nav className="text-sm text-muted-foreground flex items-center gap-2">
        <a href="/orders" className="hover:text-foreground">Riwayat Pesanan</a>
        <span>/</span>
        <span className="text-foreground font-medium font-mono">{order.order_code}</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-['Outfit']">Detail Pesanan</h1>
          <p className="text-muted-foreground mt-1">Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
        </div>
        <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'} className="text-sm">
          {order.payment_status === 'paid' ? 'LUNAS' : 'BELUM DIBAYAR'}
        </Badge>
      </div>

      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Status Pengiriman</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pt-4">
            <div className="absolute top-10 left-0 w-full h-1 bg-muted rounded-full"></div>
            <div 
              className="absolute top-10 left-0 h-1 bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${
                      isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                      )}
                    </div>
                    <span className={`text-xs mt-3 text-center max-w-[80px] font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Item Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display single item for MVP since API returns total. Need proper items array in full version. */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{order.listing?.title || 'Komoditas Laut B2B'}</h4>
                <p className="text-sm text-muted-foreground">Koperasi: {order.cooperative?.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{order.quantity || 0} Unit</span>
                  <span className="font-bold">Rp {parseInt(order.total_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold">Total Tagihan</span>
              <span className="text-xl font-bold text-primary">Rp {parseInt(order.total_amount).toLocaleString('id-ID')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Info Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h5 className="font-medium text-muted-foreground mb-1">Kurir / Logistik</h5>
              <p>BAHARI Logistics Partner</p>
            </div>
            <div>
              <h5 className="font-medium text-muted-foreground mb-1">Catatan Pesanan</h5>
              <p>{order.notes || '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
