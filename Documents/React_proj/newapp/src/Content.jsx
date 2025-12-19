import React from "react";
import "./Content.css";

const Content = ({ image, name, price, count, increase, decrease }) => {
  return (
    <div className="card">
      <img src={image} alt={name} className="card-img" />

      <h3>{name}</h3>
      <p>{price}</p>

      <div className="counter-box">
        <button className="btn" onClick={decrease}>-</button>

        <div className="count-display">{count}</div>

        <button className="btn" onClick={increase}>+</button>
      </div>
    </div>
  );
};

export default Content;
