export const receiveMessage = async (
  event: { origin: string; data: string },
  setLoading: (loading: boolean, message?: string) => void,
  navigate: (path: string) => void,
  redirectUrl: string | null
) => {
  if (event.origin !== "https://link.production.jersey.tink.se") {
    return;
  }

  console.log(event);

  const { type, data, error } = JSON.parse(event.data);

  if (type === "code") {
    const code = data;
    console.log(`Tink Link returned with authorization code: ${code}`);
  } else if (type === "error") {
    const { status } = error;
    if (status === "USER_CANCELLED") {
      setLoading(true, "Sit Tight, we are going back to merchant.");
      setTimeout(() => {
        window.location.href = redirectUrl ?? "";
      }, 3000);
    } else {
      navigate("/error");
    }
  } else if (type === "credentials") {
    const credentialsId = data;
    console.log(
      `Authentication failed with credentials identifier: ${credentialsId} with error status: ${error.status} and error message: ${error.message}.`
    );
  } else if (type === "status") {
    const { loading } = data;
    console.log(
      `Tink Link has ${loading ? "shown" : "hidden"} the loading overlay.`
    );
  } else if (type === "application-event") {
    const { event } = data;
    if (event === "INITIALIZED") {
      setLoading(false);
    }
  }
};
