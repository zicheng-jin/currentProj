import { fetchGet } from "../api";
import { ENDPOINTS } from "../apiEndpoints";

type IframeDetails = {
  consentUrl: string;
  redirectUrl: string;
};

export const getIframeInitiateSrc = async (url: string) => {
  return fetchGet<IframeDetails>(url);
};
