import { fetchGet } from "../api";
import { ENDPOINTS } from "../apiEndpoints";

export const getIframeInitiateSrc = async () => {
    return fetchGet<{ iframeUrl: string }>(ENDPOINTS.connect);
}