import axios from "axios";
import { useState, useEffect } from "react";
import { ArrowIcon } from "./icons";

function ServicesList({ handleVerifyChannel }) {
  const [serviceLines, setServiceLines] = useState([]);

  useEffect(() => {
    console.log(process.env.REACT_APP_PUBLIC_API);
    const getServiceLines = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API}service-lines`
        );
        setServiceLines(response.data.data);
      } catch (err) {
        console.log("No hay canales");
      }
    };
    getServiceLines();
  }, []);

  return (
    <div className="servicesContainer">
      {serviceLines?.map((item) => (
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
      ))}
    </div>
  );
}

export default ServicesList;
