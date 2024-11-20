import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../hooks/useLoader";
import { constructUrl } from "../utils/urlUtils";
import useFetchData from "../hooks/useFetchData";
import "../styles/VendorIframe.css";

interface Props {
  setIsShowIframe: (bool: boolean) => void;
}

const VendorIframe: React.FC<Props> = ({ setIsShowIframe }) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const REDIRECT_URL = localStorage.getItem("redirectUrl") ?? "";

  const EVENT_TYPES = {
    CODE: "code",
    ERROR: "error",
    CREDENTIALS: "credentials",
    STATUS: "status",
    APPLICATION_EVENT: "application-event",
    ACCOUNT_VERIFICATION_REPORT_ID: "account_verification_report_id",
  };

  const receiveMessage = useCallback(
    async (event: { origin: string; data: string }) => {
      if (event.origin !== "https://link.production.jersey.tink.se") {
        return;
      }

      console.log(event);

      const { type, data, error } = JSON.parse(event.data);

      switch (type) {
        case EVENT_TYPES.CODE:
          console.log(`Tink Link returned with authorization code: ${data}`);
          break;

        case EVENT_TYPES.ERROR:
          if (error.status === "USER_CANCELLED") {
            setIsShowIframe(false);
            setLoading(true, "Sit Tight, we are going back to merchant.");
            setTimeout(() => {
              window.location.href = REDIRECT_URL;
            }, 3000);
          } else {
            navigate("/error");
          }
          break;

        case EVENT_TYPES.CREDENTIALS:
          console.log(
            `Authentication failed with credentials identifier: ${data} with error status: ${error.status} and error message: ${error.message}.`
          );
          break;

        case EVENT_TYPES.STATUS:
          console.log(
            `Tink Link has ${
              data.loading ? "shown" : "hidden"
            } the loading overlay.`
          );
          break;

        case EVENT_TYPES.APPLICATION_EVENT:
          if (data.event === "INITIALIZED") {
            setLoading(false);
          }
          break;

        case EVENT_TYPES.ACCOUNT_VERIFICATION_REPORT_ID:
          setLoading(true, "Account Link Successfully!");
          setTimeout(() => {
            window.location.href = REDIRECT_URL;
          }, 3000);
          break;

        default:
          break;
      }
    },
    [navigate, setIsShowIframe, setLoading, REDIRECT_URL]
  );

  const clientId = "your-client-id"; // Replace with actual clientId
  const requestId = "your-request-id"; // Replace with actual requestId
  const linkId = "your-link-id"; // Replace with actual linkId

  const url = constructUrl(clientId, requestId, linkId);
  useFetchData(url);

  return <div id="connect-container" />;
};

export default VendorIframe;
