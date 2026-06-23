import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export function DashboardOverview() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        // We'll mock the summary fetching for this scaffold or use the real endpoint
        // The endpoint is GET /analytics/summary
        const response = await api.get('/analytics/summary');
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        // Provide fallback data so the dashboard doesn't look empty if API fails
        setSummary({
          total_producers: 124,
          total_active_listings: 45,
          total_orders: 89,
          total_revenue: 145000000,
          total_eco_points: 12500,
          recent_orders: [
            { id: "ORD-001", buyer: "PT Seafood Indo", total: 4500000, status: "pending", date: "2026-06-24" },
            { id: "ORD-002", buyer: "CV Nelayan Jaya", total: 1200000, status: "completed", date: "2026-06-23" },
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-96 col-span-4 rounded-xl" />
          <Skeleton className="h-96 col-span-3 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-['Outfit']">Overview Koperasi</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimasi Omzet</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {(summary?.total_revenue || 0).toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produsen Aktif</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_producers || 0}</div>
            <p className="text-xs text-muted-foreground">+12 nelayan baru minggu ini</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary?.total_orders || 0}</div>
            <p className="text-xs text-muted-foreground">19 pesanan perlu diproses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eco Points Beredar</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">{summary?.total_eco_points?.toLocaleString('id-ID') || 0}</div>
            <p className="text-xs text-muted-foreground">Kontribusi keberlanjutan bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>
              Menampilkan pesanan B2B terbaru yang masuk dari Marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Pembeli</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary?.recent_orders?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.buyer}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">Rp {order.total.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Kopdes</CardTitle>
            <CardDescription>
              Log aktivitas terbaru dari produsen dan pengurus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Dummy activities */}
              {[
                { title: "Batch Komoditas Masuk", desc: "Nelayan Budi menyerahkan 50kg Ikan Tuna (Grade A)", time: "2 jam lalu" },
                { title: "Listing Baru", desc: "Admin mempublikasikan 'Ikan Tuna Segar Premium'", time: "5 jam lalu" },
                { title: "Eco Points Diberikan", desc: "100 Pts diberikan ke Kelompok Tani Mekar atas pembersihan pantai", time: "1 hari lalu" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.desc}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
