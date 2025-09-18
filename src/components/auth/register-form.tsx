"use client";

import { useState } from "react";
import { Mail, Lock, User, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";

export function RegisterForm() {
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !pwd || !pwd2) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!email.includes("@")) {
      setError("Insira um email válido.");
      return;
    }
    if (pwd.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (pwd !== pwd2) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!terms) {
      setError("Você precisa aceitar os termos.");
      return;
    }

    setLoading(true);
    try {
      // TODO: integrar com API/Gateway (REST/GraphQL)
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess("Cadastro realizado! Verifique seu email para confirmar.");
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
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
      {success && (
        <div className="alert alert-success">
          <CheckCircle2 className="icon-sm mt-0.5" />
          <div>
            <p className="alert-title">Sucesso</p>
            <p className="alert-desc">{success}</p>
          </div>
        </div>
      )}

      {/* Nome */}
      <div className="field">
        <label htmlFor="name" className="form-label">Nome completo *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm" style={{ color: "var(--text-secondary)" }} />
          <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
        </div>
      </div>

      {/* Email */}
      <div className="field">
        <label htmlFor="email" className="form-label">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm" style={{ color: "var(--text-secondary)" }} />
          <Input id="email" type="email" placeholder="voce@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
        </div>
      </div>

      {/* Senha */}
      <div className="field">
        <label htmlFor="pwd" className="form-label">Senha *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm" style={{ color: "var(--text-secondary)" }} />
          <Input id="pwd" type={showPwd ? "text" : "password"} placeholder="Crie uma senha" value={pwd} onChange={(e) => setPwd(e.target.value)} className="pl-10 pr-10" required />
          <button type="button" className="input-icon-btn" onClick={() => setShowPwd((s) => !s)} aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}>
            {showPwd ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
          </button>
        </div>
      </div>

      {/* Confirmar Senha */}
      <div className="field">
        <label htmlFor="pwd2" className="form-label">Confirmar senha *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm" style={{ color: "var(--text-secondary)" }} />
          <Input id="pwd2" type={showPwd2 ? "text" : "password"} placeholder="Repita a senha" value={pwd2} onChange={(e) => setPwd2(e.target.value)} className="pl-10 pr-10" required />
          <button type="button" className="input-icon-btn" onClick={() => setShowPwd2((s) => !s)} aria-label={showPwd2 ? "Ocultar senha" : "Mostrar senha"}>
            {showPwd2 ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
          </button>
        </div>
      </div>

      {/* Termos */}
      <div className="flex items-center justify-between">
        <Checkbox id="terms" checked={terms} onChange={(e) => setTerms(e.currentTarget.checked)} label="Aceito os termos de uso" />
        <a href="/terms" className="text-sm font-medium hover:underline" style={{ color: "var(--color-apptit-blue)" }}>
          Ler termos
        </a>
      </div>

      <Button type="submit" variant="primary" className="w-full font-medium" disabled={loading}>
        {loading ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Já tem conta?{" "}
        <a href="/auth/login" className="font-medium hover:underline" style={{ color: "var(--color-apptit-blue)" }}>
          Entrar
        </a>
      </p>
    </form>
  );
}