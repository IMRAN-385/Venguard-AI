export interface Asset {
  _id: string;
  name: string;
  sector: string;
  description: string;
  price: number;
  riskTier: "Low" | "Moderate" | "High";
  performance: number; // percent change
  imageUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetFilters {
  sector?: string;
  riskTier?: Asset["riskTier"];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "performance" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedAssets {
  assets: Asset[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateAssetInput {
  name: string;
  sector: string;
  description: string;
  price: number;
  riskTier: Asset["riskTier"];
  imageUrl?: string;
}