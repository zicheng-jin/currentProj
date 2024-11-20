export const launchFinicityConnect = (consentUrl: string) => {
  (window as any).finicityConnect.launch(consentUrl, {
    selector: "#connect-container",
    overlay: "position: absolute;top: ;left: ;width: 108%;height: 100%",
    success: (event: any) => {
      console.log("Yay! User went through Connect", event);
    },
    cancel: (event: any) => {
      console.log("The user cancelled the iframe", event);
    },
    error: (error: any) => {
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
      console.log(
        "This is called as the user navigates through Connect ",
        event
      );
    },
    user: (event: any) => {
      console.log("This is called as the user interacts with Connect ~", event);
    },
  });
};
