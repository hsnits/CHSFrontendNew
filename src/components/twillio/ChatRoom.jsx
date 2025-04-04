import React, { useEffect, useState, useRef } from 'react';
import { Client as TwilioChatClient } from 'twilio-chat';
import { useSearchParams } from 'react-router-dom';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const ChatRoom = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const roomName = params.get("room");

  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messageListRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const chatClient = await TwilioChatClient.create(token);
      setClient(chatClient);

      let joinedChannel;
      try {
        joinedChannel = await chatClient.getChannelByUniqueName(roomName);
      } catch {
        joinedChannel = await chatClient.createChannel({ uniqueName: roomName, friendlyName: roomName });
      }

      await joinedChannel.join().catch(() => {});
      setChannel(joinedChannel);

      const messagesPaginator = await joinedChannel.getMessages();
      setMessages(messagesPaginator.items);

      joinedChannel.on('messageAdded', msg => {
        setMessages(prev => [...prev, msg]);
      });
    };

    init();
  }, [token, roomName]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && channel) {
      channel.sendMessage(input);
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Chat Room: {roomName}</h2>

      <div
        ref={messageListRef}
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          backgroundColor: "#f9f9f9"
        }}
      >
        {messages.map((msg, i) => (
          <MessageBox
            key={i}
            position={msg.author === client?.user?.identity ? "right" : "left"}
            type="text"
            text={msg.body}
            date={msg.dateCreated}
            title={msg.author}
          />
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "10px", gap: "10px" }}>
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1 }}
        />
        <Button text="Send" onClick={sendMessage} />
      </div>

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <Button text="End Chat" onClick={() => window.location.href = "/"} />
      </div>
    </div>
  );
};

export default ChatRoom;
