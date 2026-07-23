// export default ChatBot;
"use client";

import React, { useState, useRef } from "react";
import { MessageCircle, X, Send, Paperclip, Edit, Copy } from "lucide-react";
import "./chatbot.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen((prev) => {
      const nowOpen = !prev;
      if (nowOpen && messages.length === 0) {
        setMessages([
          {
            text: "Hi, I'm **ZoraPal**, your AI assistant. I'm here to help you with learning and clearing doubts.",
            isBot: true,
          },
        ]);
      }
      return nowOpen;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleEdit = (index) => {
    setInputValue(messages[index].text);
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  const correctSpellingWithGemini = async (text) => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Please correct the spelling and grammar of the following message without changing its meaning:\n\n"${text}"`,
              },
            ],
          },
        ],
      });

      return result.response.text().trim().replace(/^"|"$/g, "");
    } catch (err) {
      console.error("Spell correction failed:", err);
      return text;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsThinking(true);

    try {
      if (!API_KEY) throw new Error("API key not defined");

      const correctedInput = await correctSpellingWithGemini(inputValue);

      const userMessage = {
        text: correctedInput,
        isBot: false,
        attachments: attachments.map((file) => file.name),
      };

      setMessages((prev) => [...prev, userMessage]);
      const userQuestion = correctedInput;
      setInputValue("");
      setAttachments([]);

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const isCodeQuestion = /code|script|program|function|syntax/i.test(
        userQuestion
      );
      let prompt = isCodeQuestion
        ? `You are a coding assistant. Provide a complete, functional code snippet in Markdown with triple backticks ( \`\`\` ). Do not explain unless asked. Here's the question: "${userQuestion}"`
        : `You are a helpful assistant. Provide a clear, concise answer to the following question: "${userQuestion}"`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const response = result.response;
      const text = response.text();

      const formattedText = isCodeQuestion
        ? text.includes("```")
          ? text
          : `\`\`\`js\n${text.trim()}\n\`\`\``
        : text.trim();

      const botMessage = { text: formattedText, isBot: true };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again later.",
          isBot: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="chatbot-container">
      <button onClick={toggleChat} className="chat-button">
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chat-interface">
          <div className="chat-header">
            <h3>Chat Support</h3>
            <button onClick={toggleChat} className="close-button">
              <X size={18} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.isBot ? "bot-message" : "user-message"}
              >
                <div className="message-text">
                  <ReactMarkdown
                    children={message.text}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  />
                  <div className="message-actions">
                    <button
                      className="icon-button"
                      onClick={() => handleCopy(message.text)}
                      title="Copy"
                    >
                      <Copy size={14} />
                    </button>
                    {!message.isBot && (
                      <button
                        className="icon-button"
                        onClick={() => handleEdit(index)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {message.attachments?.length > 0 && (
                  <div className="attachments">
                    {message.attachments.map((fileName, idx) => (
                      <div key={idx} className="attachment-item">
                        {fileName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isThinking && <div className="bot-message">Thinking...</div>}
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <button
              type="button"
              onClick={triggerFileInput}
              className="attach-button"
              title="Attach a file"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button type="submit" className="send-button">
              <Send size={18} />
            </button>
          </form>

          {attachments.length > 0 && (
            <div className="selected-attachments">
              {attachments.map((file, index) => (
                <div key={index} className="attachment-item">
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
