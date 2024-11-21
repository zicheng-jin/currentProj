import { renderHook } from "@testing-library/react-hooks";
import { useTinkIframe } from "../hooks/useTinkIframe";
import { receiveMessage } from "../utils/iframeUtils";

jest.mock("../utils/iframeUtils", () => ({
  receiveMessage: jest.fn(),
}));

describe("useTinkIframe", () => {
  const setLoading = jest.fn();
  const navigate = jest.fn();
  const redirectUrl = "https://redirect.com";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call receiveMessage with correct arguments when a message event is received", () => {
    renderHook(() => useTinkIframe(setLoading, navigate, redirectUrl));

    const event = new MessageEvent("message", { data: "test" });
    window.dispatchEvent(event);

    expect(receiveMessage).toHaveBeenCalledWith(
      event,
      setLoading,
      navigate,
      redirectUrl
    );
  });

  it("should add and remove event listener for message events", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useTinkIframe(setLoading, navigate, redirectUrl)
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "message",
      expect.any(Function),
      false
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "message",
      expect.any(Function)
    );
  });
});
