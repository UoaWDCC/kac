import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#0b2d4a",
          color: "#ffffff",
          fontFamily: "Amaranth, sans-serif",
          borderRadius: "8px",
        },
        success: {
          iconTheme: {
            primary: "#f2b719",
            secondary: "#0b2d4a",
          },
        },
        error: {
          iconTheme: {
            primary: "#f2b719",
            secondary: "#0b2d4a",
          },
        },
      }}
    />
  );
}
