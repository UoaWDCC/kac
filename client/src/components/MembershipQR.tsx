import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../api";

const MembershipQR = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await api.get("/qr/generate");
        setUrl(res.data.url);
      } catch {
        setError("Failed to load membership QR. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, []);

  if (loading) return <p>Loading membership card...</p>;
  if (error) return <p>{error}</p>;
  if (!url) return <p>No QR code available.</p>;

  return <QRCodeSVG value={url} size={120} />;
};

export default MembershipQR;
