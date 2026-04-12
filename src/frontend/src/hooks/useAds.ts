import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdConfig } from "../types";

const SAMPLE_ADS: AdConfig[] = [
  {
    id: "ad1",
    placement: "homepage_banner",
    title: "Premium Membership — Ad Free Streaming",
    imageUrl:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=200&fit=crop",
    targetUrl: "#",
    isEnabled: true,
    createdAt: Date.now(),
  },
  {
    id: "ad2",
    placement: "video_pre_roll",
    title: "New Season of Attack on Titan",
    imageUrl:
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&h=450&fit=crop",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    targetUrl: "#",
    isEnabled: false,
    createdAt: Date.now(),
  },
];

let adStore: AdConfig[] = [...SAMPLE_ADS];

export function useAllAds() {
  return useQuery<AdConfig[]>({
    queryKey: ["ads", "all"],
    queryFn: async () => [...adStore],
  });
}

export function useEnabledAds() {
  return useQuery<AdConfig[]>({
    queryKey: ["ads", "enabled"],
    queryFn: async () => adStore.filter((a) => a.isEnabled),
  });
}

export function useAdsByPlacement(placement: AdConfig["placement"]) {
  return useQuery<AdConfig[]>({
    queryKey: ["ads", "placement", placement],
    queryFn: async () =>
      adStore.filter((a) => a.placement === placement && a.isEnabled),
  });
}

export function useCreateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<AdConfig, "id" | "createdAt">,
    ): Promise<AdConfig> => {
      const newAd: AdConfig = {
        ...data,
        id: String(Date.now()),
        createdAt: Date.now(),
      };
      adStore = [newAd, ...adStore];
      return newAd;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });
}

export function useUpdateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: Partial<AdConfig> }): Promise<AdConfig> => {
      const idx = adStore.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Ad not found");
      adStore[idx] = { ...adStore[idx], ...data };
      return adStore[idx];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });
}

export function useDeleteAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      adStore = adStore.filter((a) => a.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });
}
