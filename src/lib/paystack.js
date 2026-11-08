import PaystackPop from "@paystack/inline-js";

// Opens Paystack's secure popup for a transaction our server already created.
// Card and bank details are entered on Paystack, never on this site.
export function payWithPaystack(accessCode) {
  return new Promise((resolve, reject) => {
    new PaystackPop().resumeTransaction(accessCode, {
      onSuccess: (transaction) => resolve(transaction),
      onCancel: () => reject(Object.assign(new Error("Payment window closed before paying."), { cancelled: true })),
      onError: (err) => reject(new Error(err?.message || "Paystack could not load. Check your connection and try again.")),
    });
  });
}

// Firebase callable errors carry the server's message; fall back to something readable.
export function friendlyError(err) {
  if (err?.code === "functions/internal" || !err?.message) return "Something went wrong. Please try again.";
  return err.message;
}
