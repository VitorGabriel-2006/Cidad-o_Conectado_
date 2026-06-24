"use client";

import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { Lock, UserPlus, LogIn, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isEmailVerified, userAccount, setIsEmailVerified } = useProfileStore();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <Lock className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3 tracking-tight">
            {authMode === 'register' ? "Criar Nova Conta" : "Acessar Minha Conta"}
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            {authMode === 'register' 
              ? "Funcionalidades como salvar seu progresso e guardar documentos são exclusivas para usuários cadastrados." 
              : "Digite seus dados para acessar suas metas e documentos particulares."}
          </p>

          <div className="w-full space-y-4">
            {authMode === 'register' ? (
              <form 
                className="space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (name && email && passwordInput) {
                    try {
                      const userCredential = await createUserWithEmailAndPassword(auth, email, passwordInput);
                      await updateProfile(userCredential.user, { displayName: name });
                      
                      if (auth.currentUser) {
                        await sendEmailVerification(auth.currentUser);
                        toast.success("E-mail de verificação enviado! Verifique a sua caixa de entrada.");
                      }
                      
                      setError("");
                      router.push("/");
                    } catch (err: any) {
                      if (err.code === 'auth/email-already-in-use') {
                        toast.error("Este e-mail já está em uso.");
                      } else if (err.code === 'auth/weak-password') {
                        toast.error("Sua senha é muito fraca.");
                      } else {
                        setError(err.message || "Erro ao criar conta.");
                      }
                    }
                  }
                }}
              >
                <Input 
                  placeholder="Nome completo" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input 
                  type="email" 
                  placeholder="E-mail" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input 
                  type="password" 
                  placeholder="Crie uma senha" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full gap-2 rounded-xl h-11">
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </Button>
                {error && <p className="text-sm text-destructive text-center mt-2">{error}</p>}
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-xs mt-2" 
                  onClick={() => {
                    setAuthMode('login');
                    setError("");
                  }}
                >
                  Já tem uma conta? <span className="font-semibold underline ml-1">Faça login aqui</span>
                </Button>
              </form>
            ) : (
              <form 
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (email && passwordInput) {
                    try {
                      await signInWithEmailAndPassword(auth, email, passwordInput);
                      setError("");
                      router.push("/");
                    } catch (err: any) {
                      if (err.code === 'auth/invalid-credential') {
                        toast.error("E-mail ou senha incorretos.");
                      } else if (err.code === 'auth/too-many-requests') {
                        toast.error("Muitas tentativas falhas. Tente novamente mais tarde.");
                      } else {
                        setError(err.message || "Erro ao fazer login.");
                      }
                    }
                  }
                }}
              >
                <div className="space-y-3">
                  <Input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                  />
                  <Input 
                    type="password" 
                    placeholder="Senha" 
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setError("");
                    }}
                    required
                  />
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </div>
                <Button type="submit" className="w-full h-11" disabled={!email || !passwordInput}>
                  <LogIn className="w-4 h-4 mr-2" /> Entrar
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-xs mt-2" 
                  onClick={() => {
                    setAuthMode('register');
                    setError("");
                  }}
                >
                  Não tem uma conta? <span className="font-semibold underline ml-1">Cadastre-se aqui</span>
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated && !isEmailVerified && userAccount?.role !== 'admin') {
    return (
      <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mb-6 ring-1 ring-yellow-500/20">
            <Mail className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3 tracking-tight">
            Verifique seu E-mail
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Para garantir a segurança da sua conta, enviamos um link de confirmação para <span className="font-semibold text-foreground">{userAccount?.email}</span>. Acesse sua caixa de entrada e clique no link para liberar seu acesso.
          </p>

          <div className="w-full space-y-4">
            <Button 
              onClick={async () => {
                if (auth.currentUser) {
                  try {
                    await sendEmailVerification(auth.currentUser);
                    toast.success("E-mail reenviado com sucesso!");
                  } catch (e: any) {
                    if (e.code === 'auth/too-many-requests') {
                      toast.error("Muitos e-mails enviados. Aguarde um momento.");
                    } else {
                      toast.error("Erro ao enviar e-mail.");
                    }
                  }
                }
              }}
              variant="outline" 
              className="w-full h-11"
            >
              <Mail className="w-4 h-4 mr-2" /> Reenviar E-mail
            </Button>

            <Button 
              onClick={async () => {
                if (auth.currentUser) {
                  await auth.currentUser.reload();
                  if (auth.currentUser.emailVerified) {
                    setIsEmailVerified(true);
                    toast.success("E-mail verificado com sucesso! Bem-vindo(a)!");
                  } else {
                    toast.error("E-mail ainda não verificado. Atualize sua caixa de entrada.");
                  }
                }
              }}
              className="w-full h-11"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Já verifiquei o meu e-mail
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
