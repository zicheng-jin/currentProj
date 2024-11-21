import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../hooks/useLoader";
import { useIframeMessageHandler } from "../hooks/useIframeMessageHandler";
import { fetchIframeSource } from "../utils/fetchIframeSource";
import { useFinicityIframe } from "../hooks/useFinicityIframe";
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

  useIframeMessageHandler(setLoading, navigate, redirectUrl, setIsShowIframe);

  useEffect(() => {
    fetchIframeSource(setLoading, setVendorType, setIframeSrc);
  }, []);

  useFinicityIframe(iframeSrc, redirectUrl, setLoading, navigate);

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
