/**
 * useAds — localStorage-only. No actor/canister calls.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateId, getAds, saveAds } from "../lib/localStorageDB";
import type { AdConfig } from "../types";

export function useAllAds() {
  return useQuery<AdConfig[]>({
    queryKey: ["ads", "all"],
    queryFn: () => getAds(),
    staleTime: 0,
  });
}

export function useEnabledAds() {
  return useQuery<AdConfig[]>({
    queryKey: ["ads", "enabled"],
    queryFn: () => getAds().filter((a) => a.isEnabled),
    staleTime: 0,
  });
}

export function useAdsByPlacement(placement: AdConfig["placement"]) {
  return useQuery<AdConfig[]>({
    queryKey: ["ads", "placement", placement],
    queryFn: () =>
      getAds().filter((a) => a.placement === placement && a.isEnabled),
    staleTime: 0,
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
        id: generateId(),
        createdAt: Date.now(),
      };
      const all = getAds();
      all.unshift(newAd);
      saveAds(all);
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
      const all = getAds();
      const idx = all.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Ad not found");
      all[idx] = { ...all[idx], ...data };
      saveAds(all);
      return all[idx];
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
      const filtered = getAds().filter((a) => a.id !== id);
      saveAds(filtered);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });
}
