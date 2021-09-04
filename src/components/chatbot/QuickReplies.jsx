import { Component } from "react";
import QuickReply from "./QuickReply";

export default class QuickReplies extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(event, payload, text) {
    this.props.replyClick(event, payload, text);
  }
  renderQuickReply(reply, i) {
    return <QuickReply key={i} click={this._handleClick} reply={reply} />;
  }

  renderQuickReplies(quickReplies) {
    return quickReplies
      ? quickReplies.map((reply, i) => {
          return this.renderQuickReply(reply, i);
        })
      : null;
  }
  render() {
    return (
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <div
          style={{
            padding: "20px 20px 5px",
            margin: "10px",
            borderBottomLeftRadius: "50px",
            borderBottomRightRadius: "50px",
            borderTopRightRadius: "50px",
          }}
          className="card-panel red lighten-5 z-depth-1"
        >
          <div className="row valign-wrapper">
            <div className="col s2">
              <a
                href="/"
                className="btn-floating btn-small waves-effect waves-light red"
              >
                {this.props.speaks}
              </a>
            </div>
            <div id="quick-replies" className="col s10">
              {this.props.text && <p>{this.props.text.stringValue}</p>}
              <div style={{ display: "flex" }}>
                {this.renderQuickReplies(this.props.payload)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
