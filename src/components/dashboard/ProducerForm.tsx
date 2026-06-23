import * as React from "react";
import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";

export function ProducerForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const elements = e.currentTarget.elements as any;
    const payload = {
      user_id: elements.user_id.value || undefined, // Optional in MVP
      cooperative_id: elements.cooperative_id.value,
      name: elements.name.value,
      nik_number: elements.nik_number.value,
      phone_number: elements.phone_number.value,
      address: elements.address.value,
      producer_type: elements.producer_type.value,
      business_name: elements.business_name.value,
      production_area_name: elements.production_area_name.value,
    };

    try {
      await api.post("/producers", payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan produsen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Tambah Produsen Baru</CardTitle>
        <CardDescription>Daftarkan nelayan atau petani rumput laut ke dalam sistem koperasi.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-0">
          {error && <div className="text-destructive text-sm font-medium">{error}</div>}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input name="name" required placeholder="Sesuai KTP" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nomor NIK</label>
              <Input name="nik_number" required placeholder="16 digit NIK" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe Produsen</label>
              <Select name="producer_type" options={[
                { label: "Nelayan", value: "fisherman" },
                { label: "Petani Rumput Laut", value: "seaweed_farmer" },
                { label: "Petambak", value: "aquaculture_farmer" },
              ]} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">No. Telepon</label>
              <Input name="phone_number" placeholder="08..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Usaha / Kelompok (Opsional)</label>
            <Input name="business_name" placeholder="Misal: KUB Nelayan Jaya" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Area Produksi (Opsional)</label>
            <Input name="production_area_name" placeholder="Misal: Teluk Pesisir Selatan" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Alamat Lengkap</label>
            <Input name="address" required />
          </div>

          {/* Hidden field for MVP cooperative_id linking. In real app, derived from auth token. */}
          <input type="hidden" name="cooperative_id" value="1" />
        </CardContent>
        <CardFooter className="px-0 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Produsen"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
