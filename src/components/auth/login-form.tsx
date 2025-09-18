"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Por favor, insira um email válido.");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((r) => setTimeout(r, 1200)); // simulação
      alert("Login realizado com sucesso!");
    } catch {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="icon-sm mt-0.5" />
          <div>
            <div className="alert-title">Erro</div>
            <div className="alert-desc">{error}</div>
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="email" className="form-label">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm" style={{ color: "var(--text-secondary)" }} />
          <Input id="email" type="email" placeholder="votre-email@email.com"
                 value={email} onChange={(e) => setEmail(e.target.value)}
                 className="pl-10" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="password" className="form-label">Senha *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm" style={{ color: "var(--text-secondary)" }} />
          <Input id="password" type={showPassword ? "text" : "password"} placeholder="Entrez votre mot de passe"
                 value={password} onChange={(e) => setPassword(e.target.value)}
                 className="pl-10 pr-10" required />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="input-icon-btn"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
            {showPassword ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Checkbox id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.currentTarget.checked)} label="Se souvenir de moi" />
        <a href="/forgot-password" className="text-sm font-medium hover:underline" style={{ color: "var(--color-apptit-blue)" }}>
          Mot de passe oublié ?
        </a>
      </div>

      <Button type="submit" variant="primary" className="w-full font-medium" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Se connecte"}
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
         Vous n'avez pas encore de compte ?{" "}
        <a href="/register" className="font-medium hover:underline" style={{ color: "var(--color-apptit-blue)" }}>
          Demander l'accès
        </a>
      </p>
    </form>
  );
}