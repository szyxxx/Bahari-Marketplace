import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { KPICard } from "@/components/charts/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { isOnline, getCachedData, cacheData } from "@/lib/offline";

export function PriceArbitrageRadar() {
  const user = getStoredUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    async function fetch() {
      const coopId = user?.cooperativeId; if (!coopId) { setLoading(false); return; }
      const url = `/price-radar/alerts?cooperativeId=${coopId}`;
      if (!isOnline()) { const c = await getCachedData(url); if (c) { setData(c.data); setOffline(true); } setLoading(false); return; }
      try { const r = await api.get(url); setData(r.data); await cacheData(url, r); } catch { setOffline(true); } finally { setLoading(false); }
    }
    fetch();
  }, []);

  if (loading) return <div className="grid gap-4 md:grid-cols-3">{[1,2,3].map(i=><Skeleton key={i} className="h-28 rounded-xl"/>)}</div>;
  if (!data?.alerts?.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold font-['Outfit']">📡 Price Arbitrage Radar</h2>
        <Card><CardContent className="py-8 text-center text-muted-foreground">Belum ada data harga eksternal. Data benchmark harga nasional akan ditarik saat API tersedia.</CardContent></Card>
      </div>
    );
  }

  const sevColors: Record<string, string> = { high: "bg-green-100 text-green-800", medium: "bg-yellow-100 text-yellow-800", low: "bg-gray-100 text-gray-600" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-['Outfit']">📡 Price Arbitrage Radar</h2>
          <p className="text-muted-foreground text-sm">Bandingkan harga koperasi vs harga pasar nasional (Bapanas)</p>
        </div>
        {offline && <Badge variant="warning">Offline</Badge>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard title="Total Alert" value={data.totalAlerts} trend="neutral" />
        <KPICard title="Peluang Tinggi" value={data.highCount} trend="up" description={`${data.highCount > 0 ? 'Ada peluang arbitrase' : 'Belum ada peluang signifikan'}`} />
        <KPICard title="Status" value={data.highCount > 0 ? "ADA PELUANG" : "NORMAL"} trend={data.highCount > 0 ? "up" : "neutral"} />
      </div>

      <Card>
        <CardHeader><CardTitle>Alert Arbitrase</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Komoditas</th><th className="py-2">Harga Lokal</th><th className="py-2">Harga Nasional</th><th className="py-2">Gap</th><th className="py-2">Arah</th><th className="py-2">Severity</th>
                </tr>
              </thead>
              <tbody>
                {data.alerts.map((a: any, i: number) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 font-medium">{a.commodityName}</td>
                    <td className="py-2">Rp {a.localPrice.toLocaleString("id-ID")}</td>
                    <td className="py-2">Rp {a.benchmarkPrice.toLocaleString("id-ID")}</td>
                    <td className={`py-2 font-semibold ${a.priceGap > 0 ? "text-green-600" : "text-red-600"}`}>
                      {a.priceGap > 0 ? "+" : ""}Rp {a.priceGap.toLocaleString("id-ID")} ({(a.priceGapPct*100).toFixed(1)}%)
                    </td>
                    <td className="py-2">
                      <Badge variant={a.direction === "jual_keluar" ? "success" : a.direction === "beli_dari_luar" ? "destructive" : "outline"}>
                        {a.direction === "jual_keluar" ? "Jual Keluar" : a.direction === "beli_dari_luar" ? "Beli dari Luar" : "Normal"}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${sevColors[a.severity]}`}>
                        {a.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
