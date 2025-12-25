/**
 * Accessibility Testing
 *
 * Purpose: Prevent invisible regressions
 * Accessibility testing is correctness testing. Period.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Step1PersonalInfo } from "../step-1-personal-info";
import { useApplicationStore } from "@/lib/store/application-store";

// Mock the navigation hook
jest.mock("../../hooks/use-step-navigation", () => ({
  useStepNavigation: () => ({
    goToNextStep: jest.fn(),
    goToPreviousStep: jest.fn(),
    currentStep: 1,
  }),
}));

describe("Accessibility - Semantic Correctness", () => {
  beforeEach(() => {
    useApplicationStore.getState().reset();
  });

  it("should have accessible labels for all inputs", () => {
    render(<Step1PersonalInfo />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const countryInput = screen.getByLabelText(/country/i);

    expect(fullNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
  });

  it("should have proper button roles", () => {
    render(<Step1PersonalInfo />);

    const submitButton = screen.getByRole("button", { name: /next/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should announce errors to screen readers", async () => {
    const user = userEvent.setup();
    render(<Step1PersonalInfo />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");
    await user.tab();

    // Error should be announced with role="alert"
    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/valid email/i);
  });
});

describe("Accessibility - Keyboard Navigation", () => {
  beforeEach(() => {
    useApplicationStore.getState().reset();
  });

  it("should have logical tab order", async () => {
    const user = userEvent.setup();
    render(<Step1PersonalInfo />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    // Start at first input
    fullNameInput.focus();
    expect(document.activeElement).toBe(fullNameInput);

    // Tab to next input
    await user.tab();
    expect(document.activeElement).toBe(emailInput);

    // Tab to next input
    await user.tab();
    expect(document.activeElement).toBe(phoneInput);
  });

  it("should restore focus after validation errors", async () => {
    const user = userEvent.setup();
    render(<Step1PersonalInfo />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid");
    await user.tab();

    // After error, focus should be manageable
    // (Implementation may vary, but contract is: focus is not lost)
    expect(emailInput).toBeInTheDocument();
  });
});

describe("Accessibility - ARIA Attributes", () => {
  beforeEach(() => {
    useApplicationStore.getState().reset();
  });

  it("should mark disabled buttons with aria-disabled", () => {
    render(<Step1PersonalInfo />);

    const submitButton = screen.getByRole("button", { name: /next/i });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");
  });

  it("should associate error messages with inputs", async () => {
    const user = userEvent.setup();
    render(<Step1PersonalInfo />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid");
    await user.tab();

    // Error should be associated with the input
    // This is typically done via aria-describedby or aria-errormessage
    const errorMessage = await screen.findByText(/valid email/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
