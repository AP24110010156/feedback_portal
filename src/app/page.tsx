"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/AnimatedButton";
import {
  ThumbsUp, Send, CheckCircle2, Clock, Activity,
  Loader2, MessageSquare, Lightbulb, Star, Flame, TrendingUp, Users
} from "lucide-react";

type RequestType = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: string[];
  createdBy: { _id: string; username: string; email: string };
  createdAt: string;
};

export default function Home() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"requests" | "feedback">("requests");

  // Feature requests state
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loadingReq, setLoadingReq] = useState(true);
  const [reqTitle, setReqTitle] = useState("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqCategory, setReqCategory] = useState("Feature");
  const [submittingReq, setSubmittingReq] = useState(false);
  const [filter, setFilter] = useState<"popular" | "newest">("popular");

  // Product feedback state
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingFb, setSubmittingFb] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/feedback");
      setRequests(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReq(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const sortedRequests = [...requests].sort((a, b) => {
    if (filter === "popular") return b.votes.length - a.votes.length;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const topRequest = requests.length > 0
    ? [...requests].sort((a, b) => b.votes.length - a.votes.length)[0]
    : null;

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("You must be logged in.");
    setSubmittingReq(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: reqTitle, description: reqDesc, category: reqCategory }),
      });
      if (res.ok) { setReqTitle(""); setReqDesc(""); fetchRequests(); }
    } finally { setSubmittingReq(false); }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("You must be logged in.");
    setSubmittingFb(true);
    try {
      const res = await fetch("/api/product-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, message, rating }),
      });
      if (res.ok) {
        setProduct(""); setMessage(""); setRating(5);
        setFbSuccess(true);
        setTimeout(() => setFbSuccess(false), 3000);
      }
    } finally { setSubmittingFb(false); }
  };

  const handleVote = async (id: string) => {
    if (!session) return alert("You must be logged in to vote.");
    const userId = (session.user as any).id;
    setRequests(cur => cur.map(r => {
      if (r._id !== id) return r;
      const hasVoted = r.votes.includes(userId);
      return { ...r, votes: hasVoted ? r.votes.filter(v => v !== userId) : [...r.votes, userId] };
    }));
    await fetch(`/api/feedback/${id}/vote`, { method: "POST" });
  };

  const getStatusIcon = (status: string) => {
    if (status === "implemented") return <CheckCircle2 size={13} className="text-emerald-400" />;
    if (status === "under review") return <Activity size={13} className="text-amber-400" />;
    return <Clock size={13} className="text-violet-400" />;
  };

  const isTrending = (req: RequestType) => req.votes.length >= 5;
  const isHot = (req: RequestType) => req.votes.length >= 20;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="mb-8 p-6 bg-[#1a1325] border border-violet-500/20 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-violet-50 mb-1">Community Feedback Portal</h1>
            <p className="text-violet-300 text-sm">
              Browse, submit, and vote on feature requests. The most popular ideas get built first.
            </p>
          </div>
          <div className="flex gap-4 text-center shrink-0">
            <div className="bg-[#0f0a19] rounded-xl px-4 py-3">
              <div className="text-2xl font-bold text-violet-300">{requests.length}</div>
              <div className="text-xs text-violet-400">Requests</div>
            </div>
            <div className="bg-[#0f0a19] rounded-xl px-4 py-3">
              <div className="text-2xl font-bold text-violet-300">
                {requests.reduce((sum, r) => sum + r.votes.length, 0)}
              </div>
              <div className="text-xs text-violet-400">Total Votes</div>
            </div>
            <div className="bg-[#0f0a19] rounded-xl px-4 py-3">
              <div className="text-2xl font-bold text-emerald-400">
                {requests.filter(r => r.status === "implemented").length}
              </div>
              <div className="text-xs text-violet-400">Implemented</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Spotlight — shown when top request has votes */}
      {topRequest && topRequest.votes.length > 0 && (
        <div className="mb-8 p-5 bg-[#1a1325] border border-amber-500/30 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={18} className="text-amber-400" />
            <span className="text-sm font-semibold text-amber-400 uppercase tracking-wide">🔥 Most Popular Right Now</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center bg-[#0f0a19] rounded-xl p-3 min-w-[64px]">
              <ThumbsUp size={20} className="text-amber-400 fill-amber-400/30 mb-1" />
              <span className="text-xl font-bold text-amber-400">{topRequest.votes.length}</span>
              <span className="text-xs text-violet-400">votes</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-lg text-violet-50">{topRequest.title}</h2>
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                  topRequest.status === "implemented" ? "bg-emerald-500/15 text-emerald-400" :
                  topRequest.status === "under review" ? "bg-amber-500/15 text-amber-400" :
                  "bg-violet-500/15 text-violet-400"
                }`}>{topRequest.status}</span>
              </div>
              <p className="text-violet-300 text-sm line-clamp-2">{topRequest.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-violet-400/60">
                <span className="bg-violet-500/10 px-2 py-0.5 rounded text-violet-300">{topRequest.category}</span>
                <span>·</span>
                <span>By {topRequest.createdBy?.username || "Unknown"}</span>
                <span>·</span>
                <Users size={12} /> <span>{topRequest.votes.length} supporters</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-violet-500/20 mb-8">
        <button onClick={() => setTab("requests")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "requests" ? "border-violet-500 text-violet-300" : "border-transparent text-violet-400/60 hover:text-violet-300"
          }`}>
          <Lightbulb size={15} /> Feature Requests
        </button>
        <button onClick={() => setTab("feedback")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "feedback" ? "border-violet-500 text-violet-300" : "border-transparent text-violet-400/60 hover:text-violet-300"
          }`}>
          <MessageSquare size={15} /> Product Feedback
        </button>
      </div>

      {/* Feature Requests Tab */}
      {tab === "requests" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submit Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1325] border border-violet-500/20 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-violet-100 mb-1">Suggest a Feature</h2>
              <p className="text-violet-400 text-xs mb-4">Ideas with more votes get implemented first.</p>
              {session ? (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-violet-300 mb-1">Title</label>
                    <input type="text" value={reqTitle} onChange={e => setReqTitle(e.target.value)}
                      placeholder="e.g. Add Dark Mode"
                      className="w-full px-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-violet-50"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-violet-300 mb-1">Category</label>
                    <select value={reqCategory} onChange={e => setReqCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-violet-50">
                      <option>Feature</option>
                      <option>Bug Fix</option>
                      <option>Enhancement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-violet-300 mb-1">Details</label>
                    <textarea value={reqDesc} onChange={e => setReqDesc(e.target.value)}
                      placeholder="Describe your idea in detail..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-violet-50 resize-none"
                      required />
                  </div>
                  <AnimatedButton type="submit" className="w-full" disabled={submittingReq}>
                    {submittingReq ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {submittingReq ? "Submitting..." : "Submit Request"}
                  </AnimatedButton>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-violet-400 text-sm mb-3">Log in to suggest features and vote.</p>
                  <AnimatedButton variant="secondary" onClick={() => window.location.href = "/login"}>
                    Log In
                  </AnimatedButton>
                </div>
              )}
            </div>
          </div>

          {/* Requests Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-violet-400">{requests.length} requests</span>
              <div className="flex gap-1 bg-[#0f0a19] rounded-lg p-1">
                <button onClick={() => setFilter("popular")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === "popular" ? "bg-violet-600 text-white" : "text-violet-400 hover:text-violet-200"
                  }`}>
                  <TrendingUp size={12} /> Popular
                </button>
                <button onClick={() => setFilter("newest")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === "newest" ? "bg-violet-600 text-white" : "text-violet-400 hover:text-violet-200"
                  }`}>
                  <Clock size={12} /> Newest
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {loadingReq ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-violet-500" size={36} /></div>
              ) : (
                <AnimatePresence>
                  {sortedRequests.map((req, i) => {
                    const hasVoted = session && req.votes.includes((session.user as any).id);
                    const trending = isTrending(req);
                    const hot = isHot(req);
                    return (
                      <motion.div key={req._id} layout
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                        className={`bg-[#1a1325] border rounded-2xl p-5 flex gap-4 transition-colors ${
                          hot ? "border-amber-500/40 hover:border-amber-500/60" :
                          trending ? "border-violet-500/30 hover:border-violet-500/50" :
                          "border-violet-500/15 hover:border-violet-500/30"
                        }`}
                      >
                        {/* Vote Button */}
                        <div className="flex flex-col items-center gap-1">
                          <button onClick={() => handleVote(req._id)}
                            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                              hasVoted
                                ? "bg-violet-600/20 text-violet-400"
                                : "bg-[#0f0a19] text-violet-400/60 hover:text-violet-300 hover:bg-violet-500/10"
                            }`}>
                            <motion.div whileTap={{ scale: 0.7 }}>
                              <ThumbsUp size={18} className={hasVoted ? "fill-current" : ""} />
                            </motion.div>
                            <span className={`text-sm font-bold mt-1 ${hot ? "text-amber-400" : ""}`}>
                              {req.votes.length}
                            </span>
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-violet-50">{req.title}</h3>
                              {hot && (
                                <span className="flex items-center gap-1 bg-amber-500/15 text-amber-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                                  <Flame size={11} /> Hot
                                </span>
                              )}
                              {trending && !hot && (
                                <span className="flex items-center gap-1 bg-violet-500/15 text-violet-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                                  <TrendingUp size={11} /> Trending
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap text-xs bg-[#0f0a19] px-2.5 py-1 rounded-full">
                              {getStatusIcon(req.status)}
                              <span className="capitalize text-violet-300">{req.status}</span>
                            </div>
                          </div>
                          <p className="text-violet-300/70 text-sm mb-3 line-clamp-2">{req.description}</p>
                          <div className="flex items-center gap-3 text-xs text-violet-400/50">
                            <span className="bg-violet-500/10 px-2 py-0.5 rounded text-violet-300">{req.category}</span>
                            <span>·</span>
                            <span>By {req.createdBy?.username || "Unknown"}</span>
                            <span>·</span>
                            <span>{req.votes.length} {req.votes.length === 1 ? "vote" : "votes"}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              {!loadingReq && requests.length === 0 && (
                <div className="text-center py-16 bg-[#1a1325] border border-violet-500/20 rounded-2xl">
                  <Lightbulb size={36} className="text-violet-500/40 mx-auto mb-3" />
                  <p className="text-violet-400 font-medium">No requests yet.</p>
                  <p className="text-violet-500/60 text-sm mt-1">Be the first to suggest a feature!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Feedback Tab */}
      {tab === "feedback" && (
        <div className="max-w-xl mx-auto">
          <div className="bg-[#1a1325] border border-violet-500/20 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-violet-100 mb-1">Share Product Feedback</h2>
            <p className="text-violet-400 text-sm mb-6">Tell us how we can improve our products or services.</p>
            {!session ? (
              <div className="text-center py-8">
                <p className="text-violet-400 mb-4">You must be logged in to submit feedback.</p>
                <AnimatedButton onClick={() => window.location.href = "/login"}>Log In</AnimatedButton>
              </div>
            ) : fbSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-violet-100">Feedback Submitted!</h3>
                <p className="text-violet-400 text-sm mt-1">Thank you for helping us improve.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-1">Product / Service</label>
                  <input type="text" value={product} onChange={e => setProduct(e.target.value)}
                    placeholder="e.g. Mobile App, Website, Support"
                    className="w-full px-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-violet-50"
                    required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setRating(n)}>
                        <Star size={28} className={`transition-colors ${n <= rating ? "text-amber-400 fill-amber-400" : "text-violet-500/30"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-1">Your Feedback</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Share your experience, issues, or suggestions..."
                    rows={5}
                    className="w-full px-4 py-2.5 bg-[#0f0a19] border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-violet-50 resize-none"
                    required />
                </div>
                <AnimatedButton type="submit" className="w-full" disabled={submittingFb}>
                  {submittingFb ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  {submittingFb ? "Sending..." : "Send Feedback"}
                </AnimatedButton>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
