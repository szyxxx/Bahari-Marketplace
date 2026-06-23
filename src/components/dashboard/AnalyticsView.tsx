import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";

export function AnalyticsView() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Laporan</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-['Outfit']">Analytics & Laporan</h2>
          <p className="text-muted-foreground text-sm">Pantau performa penjualan, suplai, dan metrik keberlanjutan.</p>
        </div>
        <div className="w-48">
          <Select options={[
            { label: "Bulan Ini", value: "this_month" },
            { label: "Kuartal Ini", value: "this_quarter" },
            { label: "Tahun Ini", value: "this_year" },
          ]} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend Penjualan (Omzet)</CardTitle>
            <CardDescription>Pendapatan dari pesanan B2B dalam 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center border-t bg-muted/10">
            {/* Chart Placeholder */}
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              <span>[Bar Chart: Penjualan]</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Suplai Komoditas</CardTitle>
            <CardDescription>Distribusi komoditas yang disuplai oleh nelayan</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center border-t bg-muted/10">
            {/* Chart Placeholder */}
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              <span>[Pie Chart: Komoditas]</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Distribusi Eco Points & Aktivitas Keberlanjutan</CardTitle>
            <CardDescription>Poin yang dibagikan kepada produsen berdasarkan jenis aktivitas ramah lingkungan</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t bg-muted/10">
            {/* Chart Placeholder */}
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>[Line Chart: Trend Eco Points]</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
