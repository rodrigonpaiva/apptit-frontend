"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!email) {
      setError("Informe seu email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Insira um email válido.");
      return;
    }

    setLoading(true);
    try {
      // TODO: integrar com endpoint de recuperação
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
    } catch {
      setError("Não foi possível enviar o link. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-fade-in">
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="icon-sm mt-0.5" />
          <div>
            <p className="alert-title">Erro</p>
            <p className="alert-desc">{error}</p>
          </div>
        </div>
      )}
      {sent && (
        <div className="alert alert-success">
          <CheckCircle2 className="icon-sm mt-0.5" />
          <div>
            <p className="alert-title">Email enviado</p>
            <p className="alert-desc">Se o email existir, enviamos um link de redefinição.</p>
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="email" className="form-label">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm" style={{ color: "var(--text-secondary)" }} />
          <Input id="email" type="email" placeholder="voce@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full font-medium" disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de redefinição"}
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Lembrou a senha?{" "}
        <a href="/auth/login" className="font-medium hover:underline" style={{ color: "var(--color-apptit-blue)" }}>
          Voltar ao login
        </a>
      </p>
    </form>
  );
}