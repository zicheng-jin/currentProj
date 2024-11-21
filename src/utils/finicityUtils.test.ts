import { launchFinicityConnect } from "./finicityUtils";

// src/utils/finicityUtils.test.ts

describe("launchFinicityConnect", () => {
  const iframeSrc = "https://finicity.com/connect";
  const redirectUrl = "https://example.com/redirect";
  const setLoading = jest.fn();
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).finicityConnect = {
      launch: jest.fn(),
    };
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should launch Finicity Connect with correct parameters", () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/",
      },
      writable: true,
    });
    launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);

    expect((window as any).finicityConnect.launch).toHaveBeenCalledWith(
      iframeSrc,
      expect.objectContaining({
        selector: "#connect-container",
        overlay: "position: absolute;top: ;left: ;width: 108%;height: 100%",
      })
    );
  });

  it("should handle success event", () => {
    const successEvent = { data: "success" };
    launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);

    const launchConfig = (window as any).finicityConnect.launch.mock
      .calls[0][1];
    launchConfig.success(successEvent);

    expect(console.log).toHaveBeenCalledWith(
      "Yay! User went through Connect",
      successEvent
    );
  });

  it("should handle cancel event", () => {
    const cancelEvent = { data: "cancel" };
    launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);

    const launchConfig = (window as any).finicityConnect.launch.mock
      .calls[0][1];
    launchConfig.cancel(cancelEvent);

    expect(console.log).toHaveBeenCalledWith(
      "The user cancelled the iframe",
      cancelEvent
    );
  });

  it("should handle error event", () => {
    const errorEvent = new Error("Some error");
    launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);

    const launchConfig = (window as any).finicityConnect.launch.mock
      .calls[0][1];
    launchConfig.error(errorEvent);

    expect(navigate).toHaveBeenCalledWith("/error");
    expect(console.error).toHaveBeenCalledWith(
      "Some runtime error was generated during inside Connect",
      errorEvent
    );
  });

  it("should handle loaded event", () => {
    launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);

    const launchConfig = (window as any).finicityConnect.launch.mock
      .calls[0][1];
    launchConfig.loaded();

    expect(console.log).toHaveBeenCalledWith(
      "This gets called only once after the iframe has finished loading "
    );
  });

  it("should handle route event when screen is done", () => {
    const routeEvent = { data: { screen: "done" } };
    jest.useFakeTimers();
    launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);

    const launchConfig = (window as any).finicityConnect.launch.mock
      .calls[0][1];
    launchConfig.route(routeEvent);

    expect(setLoading).toHaveBeenCalledWith(true, "Account Link Successfully!");
    jest.advanceTimersByTime(10000);
    expect(window.location.href).toBe(redirectUrl);
    jest.useRealTimers();
  });

  it("should handle user event when action is Initialize", () => {
    const userEvent = { data: { action: "Initialize" } };
    launchFinicityConnect(iframeSrc, redirectUrl, setLoading, navigate);

    const launchConfig = (window as any).finicityConnect.launch.mock
      .calls[0][1];
    launchConfig.user(userEvent);

    expect(setLoading).toHaveBeenCalledWith(false);
    expect(console.log).toHaveBeenCalledWith(
      "This is called as the user interacts with Connect ~",
      userEvent
    );
  });
});
