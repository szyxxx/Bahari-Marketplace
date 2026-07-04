import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { isOnline, getCachedData, cacheData } from "@/lib/offline";

export function DemandMapping() {
  const user = getStoredUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const coopId = user?.cooperativeId; if (!coopId) { setLoading(false); return; }
      const url = `/demand-map/coverage?cooperativeId=${coopId}`;
      if (!isOnline()) { const c = await getCachedData(url); if (c) setData(c.data); setLoading(false); return; }
      try { const r = await api.get(url); setData(r.data); await cacheData(url, r); } catch {} finally { setLoading(false); }
    }
    fetch();
  }, []);

  if (loading) return <Skeleton className="h-64 rounded-xl" />;
  if (!data) return <div className="py-8 text-center text-muted-foreground">Data outlet belum tersedia.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-['Outfit']">🗺️ Hyper-Local Demand Mapping</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Total Outlet</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{data.totalOutlets}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Kapasitas</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{data.totalCapacity} kg/hari</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Area Belum Terjangkau</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{data.uncoveredAreas}</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Distribusi Outlet</CardTitle></CardHeader>
        <CardContent>
          {Object.entries(data.byType || {}).map(([type, count]: any) => (
            <div key={type} className="flex justify-between py-2 border-b last:border-0">
              <span className="font-medium capitalize">{type}</span>
              <Badge variant="outline">{count} outlet</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Data outlet dapat diinput melalui form untuk pemetaan distribusi & demand coverage. Integrasi peta (Leaflet) tersedia di roadmap.
      </p>
    </div>
  );
}
