"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedButton from "@/components/AnimatedButton";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // Fetch updated session to get role
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;
      router.push(role === "admin" ? "/admin" : "/");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-[#1a1325] border border-violet-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-violet-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-fuchsia-600/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-2 text-violet-50">Welcome Back</h1>
          <p className="text-center text-violet-300 mb-8">Sign in to vote and submit feedback</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/50 flex items-center gap-2 text-rose-400">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-violet-200 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-violet-50"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-violet-200 mb-1">Password</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-400">
                   <Lock size={18} />
                 </div>
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-10 pr-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-violet-50"
                   placeholder="••••••••"
                   required
                 />
               </div>
            </div>

            <AnimatedButton type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </AnimatedButton>
          </form>

          <p className="text-center text-sm text-violet-300 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-4 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
