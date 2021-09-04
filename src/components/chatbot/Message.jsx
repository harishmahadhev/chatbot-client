import React from "react";

export default function Message(props) {
  return (
    <div className="col s12 m8 offset-m2 offset-l3">
      <div
        style={
          props.speaks === "bot"
            ? {
                padding: "20px 20px 5px",
                margin: "10px",
                borderBottomLeftRadius: "50px",
                borderBottomRightRadius: "50px",
                borderTopRightRadius: "50px",
              }
            : {
                padding: "20px 20px 5px",
                margin: "10px",
                borderBottomLeftRadius: "50px",
                borderBottomRightRadius: "50px",
                borderTopLeftRadius: "50px",
              }
        }
        className="red lighten-5 z-depth-1"
      >
        <div className="row valign-wrapper">
          {props.speaks === "bot" && (
            <div className="col s2">
              <a
                href="/"
                className="btn-floating btn-small waves-effect waves-light red"
              >
                {props.speaks}
              </a>
            </div>
          )}
          <div className="col s10">
            <span className="black-text">{props.text}</span>
          </div>
          {props.speaks === "me" && (
            <div className="col s2">
              <a
                href="/"
                className="btn-floating btn-small waves-effect waves-light red"
              >
                {props.speaks}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
