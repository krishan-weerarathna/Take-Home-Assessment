import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';
import { Task } from '../types/task.types';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'Description One',
    status: 'pending',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Description Two',
    status: 'pending',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'Task Three',
    description: 'Description Three',
    status: 'done',
    created_at: '2024-01-03T00:00:00Z',
  },
];

describe('TaskList', () => {
  const mockCompleteTask = jest.fn();

  beforeEach(() => {
    mockCompleteTask.mockClear();
  });

  it('renders "No tasks available" when the tasks array is empty', () => {
    render(<TaskList tasks={[]} completeTask={mockCompleteTask} />);
    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });

  it('does not render "No tasks available" when tasks are present', () => {
    render(<TaskList tasks={mockTasks} completeTask={mockCompleteTask} />);
    expect(screen.queryByText('No tasks available')).not.toBeInTheDocument();
  });

  it('renders a task item for each task provided', () => {
    render(<TaskList tasks={mockTasks} completeTask={mockCompleteTask} />);
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
    expect(screen.getByText('Task Three')).toBeInTheDocument();
  });

  it('renders the correct number of Done buttons matching task count', () => {
    render(<TaskList tasks={mockTasks} completeTask={mockCompleteTask} />);
    expect(screen.getAllByRole('button', { name: /done/i })).toHaveLength(3);
  });

  it('renders task descriptions', () => {
    render(<TaskList tasks={mockTasks} completeTask={mockCompleteTask} />);
    expect(screen.getByText('Description One')).toBeInTheDocument();
    expect(screen.getByText('Description Two')).toBeInTheDocument();
  });

  it('renders a single task correctly', () => {
    const singleTask = [mockTasks[0]];
    render(<TaskList tasks={singleTask} completeTask={mockCompleteTask} />);
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /done/i })).toHaveLength(1);
  });
});
