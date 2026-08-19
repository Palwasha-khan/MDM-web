import { useQuery } from "@tanstack/react-query";
import { getDeviceStats } from "../api/endpoints/deviceApi";

export function useDeviceStats() {
  return useQuery({
    queryKey: ["deviceStats"],
    queryFn: async () => {
      const { data } = await getDeviceStats();
      return data;
    },
    refetchInterval: 30000, 
  });
}