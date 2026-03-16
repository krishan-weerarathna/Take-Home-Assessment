import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAllTasks, useCreateTask, useUpdateStatusTask } from './task';
import api from './apiService';

jest.mock('./apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

const mockedApi = api as unknown as { get: jest.Mock; post: jest.Mock; put: jest.Mock };

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useGetAllTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns task data on a successful GET /tasks/all', async () => {
    const tasks = [
      { id: 1, title: 'Task A', description: 'Desc A', status: 'pending', created_at: '' },
    ];
    mockedApi.get.mockResolvedValue({ data: tasks });

    const { result } = renderHook(() => useGetAllTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApi.get).toHaveBeenCalledWith('/tasks/all');
    expect(result.current.data).toEqual(tasks);
  });

  it('enters an error state when GET /tasks/all fails', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGetAllTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('uses the correct query key', async () => {
    mockedApi.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useGetAllTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });
});

describe('useCreateTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls POST /tasks with the provided task data', async () => {
    const newTask = { title: 'New Task', description: 'New Description' };
    const createdTask = { id: 10, ...newTask, status: 'pending', created_at: '' };
    mockedApi.post.mockResolvedValue({ data: createdTask });

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newTask);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApi.post).toHaveBeenCalledWith('/tasks', newTask);
    expect(result.current.data).toEqual(createdTask);
  });

  it('enters an error state when POST /tasks fails', async () => {
    mockedApi.post.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ title: 'Task', description: 'Desc' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('calls onSuccess option callback after successful mutation', async () => {
    const mockOnSuccess = jest.fn();
    mockedApi.post.mockResolvedValue({ data: { id: 1 } });

    const { result } = renderHook(() => useCreateTask({ onSuccess: mockOnSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ title: 'Task', description: 'Desc' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });
});

describe('useUpdateStatusTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls PUT /tasks with the provided update data', async () => {
    const updateData = { id: 5, status: 'done' };
    const updatedTask = { id: 5, title: 'Task', description: 'Desc', status: 'done', created_at: '' };
    mockedApi.put.mockResolvedValue({ data: updatedTask });

    const { result } = renderHook(() => useUpdateStatusTask(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(updateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApi.put).toHaveBeenCalledWith('/tasks', updateData);
    expect(result.current.data).toEqual(updatedTask);
  });

  it('enters an error state when PUT /tasks fails', async () => {
    mockedApi.put.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useUpdateStatusTask(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, status: 'done' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('calls onSuccess option callback after successful mutation', async () => {
    const mockOnSuccess = jest.fn();
    mockedApi.put.mockResolvedValue({ data: { id: 1 } });

    const { result } = renderHook(
      () => useUpdateStatusTask({ onSuccess: mockOnSuccess }),
      { wrapper: createWrapper() },
    );

    result.current.mutate({ id: 1, status: 'done' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });
});
