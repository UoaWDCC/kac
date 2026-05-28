import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--color-blue-medium)",
          color: "#ffffff",
          fontFamily: "var(--font-sans)",
          borderRadius: "var(--radius-lg)",
        },
        success: {
          iconTheme: {
            primary: "var(--color-yellow-dark)",
            secondary: "var(--color-blue-medium)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-yellow-dark)",
            secondary: "var(--color-blue-medium)",
          },
        },
      }}
    />
  );
}
