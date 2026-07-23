"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Copy, Loader2, Sparkles } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";

const SYSTEM_PROMPT =
  "You are Zora, a friendly general-purpose AI assistant inside a learning platform. " +
  "Answer any question clearly and concisely. Use markdown, and fenced code blocks for code. " +
  "If a question is ambiguous, briefly ask for clarification.";

const SUGGESTIONS = [
  "Explain a concept simply",
  "Help me debug some code",
  "Summarize a topic for me",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  const ask = async (text) => {
    const question = text.trim();
    if (!question || isThinking) return;

    // Easter egg: creators
    const lower = question.toLowerCase();
    if (
      lower.includes("who made you") ||
      lower.includes("founder") ||
      lower.includes("creator") ||
      lower.includes("who created you") ||
      lower.includes("who developed this application") ||
      lower.includes("who made zora")
    ) {
      setMessages((prev) => [
        ...prev,
        { text: question, isBot: false },
        {
          text: "I was made by a group of third-year Gyalpozhing College of Information Technology students in 2025, namely Chime Gyeltshen Dorji, Tshering Gyeltshen, and Chencho Wangdi.",
          isBot: true,
        },
      ]);
      setInputValue("");
      return;
    }

    const nextMessages = [...messages, { text: question, isBot: false }];
    setMessages(nextMessages);
    setInputValue("");
    setIsThinking(true);

    try {
      const conversation = nextMessages.map((m) => ({
        role: m.isBot ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: conversation,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Request failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { text: (data.text || "").trim(), isBot: true },
      ]);
    } catch (err) {
      console.error("ChatBot Error:", err);
      setMessages((prev) => [
        ...prev,
        { text: `Sorry, I encountered an error: ${err.message}`, isBot: true },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ask(inputValue);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-40 flex h-13 items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10 transition hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        {!isOpen && <span className="hidden sm:inline">Ask Zora</span>}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-40 flex h-[520px] w-[92vw] max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#11151D] sm:left-6">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-900 px-4 py-3 text-white dark:border-gray-700 dark:bg-indigo-600">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Sparkles size={17} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Zora Assistant</p>
              <p className="text-xs text-white/70">
                Ask me anything — study help, code, ideas…
              </p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={17} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-gray-100 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  Hi, I&apos;m <strong>Zora</strong> 👋 — your AI assistant. Ask
                  me anything at all, not just course topics.
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:border-indigo-400 hover:text-indigo-500 dark:border-gray-700 dark:text-gray-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "group relative max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm",
                  m.isBot
                    ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 [&_a]:text-indigo-500 [&_code]:text-[12px] [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-950 [&_pre]:p-3"
                    : "ml-auto bg-indigo-600 text-white"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {m.text}
                </ReactMarkdown>
                {m.isBot && (
                  <button
                    onClick={() => handleCopy(m.text)}
                    title="Copy"
                    className="absolute -right-1 -top-1 hidden rounded-md border border-gray-200 bg-white p-1 text-gray-400 shadow-sm hover:text-gray-700 group-hover:block dark:border-gray-700 dark:bg-gray-900 dark:hover:text-gray-200"
                  >
                    <Copy size={12} />
                  </button>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Thinking…
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-700"
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600"
            />
            <button
              type="submit"
              disabled={isThinking || !inputValue.trim()}
              className="rounded-lg bg-indigo-600 p-2 text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
