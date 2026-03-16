import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';
import { Task } from '../types/task.types';

const mockTask: Task = {
  id: 42,
  title: 'Fix the bug',
  description: 'There is a null pointer in the handler',
  status: 'pending',
  created_at: '2024-03-01T10:00:00Z',
};

describe('TaskItem', () => {
  const mockCompleteTask = jest.fn();

  beforeEach(() => {
    mockCompleteTask.mockClear();
  });

  it('renders the task title', () => {
    render(<TaskItem task={mockTask} completeTask={mockCompleteTask} />);
    expect(screen.getByText('Fix the bug')).toBeInTheDocument();
  });

  it('renders the task description', () => {
    render(<TaskItem task={mockTask} completeTask={mockCompleteTask} />);
    expect(screen.getByText('There is a null pointer in the handler')).toBeInTheDocument();
  });

  it('renders the Done button', () => {
    render(<TaskItem task={mockTask} completeTask={mockCompleteTask} />);
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('calls completeTask with the task id when Done is clicked', () => {
    render(<TaskItem task={mockTask} completeTask={mockCompleteTask} />);
    fireEvent.click(screen.getByRole('button', { name: /done/i }));
    expect(mockCompleteTask).toHaveBeenCalledWith(42);
  });

  it('calls completeTask exactly once per click', () => {
    render(<TaskItem task={mockTask} completeTask={mockCompleteTask} />);
    fireEvent.click(screen.getByRole('button', { name: /done/i }));
    expect(mockCompleteTask).toHaveBeenCalledTimes(1);
  });

  it('does not call completeTask on initial render', () => {
    render(<TaskItem task={mockTask} completeTask={mockCompleteTask} />);
    expect(mockCompleteTask).not.toHaveBeenCalled();
  });

  it('passes the correct id for a different task', () => {
    const anotherTask: Task = { ...mockTask, id: 99, title: 'Another Task' };
    render(<TaskItem task={anotherTask} completeTask={mockCompleteTask} />);
    fireEvent.click(screen.getByRole('button', { name: /done/i }));
    expect(mockCompleteTask).toHaveBeenCalledWith(99);
  });
});
