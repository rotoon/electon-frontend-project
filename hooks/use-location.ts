import api from "@/lib/api";
import { Constituency, District, Province } from "@/types/location";
import { useQuery } from "@tanstack/react-query";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const { data } = await api.get<Province[]>("/location/provinces");
      return data;
    },
  });
}

export function useDistricts(provinceId: number | undefined) {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const { data } = await api.get<District[]>(
        `/location/provinces/${provinceId}/districts`,
      );
      return data;
    },
    enabled: !!provinceId,
  });
}

export function useConstituencyByDistrict(districtId: number | undefined) {
  return useQuery({
    queryKey: ["constituency", districtId],
    queryFn: async () => {
      if (!districtId) return null;
      try {
        const { data } = await api.get<{
          district: { id: number; name: string };
          constituency: Constituency;
        }>(`/location/districts/${districtId}/constituencies`);
        return data.constituency;
      } catch (error) {
        return null;
      }
    },
    enabled: !!districtId,
    retry: false, // Don't retry if waiting for district selection or not found
  });
}
