import { receiveMessage } from "./iframeUtils";

describe("receiveMessage", () => {
  const setLoading = jest.fn();
  const navigate = jest.fn();
  const redirectUrl = "https://example.com/redirect";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should ignore messages from unknown origins", async () => {
    const event = {
      origin: "https://unknown.origin",
      data: JSON.stringify({ type: "code", data: "some-code" }),
    };

    await receiveMessage(event, setLoading, navigate, redirectUrl);

    expect(setLoading).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("should handle 'code' message type", async () => {
    const event = {
      origin: "https://link.production.jersey.tink.se",
      data: JSON.stringify({ type: "code", data: "some-code" }),
    };

    await receiveMessage(event, setLoading, navigate, redirectUrl);

    expect(console.log).toHaveBeenCalledWith(
      "Tink Link returned with authorization code: some-code"
    );
  });

  it("should handle 'error' message type with USER_CANCELLED status", async () => {
    jest.useFakeTimers();
    const event = {
      origin: "https://link.production.jersey.tink.se",
      data: JSON.stringify({
        type: "error",
        error: { status: "USER_CANCELLED" },
      }),
    };

    Object.defineProperty(window, "location", {
      value: {
        href: redirectUrl,
      },
      writable: true,
    });

    await receiveMessage(event, setLoading, navigate, redirectUrl);

    expect(setLoading).toHaveBeenCalledWith(
      true,
      "Sit Tight, we are going back to merchant."
    );
    jest.advanceTimersByTime(3000);
    expect(window.location.href).toBe(redirectUrl);
    jest.useRealTimers();
  });

  it("should handle 'error' message type with other status", async () => {
    const event = {
      origin: "https://link.production.jersey.tink.se",
      data: JSON.stringify({
        type: "error",
        error: { status: "OTHER_ERROR" },
      }),
    };

    await receiveMessage(event, setLoading, navigate, redirectUrl);

    expect(navigate).toHaveBeenCalledWith("/error");
  });

  it("should handle 'credentials' message type", async () => {
    const event = {
      origin: "https://link.production.jersey.tink.se",
      data: JSON.stringify({
        type: "credentials",
        data: "some-credentials-id",
        error: { status: "some-status", message: "some-message" },
      }),
    };

    await receiveMessage(event, setLoading, navigate, redirectUrl);

    expect(console.log).toHaveBeenCalledWith(
      "Authentication failed with credentials identifier: some-credentials-id with error status: some-status and error message: some-message."
    );
  });

  it("should handle 'status' message type", async () => {
    const event = {
      origin: "https://link.production.jersey.tink.se",
      data: JSON.stringify({
        type: "status",
        data: { loading: true },
      }),
    };

    await receiveMessage(event, setLoading, navigate, redirectUrl);

    expect(console.log).toHaveBeenCalledWith(
      "Tink Link has shown the loading overlay."
    );
  });

  it("should handle 'application-event' message type with INITIALIZED event", async () => {
    const event = {
      origin: "https://link.production.jersey.tink.se",
      data: JSON.stringify({
        type: "application-event",
        data: { event: "INITIALIZED" },
      }),
    };

    await receiveMessage(event, setLoading, navigate, redirectUrl);

    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
