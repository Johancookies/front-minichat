import axios from "axios";
import { useState, useEffect } from "react";
import { ArrowIcon } from "./icons";

function ServicesList() {
  return (
    <div className="servicesContainer">
      {[...Array(4).fill({})].map((item) => (
        <div className="serviceCard">
          <div className="userOnline">
            <div className="roomNumber">
              <b>2</b>
            </div>
            <span>Room</span>
          </div>
          <div className="sendButton smallButton" onClick={() => {}}>
            <ArrowIcon />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServicesList;
