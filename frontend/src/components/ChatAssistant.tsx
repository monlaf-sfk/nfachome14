import React, { useState } from 'react';

const ChatAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt.trim()) return;
    setMessages([...messages, {role: 'user', text: prompt}]);
    setLoading(true);
    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, {role: 'assistant', text: data.answer}]);
    } catch (e) {
      setMessages(msgs => [...msgs, {role: 'assistant', text: 'Ошибка запроса'}]);
    }
    setPrompt('');
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <div className="h-64 overflow-y-auto bg-gray-50 p-2 mb-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.role === 'user' ? 'text-blue-600' : 'text-green-700'}>
              <b>{msg.role === 'user' ? 'Вы' : 'Ассистент'}:</b> {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant; 