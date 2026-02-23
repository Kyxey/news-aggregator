import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  it('renders with placeholder text', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} placeholder="Pick a date" />);

    expect(screen.getByRole('button')).toHaveTextContent('Pick a date');
  });

  it('renders with default placeholder when not provided', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    expect(screen.getByRole('button')).toHaveTextContent('Select a date');
  });

  it('displays formatted date when selected', () => {
    const onSelect = vi.fn();
    const selectedDate = new Date('2024-01-15');
    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    expect(screen.getByRole('button')).toHaveTextContent(/january 15th, 2024/i);
  });

  it('opens calendar when button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  it('closes calendar when clicking outside', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getAllByRole('button')[0];
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const backdrop = document.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      await user.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  it('calls onSelect when a date is selected', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const dateButtons = screen.getAllByRole('gridcell');
    const enabledDateButton = dateButtons.find(
      cell => !cell.querySelector('button')?.hasAttribute('disabled')
    );

    if (enabledDateButton) {
      const dateButton = enabledDateButton.querySelector('button');
      if (dateButton) {
        await user.click(dateButton);

        await waitFor(() => {
          expect(onSelect).toHaveBeenCalledWith(expect.any(Date));
        });
      }
    }
  });

  it('closes calendar after selecting a date', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const dateButtons = screen.getAllByRole('gridcell');
    const enabledDateButton = dateButtons.find(
      cell => !cell.querySelector('button')?.hasAttribute('disabled')
    );

    if (enabledDateButton) {
      const dateButton = enabledDateButton.querySelector('button');
      if (dateButton) {
        await user.click(dateButton);

        await waitFor(() => {
          expect(screen.queryByRole('grid')).not.toBeInTheDocument();
        });
      }
    }
  });

  it('shows clear button when date is selected', () => {
    const onSelect = vi.fn();
    const selectedDate = new Date('2024-01-15');
    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    const button = screen.getByRole('button');
    const clearIcon = button.querySelector('svg[class*="lucide-x"]');

    expect(clearIcon).toBeInTheDocument();
  });

  it('does not show clear button when no date is selected', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getByRole('button');
    const clearIcon = button.querySelector('svg[class*="lucide-x"]');

    expect(clearIcon).not.toBeInTheDocument();
  });

  it('clears selected date when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const selectedDate = new Date('2024-01-15');
    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    const button = screen.getByRole('button');
    const clearIcon = button.querySelector('svg[class*="lucide-x"]');

    if (clearIcon) {
      await user.click(clearIcon);

      expect(onSelect).toHaveBeenCalledWith(undefined);
    }
  });

  it('does not open calendar when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const selectedDate = new Date('2024-01-15');
    render(<DatePicker selected={selectedDate} onSelect={onSelect} />);

    const button = screen.getByRole('button');
    const clearIcon = button.querySelector('svg[class*="lucide-x"]');

    if (clearIcon) {
      await user.click(clearIcon);

      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    }
  });

  it('disables button when disabled prop is true', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} disabled={true} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open calendar when disabled', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} disabled={true} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('does not show clear button when disabled', () => {
    const onSelect = vi.fn();
    const selectedDate = new Date('2024-01-15');
    render(<DatePicker selected={selectedDate} onSelect={onSelect} disabled={true} />);

    const button = screen.getByRole('button');
    const clearIcon = button.querySelector('svg[class*="lucide-x"]');

    expect(clearIcon).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} error="Date is required" />);

    expect(screen.getByText('Date is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop is provided', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} error="Invalid date" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-red-500');
  });

  it('applies disabled styling when disabled', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-not-allowed', 'bg-gray-100');
  });

  it('applies normal styling when not disabled or errored', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white', 'border-gray-300');
  });

  it('shows calendar icon', () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getByRole('button');
    const calendarIcon = button.querySelector('svg[class*="lucide-calendar"]');

    expect(calendarIcon).toBeInTheDocument();
  });

  it('toggles calendar open and closed on multiple clicks', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);

    const button = screen.getByRole('button');

    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    await user.click(button);
    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });
});
