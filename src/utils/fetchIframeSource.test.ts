import { fetchIframeSource } from "./fetchIframeSource";
import { getIframeInitiateSrc } from "../api/services/iframeService";

// src/utils/fetchIframeSource.test.ts

jest.mock("../api/services/iframeService", () => ({
  getIframeInitiateSrc: jest.fn(),
}));

describe("fetchIframeSource", () => {
  const setLoading = jest.fn();
  const setVendorType = jest.fn();
  const setIframeSrc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(jest.fn());
  });

  it("should throw an error if required parameters are missing", async () => {
    await expect(
      fetchIframeSource(setLoading, setVendorType, setIframeSrc)
    ).rejects.toThrow("Missing required parameters");
  });

  it("should set loading and fetch iframe source successfully for Finicity", async () => {
    localStorage.setItem("client id", "client123");
    localStorage.setItem("request id", "request123");
    localStorage.setItem("link id", "link123");

    const mockConsentUrl = "https://finicity.com/consent";
    (getIframeInitiateSrc as jest.Mock).mockResolvedValue({
      consentUrl: mockConsentUrl,
    });

    await fetchIframeSource(setLoading, setVendorType, setIframeSrc);

    expect(setLoading).toHaveBeenCalledWith(
      true,
      "Please sit tight. We are on our way to Tink."
    );
    expect(setVendorType).toHaveBeenCalledWith("FINICITY");
    expect(setIframeSrc).toHaveBeenCalledWith(mockConsentUrl);
  });

  it("should set loading and fetch iframe source successfully for Tink", async () => {
    localStorage.setItem("client id", "client123");
    localStorage.setItem("request id", "request123");
    localStorage.setItem("link id", "link123");

    const mockConsentUrl = "https://tink.se/consent";
    (getIframeInitiateSrc as jest.Mock).mockResolvedValue({
      consentUrl: mockConsentUrl,
    });

    await fetchIframeSource(setLoading, setVendorType, setIframeSrc);

    expect(setLoading).toHaveBeenCalledWith(
      true,
      "Please sit tight. We are on our way to Tink."
    );
    expect(setVendorType).toHaveBeenCalledWith("TINK");
    expect(setIframeSrc).toHaveBeenCalledWith(mockConsentUrl);
  });

  it("should handle errors gracefully", async () => {
    localStorage.setItem("client id", "client123");
    localStorage.setItem("request id", "request123");
    localStorage.setItem("link id", "link123");

    const mockError = new Error("Network error");
    (getIframeInitiateSrc as jest.Mock).mockRejectedValue(mockError);

    await fetchIframeSource(setLoading, setVendorType, setIframeSrc);

    expect(setLoading).toHaveBeenCalledWith(
      true,
      "Please sit tight. We are on our way to Tink."
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching data",
      mockError
    );
  });
});
