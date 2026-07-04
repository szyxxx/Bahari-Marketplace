import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { KPICard } from "@/components/charts/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { isOnline, getCachedData, cacheData } from "@/lib/offline";

export function PredictiveStock() {
  const user = getStoredUser();
  const [stock, setStock] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const coopId = user?.cooperativeId; if (!coopId) { setLoading(false); return; }
      if (!isOnline()) { setLoading(false); return; }
      try {
        const [s, r] = await Promise.all([
          api.get(`/predictions/stock?cooperativeId=${coopId}`),
          api.get(`/predictions/harvest-risk?cooperativeId=${coopId}`),
        ]);
        setStock(s.data); setRisk(r.data);
        await cacheData("pred_stock", s); await cacheData("pred_risk", r);
      } catch {} finally { setLoading(false); }
    }
    fetch();
  }, []);

  if (loading) return <div className="grid gap-4 md:grid-cols-2">{[1,2].map(i=><Skeleton key={i} className="h-28 rounded-xl"/>)}</div>;

  const sevColors: Record<string, string> = { high: "destructive", medium: "warning", normal: "success" };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-['Outfit']">🌦️ Predictive Stock & Harvest AI</h2>

      {stock?.weatherSnapshot && (
        <div className="grid gap-4 md:grid-cols-3">
          <KPICard title="Suhu Rata-rata" value={`${stock.weatherSnapshot.avgTemp}°C`} trend="neutral" />
          <KPICard title="Hujan" value={stock.weatherSnapshot.hasRain ? "Ya" : "Tidak"} trend={stock.weatherSnapshot.hasRain ? "down" : "up"} />
          <KPICard title="Cuaca" value={stock.weatherSnapshot.hasRain ? "BASAH" : "CERAH"} trend="neutral" />
        </div>
      )}

      {stock?.recommendations?.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Rekomendasi Stok</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="py-2">Komoditas</th><th className="py-2">Kategori</th><th className="py-2">Stok Saat Ini</th><th className="py-2">Risiko Spoilage</th><th className="py-2">Rekomendasi</th>
                </tr></thead>
                <tbody>
                  {stock.recommendations.map((r: any, i: number) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 font-medium">{r.commodityName}</td>
                      <td className="py-2"><Badge variant="outline">{r.category}</Badge></td>
                      <td className="py-2">{r.currentStock} {r.unit}</td>
                      <td className="py-2"><Badge variant={sevColors[r.spoilageRisk] as any}>{r.spoilageRisk}</Badge></td>
                      <td className="py-2 text-xs">{r.recommendedAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {risk?.risks?.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader><CardTitle className="text-red-800">⚠️ Risiko Gagal Panen</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {risk.risks.map((r: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-md">
                <Badge variant={r.severity === "high" ? "destructive" : "warning"}>{r.severity.toUpperCase()}</Badge>
                <div>
                  <p className="font-medium text-sm">{r.commodity}</p>
                  <p className="text-xs text-muted-foreground">{r.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!stock && !risk && (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Prediksi stok dan risiko panen membutuhkan data cuaca. Data akan ditarik saat online.</CardContent></Card>
      )}
    </div>
  );
}
