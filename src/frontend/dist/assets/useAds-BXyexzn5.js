import { w as useQuery, x as useQueryClient, y as useMutation } from "./index-DnVaqzJ1.js";
const SAMPLE_ADS = [
  {
    id: "ad1",
    placement: "homepage_banner",
    title: "Premium Membership — Ad Free Streaming",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=200&fit=crop",
    targetUrl: "#",
    isEnabled: true,
    createdAt: Date.now()
  },
  {
    id: "ad2",
    placement: "video_pre_roll",
    title: "New Season of Attack on Titan",
    imageUrl: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&h=450&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    targetUrl: "#",
    isEnabled: false,
    createdAt: Date.now()
  }
];
let adStore = [...SAMPLE_ADS];
function useAllAds() {
  return useQuery({
    queryKey: ["ads", "all"],
    queryFn: async () => [...adStore]
  });
}
function useAdsByPlacement(placement) {
  return useQuery({
    queryKey: ["ads", "placement", placement],
    queryFn: async () => adStore.filter((a) => a.placement === placement && a.isEnabled)
  });
}
function useCreateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const newAd = {
        ...data,
        id: String(Date.now()),
        createdAt: Date.now()
      };
      adStore = [newAd, ...adStore];
      return newAd;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    }
  });
}
function useUpdateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data
    }) => {
      const idx = adStore.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Ad not found");
      adStore[idx] = { ...adStore[idx], ...data };
      return adStore[idx];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    }
  });
}
function useDeleteAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      adStore = adStore.filter((a) => a.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    }
  });
}
export {
  useAllAds as a,
  useCreateAd as b,
  useUpdateAd as c,
  useDeleteAd as d,
  useAdsByPlacement as u
};
