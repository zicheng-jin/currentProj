import { useEffect } from "react";
import { receiveMessage } from "../utils/iframeUtils";

export const useTinkIframe = (
  setLoading: (loading: boolean, message?: string) => void,
  navigate: (path: string) => void,
  redirectUrl: string | null
) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      receiveMessage(event, setLoading, navigate, redirectUrl);
    };

    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setLoading, navigate, redirectUrl]);
};
