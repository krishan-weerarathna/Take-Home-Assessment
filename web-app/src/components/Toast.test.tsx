import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing when message is empty", () => {
    const { container } = render(<Toast message="" onClose={mockOnClose} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  it("renders the message when provided", () => {
    render(<Toast message="Task created successfully" onClose={mockOnClose} />);
    expect(screen.getByText("Task created successfully")).toBeInTheDocument();
  });

  it('applies the "success" class by default when no type is given', () => {
    const { container } = render(
      <Toast message="Hello!" onClose={mockOnClose} />,
    );
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass("toast");
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass("success");
  });

  it('applies the correct type class when type is "success"', () => {
    const { container } = render(
      <Toast message="Done!" type="success" onClose={mockOnClose} />,
    );
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass("success");
  });

  it('applies the "error" class when type is "error"', () => {
    const { container } = render(
      <Toast
        message="Something went wrong"
        type="error"
        onClose={mockOnClose}
      />,
    );
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass("toast");
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass("error");
  });

  it("renders the close button with × character", () => {
    render(<Toast message="Test message" onClose={mockOnClose} />);
    expect(screen.getByRole("button")).toHaveTextContent("×");
  });

  it("calls onClose when the close button is clicked", () => {
    render(<Toast message="Click to close" onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("auto-dismisses by calling onClose after 3000ms", () => {
    render(<Toast message="Auto close" onClose={mockOnClose} />);
    expect(mockOnClose).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose before 3000ms have elapsed", () => {
    render(<Toast message="Not yet" onClose={mockOnClose} />);
    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("does not set a timer when message is empty", () => {
    render(<Toast message="" onClose={mockOnClose} />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("resets the auto-dismiss timer when the message changes", () => {
    const { rerender } = render(
      <Toast message="First message" onClose={mockOnClose} />,
    );
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    rerender(<Toast message="Second message" onClose={mockOnClose} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    // timer restarted — should not have fired yet (only 2s into the new 3s window)
    expect(mockOnClose).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
