"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/services/api";
import { AssetCard } from "./AssetCard";
import { AssetCardSkeleton } from "./AssetCardSkeleton";

export interface Asset {
  _id: string;
  title: string;
  sector: string;
  stage: string;
  valuation: number;
  shortDescription: string;
  image: string;
  riskScore: number;
  verified: boolean;
}

async function fetchAssets(): Promise<Asset[]> {
  const { data } = await api.get("/assets?limit=8");
  return data.assets || data;
}

export function FeaturedAssets() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-assets"],
    queryFn: fetchAssets,
    retry: 1,
  });

  return (
    <section className="section">
      <div className="container-x">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">[ Portfolio deal-flow ]</p>
            <h2 className="display-serif text-display-lg max-w-2xl">
              Featured startup<br />
              <span className="italic text-bone-200">assets under review</span>
            </h2>
          </div>
          <Link href="/explore" className="btn-link">
            View all verified assets <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {isError ? (
          <div className="panel p-12 text-center">
            <p className="text-bone-200 mb-4">
              Backend offline — showing demo intent.
            </p>
            <p className="text-sm text-bone-300">
              Start the server: <code className="text-accent">cd server && npm run dev</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <AssetCardSkeleton key={i} />)
              : data?.slice(0, 4).map((asset) => (
                  <AssetCard key={asset._id} asset={asset} />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}