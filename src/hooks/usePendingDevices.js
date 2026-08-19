import { useQuery } from "@tanstack/react-query";
import { getPendingDevices } from "../api/endpoints/deviceApi";

export function usePendingDevices() {
  return useQuery({
    queryKey: ["pendingDevices"],
    queryFn: async () => {
      const { data } = await getPendingDevices();
      return data.devices;
    },
  });
}