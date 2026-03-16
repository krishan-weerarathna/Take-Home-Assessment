import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskFrom from './TaskFrom';

describe('TaskFrom', () => {
  const mockAddTask = jest.fn();

  beforeEach(() => {
    mockAddTask.mockClear();
  });

  it('renders the form heading', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    expect(screen.getByText('Add a Task')).toBeInTheDocument();
  });

  it('renders title input, description textarea, and submit button', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('shows both validation errors when submitted empty', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('shows only title error when description is filled but title is empty', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Some description' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('shows only description error when title is filled but description is empty', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Some title' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('calls addTask with correct data on valid submit', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'My Task' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'My Description' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(mockAddTask).toHaveBeenCalledTimes(1);
    expect(mockAddTask).toHaveBeenCalledWith({
      title: 'My Task',
      description: 'My Description',
    });
  });

  it('clears the fields after a valid submit', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    const titleInput = screen.getByPlaceholderText('Title') as HTMLInputElement;
    const descInput = screen.getByPlaceholderText('Description') as HTMLTextAreaElement;
    fireEvent.change(titleInput, { target: { value: 'My Task' } });
    fireEvent.change(descInput, { target: { value: 'My Description' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(titleInput.value).toBe('');
    expect(descInput.value).toBe('');
  });

  it('does not submit when values are whitespace only', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(mockAddTask).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });

  it('does not show validation errors before submission', () => {
    render(<TaskFrom addTask={mockAddTask} />);
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
  });
});
