export const launchFinicityConnect = (
  iframeSrc: string,
  redirectUrl: string | null,
  setLoading: (loading: boolean, message?: string) => void,
  navigate: (path: string) => void
) => {
  (window as any).finicityConnect.launch(iframeSrc, {
    selector: "#connect-container",
    overlay: "position: absolute;top: ;left: ;width: 108%;height: 100%",
    success: (event: any) => {
      console.log("Yay! User went through Connect", event);
    },
    cancel: (event: any) => {
      console.log("The user cancelled the iframe", event);
    },
    error: (error: any) => {
      navigate("/error");
      console.error(
        "Some runtime error was generated during inside Connect",
        error
      );
    },
    loaded: () => {
      console.log(
        "This gets called only once after the iframe has finished loading "
      );
    },
    route: (event: any) => {
      if (event.data.screen === "done") {
        setLoading(true, "Account Link Successfully!");
        setTimeout(() => {
          window.location.href = redirectUrl ?? "";
        }, 10000);
      }
      console.log(
        "This is called as the user navigates through Connect ",
        event
      );
    },
    user: (event: any) => {
      if (event.data.action === "Initialize") {
        setLoading(false);
      }
      console.log("This is called as the user interacts with Connect ~", event);
    },
  });
};
