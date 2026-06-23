import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed");
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
        <CardTitle className="text-2xl font-bold font-['Outfit'] text-center">Selamat Datang Kembali</CardTitle>
        <CardDescription className="text-center">
          Masukkan email dan password untuk masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="nama@email.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Password</label>
              <a href="#" className="text-sm text-primary hover:underline">Lupa password?</a>
            </div>
            <Input id="password" type="password" required />
          </div>
          
          {error && (
            <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Belum punya akun? <a href="/register" className="text-primary hover:underline font-medium">Daftar sekarang</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
