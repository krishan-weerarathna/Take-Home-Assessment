import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { useGetAllTasks, useCreateTask, useUpdateStatusTask } from './api/task';

jest.mock('./api/task', () => ({
  useGetAllTasks: jest.fn(),
  useCreateTask: jest.fn(),
  useUpdateStatusTask: jest.fn(),
}));

const mockUseGetAllTasks = useGetAllTasks as jest.MockedFunction<typeof useGetAllTasks>;
const mockUseCreateTask = useCreateTask as jest.MockedFunction<typeof useCreateTask>;
const mockUseUpdateStatusTask = useUpdateStatusTask as jest.MockedFunction<
  typeof useUpdateStatusTask
>;

const mockTasks = [
  {
    id: 1,
    title: 'Task One',
    description: 'Desc One',
    status: 'pending',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Desc Two',
    status: 'pending',
    created_at: '2024-01-02T00:00:00Z',
  },
];

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
};

describe('App', () => {
  const mockRefetch = jest.fn();
  const mockTaskCreate = jest.fn();
  const mockUpdateTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseGetAllTasks.mockReturnValue({ data: mockTasks, refetch: mockRefetch } as any);
    mockUseCreateTask.mockReturnValue({ mutate: mockTaskCreate } as any);
    mockUseUpdateStatusTask.mockReturnValue({ mutate: mockUpdateTask } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Layout', () => {
    it('renders the task form', () => {
      renderApp();
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    });

    it('renders the task list with tasks from the API', () => {
      renderApp();
      expect(screen.getByText('Task One')).toBeInTheDocument();
      expect(screen.getByText('Task Two')).toBeInTheDocument();
    });

    it('renders "No tasks available" when data is an empty array', () => {
      mockUseGetAllTasks.mockReturnValue({ data: [], refetch: mockRefetch } as any);
      renderApp();
      expect(screen.getByText('No tasks available')).toBeInTheDocument();
    });

    it('renders "No tasks available" when data is undefined', () => {
      mockUseGetAllTasks.mockReturnValue({ data: undefined, refetch: mockRefetch } as any);
      renderApp();
      expect(screen.getByText('No tasks available')).toBeInTheDocument();
    });

    it('does not show a toast on initial render', () => {
      renderApp();
      expect(screen.queryByRole('button', { name: '×' })).not.toBeInTheDocument();
    });
  });

  describe('Creating a task', () => {
    it('calls createTask mutate with form data on valid submit', () => {
      renderApp();
      fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: 'New Task' },
      });
      fireEvent.change(screen.getByPlaceholderText('Description'), {
        target: { value: 'New Desc' },
      });
      fireEvent.click(screen.getByRole('button', { name: /add/i }));
      expect(mockTaskCreate).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Desc',
      });
    });

    it('does not call createTask mutate when form fields are empty', () => {
      renderApp();
      fireEvent.click(screen.getByRole('button', { name: /add/i }));
      expect(mockTaskCreate).not.toHaveBeenCalled();
    });

    it('shows a success toast and refetches after task creation', () => {
      let capturedOptions: any;
      mockUseCreateTask.mockImplementation((options?: any) => {
        capturedOptions = options;
        return { mutate: mockTaskCreate } as any;
      });

      renderApp();

      act(() => {
        capturedOptions?.onSuccess?.();
      });

      expect(screen.getByText('Task created successfully')).toBeInTheDocument();
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('passes onSuccess callback to useCreateTask', () => {
      let capturedOptions: any;
      mockUseCreateTask.mockImplementation((options?: any) => {
        capturedOptions = options;
        return { mutate: mockTaskCreate } as any;
      });

      renderApp();
      expect(typeof capturedOptions?.onSuccess).toBe('function');
    });
  });

  describe('Completing a task', () => {
    it('calls updateTask mutate with correct id and status when Done is clicked', () => {
      renderApp();
      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      fireEvent.click(doneButtons[0]);
      expect(mockUpdateTask).toHaveBeenCalledWith({ id: 1, status: 'done' });
    });

    it('calls updateTask for the correct task when the second Done button is clicked', () => {
      renderApp();
      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      fireEvent.click(doneButtons[1]);
      expect(mockUpdateTask).toHaveBeenCalledWith({ id: 2, status: 'done' });
    });

    it('shows a success toast and refetches after status update', () => {
      let capturedOptions: any;
      mockUseUpdateStatusTask.mockImplementation((options?: any) => {
        capturedOptions = options;
        return { mutate: mockUpdateTask } as any;
      });

      renderApp();

      act(() => {
        capturedOptions?.onSuccess?.();
      });

      expect(screen.getByText('Task status updated successfully')).toBeInTheDocument();
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Toast behaviour', () => {
    it('closes the toast when the × button is clicked', () => {
      let capturedOptions: any;
      mockUseCreateTask.mockImplementation((options?: any) => {
        capturedOptions = options;
        return { mutate: mockTaskCreate } as any;
      });

      renderApp();

      act(() => {
        capturedOptions?.onSuccess?.();
      });

      expect(screen.getByText('Task created successfully')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: '×' }));
      expect(screen.queryByText('Task created successfully')).not.toBeInTheDocument();
    });

    it('auto-dismisses the toast after 3 seconds', () => {
      let capturedOptions: any;
      mockUseCreateTask.mockImplementation((options?: any) => {
        capturedOptions = options;
        return { mutate: mockTaskCreate } as any;
      });

      renderApp();

      act(() => {
        capturedOptions?.onSuccess?.();
      });

      expect(screen.getByText('Task created successfully')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(screen.queryByText('Task created successfully')).not.toBeInTheDocument();
    });
  });
});
