/**
 * Unit Tests: Derived State Logic
 *
 * Purpose: Protect derived state calculations
 * Derived state should never be manually stored.
 * Tests enforce that discipline.
 */

import { useApplicationStore } from "../application-store";
import type {
  ApplicationData,
  StepCompletion,
} from "@/features/onboarding/types/application";

// Helper to reset store between tests
const resetStore = () => {
  useApplicationStore.getState().reset();
};

describe("Derived State Logic - Step Completion Calculation", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should mark step 1 as complete when personal info is set", () => {
    const store = useApplicationStore.getState();

    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    const completion = store.getCompletionStatus();
    expect(completion.step1).toBe(true);
    expect(completion.step2).toBe(false);
    expect(completion.step3).toBe(false);
  });

  it("should mark step 2 as complete when professional details are set", () => {
    const store = useApplicationStore.getState();

    store.setProfessionalDetails({
      yearsOfExperience: 5,
      skills: ["JavaScript"],
      currentRole: "Developer",
      noticePeriod: "2 weeks",
    });

    const completion = store.getCompletionStatus();
    expect(completion.step2).toBe(true);
  });

  it("should mark step 3 as complete when documents are set", () => {
    const store = useApplicationStore.getState();

    const mockFile = new File(["content"], "resume.pdf", {
      type: "application/pdf",
    });
    store.setDocuments({
      resume: mockFile,
      coverLetter: null,
    });

    const completion = store.getCompletionStatus();
    expect(completion.step3).toBe(true);
  });
});

describe("Derived State Logic - Can Proceed to Next Step", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should allow proceeding from step 1 to step 2 when step 1 is complete", () => {
    const store = useApplicationStore.getState();

    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    const completion = store.getCompletionStatus();
    // Contract: Can proceed if current step is complete
    const canProceed = completion.step1;
    expect(canProceed).toBe(true);
  });

  it("should not allow proceeding from step 2 to step 3 when step 2 is incomplete", () => {
    const store = useApplicationStore.getState();

    // Step 1 complete, step 2 incomplete
    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    const completion = store.getCompletionStatus();
    const canProceed = completion.step2;
    expect(canProceed).toBe(false);
  });
});

describe("Derived State Logic - Is Form Submittable", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should be submittable when all steps are complete", () => {
    const store = useApplicationStore.getState();

    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    store.setProfessionalDetails({
      yearsOfExperience: 5,
      skills: ["JavaScript"],
      currentRole: "Developer",
      noticePeriod: "2 weeks",
    });

    const mockFile = new File(["content"], "resume.pdf", {
      type: "application/pdf",
    });
    store.setDocuments({
      resume: mockFile,
      coverLetter: null,
    });

    const completion = store.getCompletionStatus();
    const isSubmittable =
      completion.step1 && completion.step2 && completion.step3;
    expect(isSubmittable).toBe(true);
  });

  it("should not be submittable when any step is incomplete", () => {
    const store = useApplicationStore.getState();

    // Only step 1 complete
    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    const completion = store.getCompletionStatus();
    const isSubmittable =
      completion.step1 && completion.step2 && completion.step3;
    expect(isSubmittable).toBe(false);
  });
});

describe("Derived State Logic - Progress Percentage Computation", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should calculate 0% when no steps are complete", () => {
    const completion = useApplicationStore.getState().getCompletionStatus();
    const progress =
      ((Number(completion.step1) +
        Number(completion.step2) +
        Number(completion.step3)) /
        3) *
      100;
    expect(progress).toBe(0);
  });

  it("should calculate 33% when step 1 is complete", () => {
    const store = useApplicationStore.getState();
    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    const completion = store.getCompletionStatus();
    const progress =
      ((Number(completion.step1) +
        Number(completion.step2) +
        Number(completion.step3)) /
        3) *
      100;
    expect(progress).toBeCloseTo(33.33, 1);
  });

  it("should calculate 100% when all steps are complete", () => {
    const store = useApplicationStore.getState();

    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    store.setProfessionalDetails({
      yearsOfExperience: 5,
      skills: ["JavaScript"],
      currentRole: "Developer",
      noticePeriod: "2 weeks",
    });

    const mockFile = new File(["content"], "resume.pdf", {
      type: "application/pdf",
    });
    store.setDocuments({
      resume: mockFile,
      coverLetter: null,
    });

    const completion = store.getCompletionStatus();
    const progress =
      ((Number(completion.step1) +
        Number(completion.step2) +
        Number(completion.step3)) /
        3) *
      100;
    expect(progress).toBe(100);
  });
});

describe("State Persistence Contract", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should update lastSaved timestamp when data is set", () => {
    const store = useApplicationStore.getState();
    // Reset to ensure clean state
    store.reset();

    const beforeTime = Date.now();

    store.setPersonalInfo({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "United States",
    });

    // Get fresh state after update
    const updatedStore = useApplicationStore.getState();
    const afterTime = Date.now();
    const lastSaved = updatedStore.lastSaved;

    // Contract: lastSaved should be set after data is saved
    expect(lastSaved).not.toBeNull();
    if (lastSaved !== null) {
      expect(lastSaved).toBeGreaterThanOrEqual(beforeTime);
      expect(lastSaved).toBeLessThanOrEqual(afterTime);
    }
  });
});
