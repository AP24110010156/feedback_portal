"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import AnimatedButton from "./AnimatedButton";
import { MessageSquare, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-violet-500/10 bg-[#1a1325]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-violet-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <MessageSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block text-violet-50">
            Feedback<span className="text-violet-400">Portal</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin">
                  <AnimatedButton variant="ghost" className="hidden sm:flex">
                    <LayoutDashboard size={18} />
                    Admin Panel
                  </AnimatedButton>
                </Link>
              )}
              <div className="text-sm text-violet-200 hidden md:block">
                Welcome, <span className="font-semibold text-violet-400">{session.user?.name}</span>
              </div>
              <AnimatedButton 
                variant="secondary" 
                onClick={() => signOut()}
                className="!px-4"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </AnimatedButton>
            </>
          ) : (
            <>
              <Link href="/login">
                <AnimatedButton variant="ghost">Login</AnimatedButton>
              </Link>
              <Link href="/register">
                <AnimatedButton>Sign Up</AnimatedButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
