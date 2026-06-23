import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-['Outfit']">Platform Overview</h2>
        <p className="text-muted-foreground mt-1">Metrik performa ekosistem BAHARI secara keseluruhan.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Koperasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-success mt-1">+2 bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total GMV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp 4.2M</div>
            <p className="text-xs text-success mt-1">+15% dari kuartal lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Eco Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">85K</div>
            <p className="text-xs text-muted-foreground mt-1">Disalurkan ke nelayan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48</div>
            <p className="text-xs text-success mt-1">+5 pembeli B2B baru</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Koperasi Terbaru</CardTitle>
          <CardDescription>Status onboarding koperasi di platform BAHARI</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Koperasi</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Tanggal Registrasi</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Kopdes Nelayan Sejahtera</TableCell>
                <TableCell>Maluku Utara</TableCell>
                <TableCell>23 Jun 2026</TableCell>
                <TableCell><Badge variant="warning">Pending Review</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Koperasi Rumput Laut Jaya</TableCell>
                <TableCell>Nusa Tenggara Timur</TableCell>
                <TableCell>20 Jun 2026</TableCell>
                <TableCell><Badge variant="success">Active</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
