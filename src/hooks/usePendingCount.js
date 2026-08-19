import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";
import axiosClient from "../api/axiosClient";

export const usePendingCount = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["pendingCount"],
    queryFn: async () => {
      const res = await axiosClient.get("/device/pending-count");
      return res.data.count;
    },
    refetchInterval: 30000,  
  });
 
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("new-device-request", () => {
      queryClient.invalidateQueries(["pendingCount"]);
    });

    return () => socket.disconnect();
  }, [queryClient]);

  return query;
};