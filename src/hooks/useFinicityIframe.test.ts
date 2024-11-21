import { renderHook } from "@testing-library/react-hooks";
import { useFinicityIframe } from "../hooks/useFinicityIframe";
import { launchFinicityConnect } from "../utils/finicityUtils";

jest.mock("../utils/finicityUtils", () => ({
  launchFinicityConnect: jest.fn(),
}));

describe("useFinicityIframe", () => {
  const setLoading = jest.fn();
  const navigate = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call launchFinicityConnect with correct arguments when iframeSrc includes "finicity"', () => {
    const iframeSrc = "https://example.com/finicity";
    const redirectUrl = "https://redirect.com";

    renderHook(() =>
      useFinicityIframe(iframeSrc, redirectUrl, setLoading, navigate)
    );

    expect(launchFinicityConnect).toHaveBeenCalledWith(
      iframeSrc,
      redirectUrl,
      setLoading,
      navigate
    );
  });

  it('should not call launchFinicityConnect when iframeSrc does not include "finicity"', () => {
    const iframeSrc = "https://example.com/other";
    const redirectUrl = "https://redirect.com";

    renderHook(() =>
      useFinicityIframe(iframeSrc, redirectUrl, setLoading, navigate)
    );

    expect(launchFinicityConnect).not.toHaveBeenCalled();
  });
});
