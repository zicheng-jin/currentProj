import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../hooks/useLoader";
import { getIframeInitiateSrc } from "../api/services/iframeService";
import "../styles/VendorIframe.css";

interface Props {
  setIsShowIframe: (bool: boolean) => void;
}

const VendorIframe: React.FC<Props> = ({ setIsShowIframe }) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const [vendorType, setVendorType] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const redirectUrl = localStorage.getItem("redirectUrl");

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);

    async function receiveMessage(event: { origin: string; data: string }) {
      if (event.origin !== "https://link.production.jersey.tink.se") {
        return;
      }

      console.log(event);

      const { type, data, error } = JSON.parse(event.data);

      if (type === "code") {
        // Handle authorization code response from Tink Link
        const code = data;
        console.log(`Tink Link returned with authorization code: ${code}`);
      } else if (type === "error") {
        // Handle error response from Tink Link
        const { status } = error;
        if (status === "USER_CANCELLED") {
          // setIsshouIframe(false);
          setLoading(true, "Sit Tight, we are going back to merchant.");
          setTimeout(() => {
            window.location.href = redirectUrl ?? "";
          }, 3000);
        } else {
          navigate("/error");
        }
      } else if (type === "credentials") {
        // Handle credentials error response from Tink Link
        const credentialsId = data;
        console.log(
          `Authentication failed with credentials identifier: ${credentialsId} with error status: ${error.status} and error message: ${error.message}.`
        );
      } else if (type === "status") {
        // Observe Tink Link loading state (optional)
        const { loading } = data;
        console.log(
          `Tink Link has ${loading ? "shown" : "hidden"} the loading overlay.`
        );
      } else if (type === "application-event") {
        const { event } = data;
        if (event === "INITIALIZED") {
          setLoading(false);
        }
      } else if (type === "account_verification_report_id") {
        setLoading(true, "Account Link Successfully!");
        setTimeout(() => {
          window.location.href = redirectUrl ?? "";
        }, 10000);

        setIsShowIframe(false);
      } else {
        // More message types may be sent or added in the future (these can safely be ignored)
      }
    }
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  useEffect(() => {
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

    const fetchData = async () => {
      try {
        setLoading(true, "Please sit tight. We are on our way to Tink.");
        const { consentUrl } = await getIframeInitiateSrc(url);
        if (consentUrl) {
          if (consentUrl.includes("finicity.com")) {
            setVendorType("FINICITY");
            setIframeSrc(consentUrl);
          }
          // setFrameSrc(data.consentUrl);
        } else if (consentUrl.includes("tink.se")) {
          setVendorType("TINK");
          setIframeSrc(consentUrl);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (vendorType === "FINICITY") {
      (window as any).finicityConnect.launch(iframeSrc, {
        selector: "#connect-container",
        overlay: "position: absolute;top: ;left: ;width: 108%;height: 100%",
        success: (event: any) => {
          console.log("Yay! User went through Connect", event);
        },
        cancel: (event: any) => {
          console.log("The user cancelled the iframe", event);
        },
        error: (error: any) => {
          navigate("/error");
          console.error(
            "Some runtime error was generated during inside Connect",
            error
          );
        },
        loaded: () => {
          console.log(
            "This gets called only once after the iframe has finished loading "
          );
        },
        route: (event: any) => {
          if (event.data.screen === "done") {
            setLoading(true, "Account LInk Successfully!");
            setTimeout(() => {
              window.location.href = redirectUrl ?? "";
            }, 10000);
          }
          console.log(
            "This is called as the user navigates through Connect ",
            event
          );
        },
        user: (event: any) => {
          if (event.data.action === "Initialize") {
            setLoading(false);
          }
          console.log(
            "This is called as the user interacts with Connect ~",
            event
          );
        },
      });
    }
  }, [vendorType]);

  return (
    <>
      {vendorType === "TINK" && (
        <iframe
          id="inlineFrameExample"
          title="Inline Frame Example"
          width="100%"
          height="95%"
          className="vendor-iframe"
          src={iframeSrc}
          ref={iframeRef}
        ></iframe>
      )}
      {vendorType === "FINICITY" && (
        <div
          id="finicity-connect-container"
          style={{ width: "100%", height: "100%" }}
        ></div>
      )}
    </>
  );
};

export default VendorIframe;
