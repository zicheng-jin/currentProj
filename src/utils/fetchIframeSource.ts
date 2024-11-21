import { getIframeInitiateSrc } from "../api/services/iframeService";

export const fetchIframeSource = async (
  setLoading: (loading: boolean, message?: string) => void,
  setVendorType: (type: string) => void,
  setIframeSrc: (src: string) => void
) => {
  const clientId = localStorage.getItem("client id");
  const requestId = localStorage.getItem("request id");
  const linkId = localStorage.getItem("link id");

  if (!clientId || !requestId || !linkId) {
    throw new Error("Missing required parameters");
  }

  const url = `/api/link/initiate?iframe=true&client_id=${encodeURIComponent(
    clientId
  )}&request_id=${encodeURIComponent(requestId)}&link_id=${encodeURIComponent(
    linkId
  )}`;

  try {
    setLoading(true, "Please sit tight. We are on our way to Tink.");
    const { consentUrl } = await getIframeInitiateSrc(url);
    if (consentUrl) {
      if (consentUrl.includes("finicity.com")) {
        setVendorType("FINICITY");
        setIframeSrc(consentUrl);
      } else if (consentUrl.includes("tink.se")) {
        setVendorType("TINK");
        setIframeSrc(consentUrl);
      }
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};
