import { useQuery } from "@tanstack/react-query";
import { getDevices } from "../api/endpoints/deviceApi";

export function useDevices({ page, limit , search, compliance }) {
  return useQuery({
    queryKey: ["devices", page, limit, search, compliance],
    queryFn: async () => {
      const { data } = await getDevices(page, limit, search, compliance);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    keepPreviousData: true, // avoids a flash of empty state while changing pages
  });
}