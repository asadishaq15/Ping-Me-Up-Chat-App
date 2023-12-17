import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from "uuid";
import { getDownloadURL, uploadBytes, uploadBytesResumable, ref } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import Attach from "../assets/attach.png";
import Img from "../assets/img.png";
import EmojiPicker from 'emoji-picker-react';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [showEmoji,setShowEmoji]=useState();
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef=useRef();

const handleSend = async () => {
  console.log("Handling send...");

  try {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress if needed
        },
        (error) => {
          console.error("Error during upload:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (downloadError) {
            console.error("Error getting download URL:", downloadError);
          }
        }
      );
    } else {
      // Handle text-only message upload
      console.log("Updating documents...");
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // Update user chats and reset state
    console.log("Documents updated successfully!");
    // ... (your existing code)
  } catch (sendError) {
    console.error("Error during send:", sendError);
  }
  setText("");
  setImg(null);
};
  

 const handleEmojiSelect = (emoji) => {
    const emojiRepresentation = emoji.native;
    setText((prevText) => prevText + emojiRepresentation);
    setShowEmojiPicker(false);
  };


  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    // Add click event listener to close the emoji picker when clicking anywhere on the document
    document.addEventListener('click', closeEmojiPicker);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', closeEmojiPicker);
    };
  }, []);



  return (
    <div className="input" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        placeholder="Type something"
        onChange={(e) => {
          console.log('Input Change:', e.target.value);
          setText(e.target.value);
        }}
        value={text}
      />
   
      <div className="send">
         <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <EmojiEmotionsIcon />
        </button>
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: 'none' }}
          id="file"
          onChange={(e) => setImg(e.target.files && e.target.files[0])}
        />
           
        <label htmlFor="file">
         <ImageIcon/>
        </label>
       
        <button onClick={handleSend}><SendIcon/></button>

      </div>
      {showEmojiPicker && (
  <div className="emoji-picker-container">
    <EmojiPicker pickEmoji={handleEmojiSelect}
    searchPlaceHolder='How do you feel'
    emojiStyle='apple'
    theme='dark'
    previewConfig={
      {
        showPreview:true,
        defaultEmoji:"1f92a"
        
      }
    }
    />
  </div>
)}
    </div>
  );
  
};

export default Input;
