import { fetchGet } from "../api";
import { ENDPOINTS } from "../apiEndpoints";
import { getIframeInitiateSrc } from "./iframeService";

// Mock the fetchGet function
jest.mock("../api", () => ({
    fetchGet: jest.fn(),
}));

describe("getIframeInitiateSrc", () => {
    it("should call fetchGet with the correct endpoint", async () => {
        await getIframeInitiateSrc();
        expect(fetchGet).toHaveBeenCalledWith(ENDPOINTS.connect);
    });

    it("should return the expected data", async () => {
        const mockData = { iframeUrl: "https://example.com" };
        (fetchGet as jest.Mock).mockResolvedValue(mockData);

        const result = await getIframeInitiateSrc();
        expect(result).toEqual(mockData);
    });
});