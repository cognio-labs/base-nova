"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Linkedin,
  MapPin,
  Search,
} from "lucide-react";
import { partners } from "@/data/partners";
import type { Partner } from "@/data/partners";

export default function PartnersPage() {
  const [query, setQuery] = useState("");

  const filteredPartners = partners.filter((partner) => {
    const haystack = [
      partner.name,
      partner.location,
      partner.description,
      partner.languages.join(" "),
      partner.tags.join(" "),
      partner.website ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#fcfcfd] px-4 py-16 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="pointer-events-none absolute left-10 top-24 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-20 top-44 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-sky-500">Partner Network</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Hire a LokoAI partner
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Find builders, consultants, AI experts, and integration specialists who can turn your idea into a polished
            product faster.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button className="w-fit rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:bg-slate-900">
              Apply to become a partner
            </button>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search partners, tags, languages..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-[0_14px_35px_rgba(148,163,184,0.12)] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPartners.map((partner, index) => (
            <motion.article
              key={`${partner.name}-${partner.location}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-[1.35rem] border border-sky-100 bg-white shadow-[0_16px_40px_rgba(56,189,248,0.08)] transition-all duration-300 hover:border-sky-200 hover:shadow-[0_20px_50px_rgba(56,189,248,0.14)]"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <PartnerAvatar partner={partner} />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold text-slate-950">{partner.name}</h2>
                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{partner.location}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      {partner.website && (
                        <Link
                          href={partner.website}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-sky-600 transition hover:text-sky-700"
                        >
                          {formatWebsiteLabel(partner.website)}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      {partner.linkedin && (
                        <Link
                          href={partner.linkedin}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-sky-600 transition hover:text-sky-700"
                        >
                          LinkedIn
                          <Linkedin className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {partner.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {partner.tags.length > 4 && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700">
                      +{partner.tags.length - 4}
                    </span>
                  )}
                </div>

                <p className="mt-4 line-clamp-3 min-h-[4.75rem] text-sm leading-7 text-slate-600">
                  {partner.description}
                </p>

                <p className="mt-4 text-sm text-slate-700">
                  <span className="font-medium">Languages:</span> {partner.languages.join(", ") || "English"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  {partner.startingFrom && (
                    <span className="inline-flex items-center gap-2">
                      <span className="text-slate-400">$</span>
                      From {partner.startingFrom}
                    </span>
                  )}
                  {partner.hourlyRate && (
                    <span className="inline-flex items-center gap-2">
                      <span className="text-slate-400">◔</span>
                      {partner.hourlyRate}
                    </span>
                  )}
                </div>

                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600">
                  Contact
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerAvatar({ partner }: { partner: Partner }) {
  const initials = partner.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const palette = getAvatarPalette(partner.name);

  return (
    <div
      className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-[0_12px_30px_rgba(56,189,248,0.12)]"
      style={{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})` }}
    >
      <div className="absolute -right-2 top-0 h-8 w-8 rounded-full bg-white/35 blur-xl" />
      <div className="absolute bottom-0 left-0 h-8 w-8 rounded-full bg-white/20 blur-lg" />
      <div className="relative flex h-full w-full items-center justify-center text-xl font-bold text-white">
        {initials}
      </div>
    </div>
  );
}

function getAvatarPalette(value: string) {
  const palettes = [
    ["#38bdf8", "#0ea5e9"],
    ["#60a5fa", "#2563eb"],
    ["#22c55e", "#14b8a6"],
    ["#f59e0b", "#fb7185"],
    ["#8b5cf6", "#6366f1"],
    ["#0f172a", "#334155"],
  ];

  const seed = value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return palettes[seed % palettes.length];
}

function formatWebsiteLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
