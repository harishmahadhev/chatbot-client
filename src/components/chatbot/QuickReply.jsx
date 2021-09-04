import React from "react";

export default function QuickReply(props) {
  return (
    <div>
      {props.reply.structValue.fields.payload ? (
        <button
          style={{ margin: 3, fontSize: "10px", padding: "0 8px" }}
          className="btn-small waves-effect waves-light red"
          onClick={(event) =>
            props.click(
              event,
              props.reply.structValue.fields.payload.stringValue,
              props.reply.structValue.fields.text.stringValue
            )
          }
        >
          {props.reply.structValue.fields.text.stringValue}
        </button>
      ) : (
        <button
          style={{ margin: 3, fontSize: "10px", padding: "0 8px" }}
          className="btn-small waves-effect waves-light red"
        >
          {props.reply.structValue.fields.text.stringValue}
        </button>
      )}
    </div>
  );
}
