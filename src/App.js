import React from 'react';
import './App.css';

const API_KEY = "cvqROCwAPnBBAFDo_NDcW4IjLRYMY_RP";
const endpoint = "https://api.chatbot.com/query";
const story_id = "5eb2d214795b7c0007813652" // customer service
class App extends React.Component {

  getChat = async (e) => {
    e.preventDefault();
    const chatInput = e.target.elements.chat_input;
    const body_req = {
      "sessionId": "1000000000",
      "storyId": story_id,
      "query": chatInput.value
    };
    const api_call = await fetch(`${endpoint}`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body_req)
    });
    const response = await api_call.json();
    console.log(response);

    if (response.status.code === 200) {
      let aiResponse = ""
      let comma = "";
      for (const res of response.result.fulfillment) {
        if (res.buttons) {
          for (const button of res.buttons) {
            if (button.title) {
              aiResponse += comma;
              aiResponse += button.title;
              comma = ", ";
            }
          }
        }
      }
      console.log(aiResponse)
      this.appendChatBox(true, chatInput, aiResponse);
    }

  }

  chatTemplate = (aiOrPerson) => {
    return (
      `
        <div class="ai-person-container">
          <div class="${aiOrPerson.class}">
            <p>${aiOrPerson.text}</p>
          </div>
          <span class="${aiOrPerson.class}-date">${aiOrPerson.date}</span>
        </div>
      `
    );
  }

  appendChatBox = (isHuman, chatInput, aiResponse) => {
    const date = new Date()
    if (!isHuman) {
      date.setSeconds(date.getSeconds() + 2)
    }
    if (isHuman && !chatInput.value.trim()) {
      return;
    }
    const timestamp = date.toLocaleTimeString()
    const newChatDiv = this.chatTemplate({
      class: isHuman ? "person" : "ai",
      text: isHuman ? chatInput.value.trim() : aiResponse,
      date: timestamp
    });
    const chatBox = document.querySelector(".chat-box");
    if (!isHuman) {
      // make it so it only responds once to multiple fast sentences
      setTimeout(function () {
        chatBox.innerHTML += newChatDiv;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 2000)
    } else {
      chatBox.innerHTML += newChatDiv;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    if (isHuman) {
      chatInput.value = "";
      this.appendChatBox(false, undefined, aiResponse);
    }
  }

  /* appendChatBox = (isHuman, ch) => {
    const date = new Date()
    if (!isHuman) {
      date.setSeconds(date.getSeconds() + 2)
    }
    if (isHuman && !chatInput.value.trim()) {
      return;
    }
    const timestamp = date.toLocaleTimeString()
    const newChatDiv = chatTemplate({
      class: isHuman ? "person" : "ai",
      text: isHuman ? chatInput.value.trim() : aiResponse(),
      date: timestamp
    });
    if (!fromPerson) {
      // make it so it only responds once to multiple fast sentences
      setTimeout(function () {
        chatBox.innerHTML += newChatDiv;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 2000)
    } else {
      chatBox.innerHTML += newChatDiv;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    if (isHuman) {
      chatInput.value = "";
      appendChatBox(false);
    }
  } */

  render() {
    return (
      <div className="App">
        <div className="main-container">
          <div className="chat-box-container">
            <h1 className="chat-box-header">Chat AI</h1>
            <div className="chat-box">

            </div>
          </div>
          <form className="chat-input-container" onSubmit={this.getChat}>
            <input className="chat-input" type="text" name="chat_input"></input>
            <button className="chat-submit" type="submit">Submit</button>
          </form>
        </div>
      </div>
    )
  }

};

export default App;
