import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    const role = (e.currentTarget.elements.namedItem('role') as HTMLSelectElement).value;

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }
      
      if (data.data?.token) {
        localStorage.setItem("bahari_token", data.data.token);
        localStorage.setItem("bahari_user", JSON.stringify(data.data.user));
        
        // Redirect based on role
        if (data.data.user.role === 'buyer') {
          window.location.href = '/marketplace';
        } else if (data.data.user.role === 'cooperative_admin') {
          window.location.href = '/dashboard';
        } else if (data.data.user.role === 'super_admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold font-['Outfit'] text-center">Buat Akun Baru</CardTitle>
        <CardDescription className="text-center">
          Bergabunglah dengan ekosistem BAHARI
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="name">Nama Lengkap</label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="nama@email.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="role">Peran Anda</label>
            <select id="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
              <option value="">Pilih Peran...</option>
              <option value="buyer">Pembeli B2B</option>
              <option value="cooperative_admin">Pengurus Koperasi Desa</option>
              <option value="producer">Produsen (Nelayan/Petani)</option>
            </select>
          </div>
          
          {error && (
            <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Mendaftar..." : "Daftar"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Sudah punya akun? <a href="/login" className="text-primary hover:underline font-medium">Masuk di sini</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
