import React, { useContext, useEffect, useState } from 'react'
import Message from './message'
import { onSnapshot,doc } from 'firebase/firestore';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { db } from '../firebaseConfig';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    console.log('data:', data);
    if (data && data.chatId) {
      console.log('chatId:', data.chatId);
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        console.log('doc:', doc);
        if (doc.exists() && doc.data() && 'messages' in doc.data()) {
          console.log('messages:', doc.data().messages);
          setMessages(doc.data().messages);
        }
      });
  
      return () => {
        unSub();
      };
    }
  }, [data]);
  

  console.log(messages)

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};
export default Messages
