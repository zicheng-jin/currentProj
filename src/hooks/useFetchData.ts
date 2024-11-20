import { useEffect } from "react";
import { useLoader } from "../hooks/useLoader";
import { launchFinicityConnect } from "../utils/finicityUtils";

const useFetchData = (url: string) => {
  const { setLoading } = useLoader();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true, "Please sit tight. We are on our way to Tink.");
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.consentUrl) {
          launchFinicityConnect(data.consentUrl);
        } else {
          console.error("No consentUrl found in the response data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [url, setLoading]);
};

export default useFetchData;