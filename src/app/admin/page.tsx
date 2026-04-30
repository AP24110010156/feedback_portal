"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2, Settings2, RefreshCw, MessageSquare,
  Lightbulb, Star, Flame, TrendingUp, CheckCircle2, Activity, Clock
} from "lucide-react";

type RequestType = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: string[];
  createdBy: { _id: string; username: string; email: string };
};

type FeedbackType = {
  _id: string;
  product: string;
  message: string;
  rating: number;
  createdBy: { _id: string; username: string; email: string };
  createdAt: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"requests" | "feedback">("requests");

  const [requests, setRequests] = useState<RequestType[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      Promise.all([
        fetch("/api/feedback").then(r => r.json()),
        fetch("/api/product-feedback").then(r => r.json()),
      ]).then(([reqs, fbs]) => {
        // Sort by votes descending for admin priority view
        const sorted = [...reqs].sort((a: RequestType, b: RequestType) => b.votes.length - a.votes.length);
        setRequests(sorted);
        setFeedbacks(fbs);
      }).finally(() => setLoading(false));
    }
  }, [status, session]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setRequests(cur => cur.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } finally { setUpdating(null); }
  };

  const getVoteBadge = (count: number) => {
    if (count >= 20) return { label: "Hot", icon: <Flame size={11} />, cls: "bg-amber-500/15 text-amber-400" };
    if (count >= 5) return { label: "Trending", icon: <TrendingUp size={11} />, cls: "bg-violet-500/15 text-violet-300" };
    return null;
  };

  const getStatusStyle = (s: string) => {
    if (s === "implemented") return "bg-emerald-500/10 text-emerald-400";
    if (s === "under review") return "bg-amber-500/10 text-amber-400";
    return "bg-violet-500/10 text-violet-400";
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-violet-500" size={48} />
      </div>
    );
  }

  const topRequest = requests[0];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-600/20 p-3 rounded-xl">
          <Settings2 className="text-violet-400" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-violet-50">Admin Dashboard</h1>
          <p className="text-violet-300 text-sm">Feature requests are sorted by votes — most popular first.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total Requests", value: requests.length, color: "text-violet-300" },
          { label: "Pending", value: requests.filter(r => r.status === "pending").length, color: "text-violet-400" },
          { label: "Under Review", value: requests.filter(r => r.status === "under review").length, color: "text-amber-400" },
          { label: "Implemented", value: requests.filter(r => r.status === "implemented").length, color: "text-emerald-400" },
          { label: "Total Feedback", value: feedbacks.length, color: "text-violet-300" },
        ].map(stat => (
          <div key={stat.label} className="bg-[#1a1325] border border-violet-500/20 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-violet-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top Priority Banner */}
      {topRequest && topRequest.votes.length > 0 && (
        <div className="mb-6 p-4 bg-[#1a1325] border border-amber-500/30 rounded-2xl flex items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-xl shrink-0">
            <Flame className="text-amber-400" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-0.5">⚡ Top Priority — {topRequest.votes.length} votes</div>
            <div className="font-bold text-violet-50 truncate">{topRequest.title}</div>
            <div className="text-violet-400 text-sm truncate">{topRequest.description}</div>
          </div>
          <div className="shrink-0">
            <select value={topRequest.status} onChange={e => updateStatus(topRequest._id, e.target.value)}
              className="bg-[#0f0a19] border border-violet-500/30 text-violet-200 text-sm rounded-lg p-2 outline-none focus:ring-1 focus:ring-violet-500">
              <option value="pending">Pending</option>
              <option value="under review">Under Review</option>
              <option value="implemented">Implemented</option>
            </select>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-violet-500/20 mb-6">
        <button onClick={() => setTab("requests")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "requests" ? "border-violet-500 text-violet-300" : "border-transparent text-violet-400/60 hover:text-violet-300"
          }`}>
          <Lightbulb size={14} /> Feature Requests ({requests.length})
        </button>
        <button onClick={() => setTab("feedback")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "feedback" ? "border-violet-500 text-violet-300" : "border-transparent text-violet-400/60 hover:text-violet-300"
          }`}>
          <MessageSquare size={14} /> Product Feedback ({feedbacks.length})
        </button>
      </div>

      {/* Feature Requests Table */}
      {tab === "requests" && (
        <div className="bg-[#1a1325] border border-violet-500/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-violet-200">
              <thead className="text-xs text-violet-400 uppercase bg-[#0f0a19]/60 border-b border-violet-500/20">
                <tr>
                  <th className="px-4 py-4 w-12">#</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Author</th>
                  <th className="px-4 py-4">Votes</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => {
                  const badge = getVoteBadge(req.votes.length);
                  return (
                    <motion.tr key={req._id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className={`border-b border-violet-500/10 transition-colors ${
                        i === 0 ? "bg-amber-500/5 hover:bg-amber-500/10" : "hover:bg-[#0f0a19]/20"
                      }`}>
                      <td className="px-4 py-4 text-violet-500 font-mono text-xs">{i + 1}</td>
                      <td className="px-4 py-4 font-medium text-violet-100 max-w-[200px]">
                        <div className="truncate">{req.title}</div>
                        <div className="text-xs text-violet-400/50 truncate mt-0.5">{req.description}</div>
                      </td>
                      <td className="px-4 py-4 text-violet-300 text-xs">{req.createdBy?.username || "Unknown"}</td>
                      <td className="px-4 py-4">
                        <span className={`text-lg font-bold ${req.votes.length >= 20 ? "text-amber-400" : req.votes.length >= 5 ? "text-violet-300" : "text-violet-500"}`}>
                          {req.votes.length}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {badge ? (
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${badge.cls}`}>
                            {badge.icon} {badge.label}
                          </span>
                        ) : (
                          <span className="text-violet-500/40 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {updating === req._id && <RefreshCw size={13} className="animate-spin text-violet-500" />}
                          <select value={req.status} onChange={e => updateStatus(req._id, e.target.value)}
                            disabled={updating === req._id}
                            className="bg-[#0f0a19] border border-violet-500/30 text-violet-200 text-xs rounded-lg p-1.5 outline-none focus:ring-1 focus:ring-violet-500">
                            <option value="pending">Pending</option>
                            <option value="under review">Under Review</option>
                            <option value="implemented">Implemented</option>
                          </select>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="text-center py-12 text-violet-400/50">No feature requests yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Product Feedback Table */}
      {tab === "feedback" && (
        <div className="bg-[#1a1325] border border-violet-500/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-violet-200">
              <thead className="text-xs text-violet-400 uppercase bg-[#0f0a19]/60 border-b border-violet-500/20">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb, i) => (
                  <motion.tr key={fb._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-violet-500/10 hover:bg-[#0f0a19]/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-violet-100">{fb.product}</td>
                    <td className="px-6 py-4 text-violet-300">{fb.createdBy?.username || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} size={14} className={n <= fb.rating ? "text-amber-400 fill-amber-400" : "text-violet-500/20"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-violet-300 max-w-[300px]">
                      <p className="line-clamp-2">{fb.message}</p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {feedbacks.length === 0 && (
              <div className="text-center py-12 text-violet-400/50">No product feedback submitted yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
