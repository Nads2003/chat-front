import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { Mic, ArrowLeft, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceMessage from "../components/VoiceMessage";
import avatarDefault from "../assets/profile.png";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import Picker from "emoji-picker-react";

export default function Chat() {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access");
  const myUserId = token ? jwtDecode(token).user_id : null;
  const myUsername = token ? jwtDecode(token).username : "";

  const isProd = window.location.hostname !== "localhost";
  const WS_BASE_URL = isProd
    ? "wss://web-production-6a3e3.up.railway.app/ws/chat"
    : "ws://127.0.0.1:8000/ws/chat";

  // Charger amis
  useEffect(() => {
    api.get("/friends/utilisateurs/")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const selectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    setConversationId(null);
    try {
      const res = await api.get(`/friends/conversation/${user.id}/`);
      setConversationId(res.data.id);
      if (mobileSidebarOpen) setMobileSidebarOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Messages + WebSocket
  useEffect(() => {
    if (!conversationId || !token) return;

    api.get(`/friends/messages/${conversationId}/`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    if (socketRef.current) socketRef.current.close();

    const ws = new WebSocket(`${WS_BASE_URL}/${conversationId}/?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connecté");
      setSocketReady(true);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => {
        const index = prev.findIndex(m => m.localId === data.localId);
        if (index !== -1) {
          const copy = [...prev];
          copy[index] = data;
          return copy;
        }
        return [...prev, data];
      });
    };

    ws.onclose = () => setSocketReady(false);
    return () => ws.close();
  }, [conversationId, token]);

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    const localId = uuidv4();
    const localMessage = { localId, contenu: message, est_lu: false, expediteur: { id: myUserId, username: myUsername } };
    setMessages(prev => [...prev, localMessage]);
    socketRef.current.send(JSON.stringify({ message, localId }));
    setMessage("");
  };

  // Recording vocal
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        const localId = uuidv4();

        reader.onload = () => {
          const base64Audio = reader.result;
          const localMessage = { localId, vocal: base64Audio, est_lu: false, expediteur: { id: myUserId, username: myUsername } };
          setMessages(prev => [...prev, localMessage]);
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ vocal: base64Audio, localId }));
          }
        };
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) { console.error("Micro refusé", err); }
  };

  const stopRecording = () => { mediaRecorderRef.current.stop(); setRecording(false); };
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const renderMessages = () =>
    messages.map((msg, i) => {
      const isMe = Number(msg.expediteur?.id) === Number(myUserId);
      return (
        <div key={msg.localId || i} className={`flex mb-2 items-end ${isMe ? "justify-end" : "justify-start"}`}>
          {!isMe && <img src={avatarDefault} className="w-8 h-8 rounded-full mr-2" />}
          <div className={`px-4 py-2 max-w-[70%] break-words text-sm rounded-2xl ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-700 text-white rounded-bl-none"}`}>
            {!isMe && <div className="text-xs font-bold mb-1">{msg.expediteur?.username}</div>}
            {msg.contenu}
            {msg.vocal && <VoiceMessage src={msg.vocal.startsWith("data:") ? msg.vocal : `http://127.0.0.1:8000${msg.vocal}`} />}
            {isMe && <div className="text-xs text-right mt-1 opacity-70">{msg.est_lu ? "✔✔" : "✔"}</div>}
          </div>
        </div>
      );
    });

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-900 text-white">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:flex-col w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-4 font-bold border-b border-slate-700 flex items-center gap-2">
          <ArrowLeft size={20} className="cursor-pointer hover:text-indigo-400" onClick={() => navigate("/add")} />
          Amis
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} onClick={() => selectUser(user)} className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-700 ${selectedUser?.id === user.id ? "border-l-4 border-indigo-500 bg-slate-700" : ""}`}>
              <img src={avatarDefault} className="w-8 h-8 rounded-full" />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Mobile */}
      {mobileSidebarOpen && (
        <div className="absolute z-50 top-0 left-0 w-64 h-full bg-slate-800 border-r border-slate-700 p-4 md:hidden">
          <X size={24} className="cursor-pointer mb-4" onClick={() => setMobileSidebarOpen(false)} />
          {users.map(user => (
            <div key={user.id} onClick={() => selectUser(user)} className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-700 ${selectedUser?.id === user.id ? "border-l-4 border-indigo-500 bg-slate-700" : ""}`}>
              <img src={avatarDefault} className="w-8 h-8 rounded-full" />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zone Messages */}
      <div className="flex-1 flex flex-col relative">
        {/* Top bar mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-800">
          <button onClick={() => setMobileSidebarOpen(true)}><Menu size={24} /></button>
          <div className="font-bold text-center flex-1">{selectedUser ? `💬 ${selectedUser.username}` : "Sélectionne un ami"}</div>
        </div>

        {/* Header desktop */}
        <div className="hidden md:block p-4 bg-slate-800 text-center font-bold">{selectedUser ? `💬 ${selectedUser.username}` : "Sélectionne un ami"}</div>

        {/* Messages scrollable avec fond fixe */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>

        {/* Input zone */}
        {selectedUser && (
          <div className="p-4 bg-slate-800 flex gap-2 flex-wrap">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="flex-1 p-3 rounded bg-slate-700 outline-none"
              placeholder="Votre message..."
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={() => setShowPicker(prev => !prev)} className="text-xl">😊</button>
            {!recording ? (
              <button onClick={startRecording} className="hover:text-indigo-400"><Mic size={20} /></button>
            ) : (
              <button onClick={stopRecording} className="text-red-500 font-bold">⏹</button>
            )}
            <button onClick={sendMessage} className="bg-indigo-600 px-4 rounded">Envoyer</button>
          </div>
        )}

        {showPicker && (
          <div className="absolute bottom-16 left-2 md:left-4 z-50">
            <Picker onEmojiClick={(emoji) => setMessage(prev => prev + emoji.emoji)} />
          </div>
        )}
      </div>
    </div>
  );
}
