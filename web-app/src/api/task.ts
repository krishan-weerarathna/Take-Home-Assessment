import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import api from "./apiService";
import { CreateTaskBody, UpdateTaskBody } from "../types/task.types";

export const useGetAllTasks = () =>
  useQuery({
    queryKey: ["tasks/all"],
    queryFn: async () => {
      const response = await api.get("/tasks/all");
      return response.data;
    },
  });

export const useCreateTask = (
  options?: UseMutationOptions<any, Error, CreateTaskBody>,
) => {
  return useMutation({
    mutationFn: async (data: CreateTaskBody) => {
      const response = await api.post("/tasks", data);
      return response.data;
    },
    ...options,
  });
};

export const useUpdateStatusTask = (
  options?: UseMutationOptions<any, Error, UpdateTaskBody>,
) => {
  return useMutation({
    mutationFn: async (data: UpdateTaskBody) => {
      const response = await api.put("/tasks", data);
      return response.data;
    },
    ...options,
  });
};
