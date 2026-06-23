import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";

export function BatchForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [producers, setProducers] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [pRes, cRes] = await Promise.all([
          api.get('/producers'),
          api.get('/commodities')
        ]);
        setProducers(pRes.data || []);
        setCommodities(cRes.data || []);
      } catch (err) {
        console.error("Failed to load dropdowns", err);
      }
    }
    loadDropdowns();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const elements = e.currentTarget.elements as any;
    const payload = {
      producer_id: elements.producer_id.value,
      commodity_id: elements.commodity_id.value,
      cooperative_id: "1", // MVP hardcoded
      quantity: parseFloat(elements.quantity.value),
      unit: elements.unit.value,
      base_price_per_unit: elements.base_price_per_unit.value || undefined,
      harvest_date: elements.harvest_date.value,
      notes: elements.notes.value,
    };

    try {
      await api.post("/batches", payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Terima Batch Suplai</CardTitle>
        <CardDescription>Catat penerimaan komoditas dari produsen.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-0">
          {error && <div className="text-destructive text-sm font-medium">{error}</div>}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Produsen</label>
              <Select name="producer_id" required options={[
                { label: "Pilih Produsen...", value: "" },
                ...producers.map(p => ({ label: p.name, value: p.id }))
              ]} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Komoditas</label>
              <Select name="commodity_id" required options={[
                { label: "Pilih Komoditas...", value: "" },
                ...commodities.map(c => ({ label: c.name, value: c.id }))
              ]} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kuantitas</label>
              <Input name="quantity" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Satuan (Unit)</label>
              <Input name="unit" required placeholder="kg" defaultValue="kg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Panen/Tangkap</label>
              <Input name="harvest_date" type="date" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Dasar (Rp)</label>
              <Input name="base_price_per_unit" type="number" placeholder="Opsional" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Catatan / Lokasi Tangkapan</label>
            <Input name="notes" placeholder="Misal: Tangkapan pagi hari di perairan utara" />
          </div>

        </CardContent>
        <CardFooter className="px-0 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Batch"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
