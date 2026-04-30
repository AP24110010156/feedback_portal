"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedButton from "@/components/AnimatedButton";
import Link from "next/link";
import { User, Mail, Lock, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        <div className="absolute top-0 left-0 -mt-16 -ml-16 w-32 h-32 bg-violet-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 -mb-16 -mr-16 w-32 h-32 bg-fuchsia-600/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-2 text-violet-50">Create Account</h1>
          <p className="text-center text-violet-300 mb-8">Join the community to share ideas</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/50 flex items-center gap-2 text-rose-400">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-violet-200 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-violet-50"
                  placeholder="CoolUser123"
                  required
                />
              </div>
            </div>

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
              {loading ? "Creating..." : "Create Account"}
            </AnimatedButton>
          </form>

          <p className="text-center text-sm text-violet-300 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-4 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
