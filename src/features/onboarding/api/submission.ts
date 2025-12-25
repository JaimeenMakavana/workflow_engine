import type { CompleteApplicationData } from "../types/schemas";

export interface SubmissionResult {
  success: boolean;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

// Mock submission function with various failure modes
export async function submitApplication(
  data: CompleteApplicationData
): Promise<SubmissionResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate different failure scenarios (for testing)
  const random = Math.random();

  // 10% chance of network error
  if (random < 0.1) {
    throw new Error("Network error: Failed to connect to server");
  }

  // 5% chance of timeout
  if (random < 0.15) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return {
      success: false,
      error: "Request timeout. Please try again.",
    };
  }

  // 5% chance of validation error
  if (random < 0.2) {
    return {
      success: false,
      validationErrors: {
        email: ["This email is already registered"],
        phone: ["Invalid phone number format for selected country"],
      },
    };
  }

  // 5% chance of server error
  if (random < 0.25) {
    return {
      success: false,
      error: "Server error: Please try again later",
    };
  }

  // Success case
  return {
    success: true,
  };
}

// Retry wrapper with exponential backoff
export async function submitWithRetry(
  data: CompleteApplicationData,
  maxRetries = 3
): Promise<SubmissionResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await submitApplication(data);

      // If it's a validation error, don't retry
      if (!result.success && result.validationErrors) {
        return result;
      }

      // If it's a timeout or server error, retry
      if (!result.success && result.error) {
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        return result;
      }

      // Success
      return result;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  return {
    success: false,
    error:
      lastError?.message ||
      "Failed to submit application after multiple attempts",
  };
}

