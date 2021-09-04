import React, { Component } from "react";
import axios from "axios/index";
import Message from "./Message";
import Card from "./Card";
import { v4 as uuid } from "uuid";
import Cookies from "js-cookie";
import QuickReplies from "./QuickReplies";
import { withRouter } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

class Chatbot extends Component {
  constructor(props) {
    super(props);

    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    this.state = {
      messages: [],
      showBot: true,
      shopWelcomeSent: false,
    };

    if (Cookies.get("userId") === undefined)
      Cookies.set("userId", uuid(), { secure: true, expires: 3 });
  }

  async df_text_query(text) {
    let says = {
      speaks: "me",
      msg: {
        text: { text: text },
      },
    };
    this.setState({ messages: [...this.state.messages, says] });

    const request = {
      queryInput: {
        event: {
          name: text, // The query to send to the dialogflow agent
          languageCode: "en-US", // The language used by the client (en-US)
        },
      },
    };
    await this.df_client_call(request);
  }

  async df_event_query(event) {
    const request = {
      queryInput: {
        event: {
          // The query to send to the dialogflow agent
          name: event,
          // The language used by the client (en-US)
          languageCode: "en-US",
        },
      },
    };
    await this.df_client_call(request);
  }

  async df_client_call(request) {
    try {
      if (
        process.env.REACT_APP_DIALOGFLOW_CLIENT_KEY === undefined ||
        process.env.REACT_APP_GOOGLE_PROJECT_ID === undefined ||
        process.env.REACT_APP_SESSION_ID === undefined
      ) {
        console.log(
          "cant read from env variable",
          process.env.REACT_APP_DIALOGFLOW_CLIENT_KEY,
          process.env.REACT_APP_GOOGLE_PROJECT_ID,
          process.env.REACT_APP_SESSION_ID
        );
        throw Error;
      }

      var config = {
        headers: {
          Authorization: "Bearer" + process.env.REACT_APP_DIALOGFLOW_CLIENT_KEY,
          "Content-Type": "application/json; charset=utf-8",
        },
      };

      const { data } = await axios.post(
        "https://dialogflow.googleapis.com/v2/projects/" +
          process.env.REACT_APP_GOOGLE_PROJECT_ID +
          +"/agent/sessions/" +
          process.env.REACT_APP_SESSION_ID +
          Cookies.get("userId") +
          ":detectIntent",
        request,
        config
      );
      let says = {};

      if (data.queryResult.fulfillmentMessages) {
        for (let msg of data.fulfillmentMessages) {
          says = {
            speaks: "bot",
            msg: msg,
          };
          this.setState({ messages: [...this.state.messages, says] });
        }
      }
    } catch (error) {
      let says = {
        speaks: "bot",
        msg: {
          text: {
            text: "I'm having troubles. I need to terminate . will be back later",
          },
        },
      };
      this.setState({ messages: [this.state.messages, says] });
      let that = this;
      setTimeout(() => {
        that.setState({ showBot: false });
      }, 2000);
    }
  }

  handleInputKeyPress(e) {
    if (e.key === "Enter") {
      this.df_text_query(e.target.value);
      e.target.value = "";
    }
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.cards
    ) {
      return (
        <div key={i}>
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
            <div style={{ overflow: "hidden" }}>
              <a
                style={{ marginBottom: "10px" }}
                href="/"
                className="btn-floating btn-small waves-effect waves-light red"
              >
                {message.speaks}
              </a>
            </div>
            <div style={{ overflow: "auto", width: 300, marginBottom: 10 }}>
              <div
                style={{
                  height: 300,
                  width:
                    message.msg.payload.fields.cards.listValue.values.length *
                    270,
                }}
              >
                {this.renderCards(
                  message.msg.payload.fields.cards.listValue.values
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies
    ) {
      return (
        <QuickReplies
          text={message.msg.payload.fields.text}
          key={i}
          replyClick={this._handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    }
  }

  resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  }

  async componentDidMount() {
    console.log(
      "cant read from env variable",
      process.env.REACT_APP_DIALOGFLOW_CLIENT_KEY,
      process.env.REACT_APP_GOOGLE_PROJECT_ID,
      process.env.REACT_APP_SESSION_ID
    );
    this.df_event_query("Welcome");
    if (window.location.pathname === "/shop" && !this.state.shopWelcomeSent) {
      await this.resolveAfterXSeconds(2);
      this.setState({ showBot: true });
      this.df_event_query("WELCOME_SHOP");
      this.setState({ shopWelcomeSent: true, showBot: true });
    }
    this.props.history.listen(() => {
      if (
        this.props.history.location.pathname === "/shop" &&
        !this.state.shopWelcomeSent
      ) {
        this.df_event_query("WELCOME_SHOP");
        this.setState({ shopWelcomeSent: true });
      }
    });
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    if (this.inputFocus) this.inputFocus.focus();
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();
    this.setState(this.state.messages.pop());

    switch (payload) {
      case "recommend_yes":
        this.df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "training_masterclass":
        this.df_event_query("MASTERCLASS");
        break;
      default:
        this.df_text_query(text);
        break;
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  renderMessages(stateMessages) {
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }

  show(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: true });
  }

  hide(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: false });
  }

  render() {
    return (
      <div
        style={{
          maxHeight: 470,
          minHeight: 500,
          width: 400,
          position: "absolute",
          bottom: 0,
          right: 0,
          border: "1px solid lightgrey",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <nav>
          <div className="nav-wrapper">
            <a href="/" className="brand-logo">
              Chatbot
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <a
                  href="/"
                  onClick={this.state.showBot ? this.hide : this.show}
                >
                  {this.state.showBot ? "Close" : "Show"}
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div
          id="chatbot"
          style={
            this.state.showBot
              ? {
                  minHeight: 388,
                  maxHeight: 388,
                  width: "100%",
                  overflow: "auto",
                }
              : {
                  display: "none",
                }
          }
        >
          {this.renderMessages(this.state.messages)}
          <div
            ref={(el) => {
              this.messagesEnd = el;
            }}
            style={{ float: "left", clear: "both" }}
          ></div>
        </div>
        <div className="col s12">
          <input
            ref={(e) => {
              this.inputFocus = e;
            }}
            style={
              this.state.showBot
                ? {
                    margin: 0,
                    paddingLeft: "1%",
                    paddingRight: "1%",
                    width: "98%",
                  }
                : {
                    display: "none",
                  }
            }
            placeholder="Type a message "
            type="text"
            onKeyPress={this.handleInputKeyPress}
          />
        </div>
      </div>
    );
  }
}
export default withRouter(Chatbot);

// const { data } = await axios.post("/api/df_event_query", {
//   event: event,
//   userId: Cookies.get("userId"),
// });
