import { useQuery } from "@tanstack/react-query";
import { getDeviceHistory } from "../api/endpoints/deviceApi";

export function useDeviceHistory(id) {
  return useQuery({
    queryKey: ["deviceHistory", id],
    queryFn: async () => {
      const { data } = await getDeviceHistory(id);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: false,
  });
}