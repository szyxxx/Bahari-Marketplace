import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";

export function ListingForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    async function loadBatches() {
      try {
        const response = await api.get('/batches');
        setBatches(response.data || []);
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    }
    loadBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const elements = e.currentTarget.elements as any;
    const batchId = elements.batch_id.value;
    const selectedBatch = batches.find(b => b.id === batchId);

    if (!selectedBatch) {
      setError("Silakan pilih batch valid.");
      setLoading(false);
      return;
    }

    const payload = {
      batch_id: batchId,
      commodity_id: selectedBatch.commodity_id,
      cooperative_id: "1", // MVP hardcoded
      title: elements.title.value,
      description: elements.description.value,
      price_per_unit: parseFloat(elements.price_per_unit.value),
      unit: selectedBatch.unit,
      available_stock: parseFloat(elements.available_stock.value),
      min_order_quantity: parseFloat(elements.min_order_quantity.value),
    };

    try {
      await api.post("/listings", payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal membuat listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Buat Listing Marketplace Baru</CardTitle>
        <CardDescription>Pilih batch yang telah diverifikasi untuk dipublikasikan ke B2B Marketplace.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-0">
          {error && <div className="text-destructive text-sm font-medium">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sumber Batch</label>
            <Select name="batch_id" required options={[
              { label: "Pilih Batch...", value: "" },
              ...batches.map(b => ({ 
                label: `${b.batch_code} - ${b.commodity?.name} (${b.quantity} ${b.unit})`, 
                value: b.id 
              }))
            ]} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Judul Produk</label>
            <Input name="title" required placeholder="Misal: Ikan Tuna Grade A Segar" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Lengkap</label>
            <textarea 
              name="description" 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              required
            ></textarea>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga / Unit (Rp)</label>
              <Input name="price_per_unit" type="number" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stok Dijual</label>
              <Input name="available_stock" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimal Order</label>
              <Input name="min_order_quantity" type="number" step="0.01" required />
            </div>
          </div>

        </CardContent>
        <CardFooter className="px-0 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Publish Listing"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
