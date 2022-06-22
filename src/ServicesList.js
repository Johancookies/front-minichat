import axios from "axios";
import { useState, useEffect } from "react";
import { ArrowIcon } from "./icons";

function ServicesList({ handleVerifyChannel }) {
  const [serviceLines, setServiceLines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getServiceLines = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API}service-lines`
        );
        setServiceLines(response.data.data);
      } catch (err) {
        console.log("No hay canales");
      } finally {
        setIsLoading(false);
      }
    };
    getServiceLines();
  }, []);

  return (
    <>
      {!isLoading ? (
        <div className="servicesContainer">
          {serviceLines.length > 0 ? (
            serviceLines?.map((item) => (
              <div className="serviceCard" key={item.id}>
                <div className="userOnline">
                  <div className="roomNumber">
                    <b>{item.id_product}</b>
                  </div>
                  <span>{item.name}</span>
                </div>
                <div
                  className="sendButton smallButton"
                  onClick={() => {
                    handleVerifyChannel(item.id_product);
                  }}
                >
                  <ArrowIcon />
                </div>
              </div>
            ))
          ) : (
            <span>No hay canales disponibles</span>
          )}
        </div>
      ) : (
        <div className="loaderContainer">
          <div class="loader" />
        </div>
      )}
    </>
  );
}

export default ServicesList;
