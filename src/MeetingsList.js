import { useState, useEffect } from "react";
import axios from "axios";

export default function MeetingsList() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getChannels = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API}channels/by-product?id_product=384765`
        );
        console.log(response)
      } catch (err) {
        console.log("No hay canales");
      } finally {
        setIsLoading(false);
      }
    };
    getChannels();
  }, []);

  return <div className="meetingsList"></div>;
}
