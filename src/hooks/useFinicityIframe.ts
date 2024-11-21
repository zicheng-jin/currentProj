import { useEffect } from "react";
import { launchFinicityConnect } from "../utils/finicityUtils";

export const useFinicityIframe = (
  iframeSrc: string,
  redirectUrl: string | null,
  setLoading: (loading: boolean, message?: string) => void,
  navigate: (path: string) => void
) => {
  useEffect(() => {
    if (iframeSrc.includes("finicity")) {
      launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);
    }
  }, [iframeSrc, redirectUrl, setLoading, navigate]);
};
