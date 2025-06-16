import { useState, useRef } from 'react';
import { askGemini } from '../../utils/api';
import { Message } from './Message';

export const ChatBox = () => {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const recognitionRef = useRef<any>(null);

  const handleSend = async () => {
    if (!input) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    const reply = await askGemini(input);
    setMessages([...newMessages, { from: 'bot', text: reply }]);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech not supported');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const exportChat = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.json';
    a.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="border rounded p-2 h-[60vh] overflow-y-auto space-y-2 bg-white dark:bg-gray-800">
        {messages.map((msg, i) => (
          <Message key={i} from={msg.from} text={msg.text} />
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input className="flex-1 p-2 border rounded dark:bg-gray-900" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
        <button onClick={handleSend} className="bg-blue-500 text-white px-3 rounded">Send</button>
        <button onClick={startVoiceInput} className="bg-green-500 text-white px-3 rounded">🎤</button>
        <button onClick={exportChat} className="bg-yellow-500 text-white px-3 rounded">📁</button>
      </div>
    </div>
  );
};