import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { KPICard } from "@/components/charts/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { isOnline, getCachedData, cacheData } from "@/lib/offline";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function CoopHealthIndex() {
  const user = getStoredUser();
  const [data, setData] = useState<any>(null);
  const [benchmark, setBenchmark] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    async function fetch() {
      const coopId = user?.cooperativeId; if (!coopId) { setLoading(false); return; }
      if (!isOnline()) { const c = await getCachedData("health_score"); if (c) { setData(c.data); setOffline(true); } setLoading(false); return; }
      try {
        const [score, bench] = await Promise.all([
          api.get(`/health-index/score?cooperativeId=${coopId}`),
          api.get(`/health-index/benchmark?cooperativeId=${coopId}`),
        ]);
        setData(score.data); setBenchmark(bench.data.benchmark || []);
        await cacheData("health_score", score);
      } catch {} finally { setLoading(false); }
    }
    fetch();
  }, []);

  if (loading) return <div className="grid gap-4 md:grid-cols-3">{[1,2,3].map(i=><Skeleton key={i} className="h-28 rounded-xl"/>)}</div>;
  if (!data) return <div className="py-8 text-center text-muted-foreground">Data kesehatan koperasi belum tersedia.</div>;

  const statusColors: Record<string, "success" | "warning" | "destructive"> = { sehat: "success", perlu_perhatian: "warning", kritis: "destructive" };
  const statusLabels: Record<string, string> = { sehat: "SEHAT", perlu_perhatian: "PERLU PERHATIAN", kritis: "KRITIS" };

  const ratioData = [
    { name: "Likuiditas", value: data.ratios.liquidity * 100, ideal: data.benchmarks.liquidity.ideal * 100 },
    { name: "Solvabilitas", value: data.ratios.solvability * 100, ideal: data.benchmarks.solvability.ideal * 100 },
    { name: "Profitabilitas", value: data.ratios.profitability * 100, ideal: data.benchmarks.profitability.ideal * 100 },
    { name: "Partisipasi", value: data.ratios.activity * 100, ideal: data.benchmarks.activity.ideal * 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-['Outfit']">🏥 Cooperative Health Index</h2>
          <p className="text-muted-foreground text-sm">Skor kesehatan berdasarkan standar Kemenkop UKM</p>
        </div>
        {offline && <Badge variant="warning">Offline</Badge>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="text-center p-6">
          <CardTitle className="text-sm text-muted-foreground mb-2">Overall Score</CardTitle>
          <div className="text-5xl font-bold font-['Outfit'] text-primary">{data.overallScore}</div>
          <p className="text-sm text-muted-foreground mt-1">/ 100</p>
          <Badge variant={statusColors[data.status] || "secondary"} className="text-lg mt-3 px-4 py-1">
            {statusLabels[data.status] || data.status.toUpperCase()}
          </Badge>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Rasio Keuangan</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratioData} layout="vertical">
                <XAxis type="number" tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" width={90} />
                <Tooltip />
                <Bar dataKey="value" fill="#0a4595" radius={[0,4,4,0]} name="Aktual" />
                <Bar dataKey="ideal" fill="#22c55e33" radius={[0,4,4,0]} name="Ideal" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Benchmarking table */}
      {benchmark.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Benchmarking per Koperasi</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="py-2">Koperasi</th><th className="py-2">Wilayah</th><th className="py-2">Skor</th><th className="py-2">Status</th>
                </tr></thead>
                <tbody>
                  {benchmark.map((b: any, i: number) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 font-medium">{b.cooperativeName}</td>
                      <td className="py-2">{b.region}</td>
                      <td className="py-2 font-semibold">{b.overallScore}</td>
                      <td className="py-2"><Badge variant={statusColors[b.status] || "outline"}>{statusLabels[b.status] || b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
