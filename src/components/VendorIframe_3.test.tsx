import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import VendorIframe from "../components/VendorIframe_3";
import { useLoader } from "../hooks/useLoader";
import { useNavigate } from "react-router-dom";
import { useIframeMessageHandler } from "../hooks/useIframeMessageHandler";
import { fetchIframeSource } from "../utils/fetchIframeSource";
import { useFinicityIframe } from "../hooks/useFinicityIframe";

jest.mock("../hooks/useLoader", () => ({
  useLoader: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useIframeMessageHandler", () => ({
  useIframeMessageHandler: jest.fn(),
}));

jest.mock("../utils/fetchIframeSource", () => ({
  fetchIframeSource: jest.fn(),
}));

jest.mock("../hooks/useFinicityIframe", () => ({
  useFinicityIframe: jest.fn(),
}));

describe("VendorIframe", () => {
  const setIsShowIframe = jest.fn();
  const setLoading = jest.fn();
  const navigate = jest.fn();

  beforeEach(() => {
    (useLoader as jest.Mock).mockReturnValue({ setLoading });
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (useIframeMessageHandler as jest.Mock).mockImplementation(() => {});
    (fetchIframeSource as jest.Mock).mockImplementation(
      (setLoading, setVendorType, setIframeSrc) => {
        setVendorType("TINK");
        setIframeSrc("https://example.com/tink");
      }
    );
    (useFinicityIframe as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch iframe source and set it correctly", () => {
    render(<VendorIframe setIsShowIframe={setIsShowIframe} />);

    expect(fetchIframeSource).toHaveBeenCalledWith(
      setLoading,
      expect.any(Function),
      expect.any(Function)
    );
    expect(screen.getByTitle("Inline Frame Example")).toHaveAttribute(
      "src",
      "https://example.com/tink"
    );
  });

  it("should render iframe with correct source based on vendor type", () => {
    render(<VendorIframe setIsShowIframe={setIsShowIframe} />);

    expect(screen.getByTitle("Inline Frame Example")).toBeInTheDocument();
    expect(screen.getByTitle("Inline Frame Example")).toHaveAttribute(
      "src",
      "https://example.com/tink"
    );
  });
});
