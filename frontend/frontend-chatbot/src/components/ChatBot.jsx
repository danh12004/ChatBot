import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { PaperAirplaneIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [link, setLink] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfName, setPdfName] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isAi: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const endpoint = pdfUploaded ? '/api/ask-pdf' : '/api/chat';
    const body = pdfUploaded ? { question: input } : { message: input };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const reply = pdfUploaded ? data.answer : data.response || data.message;

      setMessages((prev) => [...prev, { text: reply, isAi: true }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: 'Lỗi khi gửi câu hỏi', isAi: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('http://localhost:3000/api/upload-pdf', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setPdfUploaded(true);
      setPdfName(file.name);
      setMessages((prev) => [...prev, { text: `📄 Đã tải lên file: ${file.name}`, isAi: true }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { text: '❌ Tải file thất bại', isAi: true }]);
    }
  };

  const handleSummarize = async () => {
    if (!link.trim()) return;

    setMessages((prev) => [...prev, { text: `🔗 Tóm tắt bài viết: ${link}`, isAi: false }]);
    setIsSummarizing(true);
    try {
      const res = await fetch('http://localhost:3000/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link.trim() })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.summary, isAi: true }]);
      setLink('');
    } catch (err) {
      setMessages((prev) => [...prev, { text: 'Không thể tóm tắt link.', isAi: true }]);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="w-full bg-gradient-to-r from-blue-600 to-pink-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-yellow-300">AI Chat Assistant</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-100 to-gray-200">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="mt-1 text-sm">Ask me anything!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message.text} isAi={message.isAi} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 p-4">
            <div className="animate-pulse h-2.5 w-2.5 bg-blue-500 rounded-full"></div>
            <div className="animate-pulse h-2.5 w-2.5 bg-blue-500 rounded-full delay-100"></div>
            <div className="animate-pulse h-2.5 w-2.5 bg-blue-500 rounded-full delay-200"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-6 bg-white border-t border-gray-200 shadow-lg space-y-4">
        {/* Upload PDF */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">
            <DocumentArrowUpIcon className="h-5 w-5 text-blue-600 mr-2" />
            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            Upload PDF
          </label>
          {pdfUploaded && <p className="text-sm text-green-700 font-semibold">✅ {pdfName}</p>}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full rounded-full border border-gray-300 px-5 py-3 pr-14 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
          </button>
        </form>

        {/* Summarize Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSummarize(); }} className="relative flex items-center">
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste article URL to summarize..."
            className="w-full rounded-full border border-gray-300 px-5 py-3 pr-14 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
            disabled={isSummarizing}
          />
          <button
            type="submit"
            disabled={isSummarizing || !link.trim()}
            className="absolute right-2 inline-flex items-center justify-center w-10 h-10 rounded-full text-white bg-green-600 hover:bg-green-700"
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
