import React from "react";

export default function Card(props) {
  return (
    <div
      style={{
        width: 240,
        paddingRight: 30,
        float: "left",
      }}
    >
      <div className="card" style={{ width: 200 }}>
        <div className="card-image">
          <img
            src={props.payload.fields.image.stringValue}
            alt={props.payload.fields.header.stringValue}
          />
          <span className="card-title">
            {props.payload.fields.header.stringValue}
          </span>
        </div>
        <div className="card-content">
          {props.payload.fields.description.stringValue}
          <p>
            <a href="/">{props.payload.fields.price.stringValue}</a>
          </p>
        </div>
        <div className="card-action">
          <a
            target="_blank"
            rel="noreferrer"
            href={props.payload.fields.link.stringValue}
          >
            Get Now
          </a>
        </div>
      </div>
    </div>
  );
}
