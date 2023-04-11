import React from "react";
import "../../styles/card.scss";

export default function Card({ name }) {
  return (
    <>
      <div className="main-card col">
        <div className="img" style={{ "min-width": "200px" }}></div>
        <p className="seoul_end_point">{name}</p>
        <span>Seoul</span>
      </div>
    </>
  );
}
