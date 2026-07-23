"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GraduationCap, Send, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Chapter-aware AI tutor. Sends the current chapter's content as system
 * context so answers are grounded in what the learner is studying.
 */
export default function TutorChat({ courseName, chapter, content }) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Reset the conversation when the chapter changes.
  React.useEffect(() => {
    setMessages([]);
  }, [chapter?.ChapterName]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const chapterContext = React.useMemo(() => {
    const sections = content?.content?.sections || [];
    const text = sections
      .map((s) => `## ${s.title}\n${s.description}`)
      .join("\n\n")
      .slice(0, 6000); // keep the context bounded
    return `You are a friendly tutor helping a student study the chapter "${chapter?.ChapterName}" of the course "${courseName}".
Chapter overview: ${chapter?.About || ""}
Chapter content:
${text}

Ground your answers in this chapter content. If asked something outside the chapter, still help but note it's beyond this chapter. Keep answers clear and concise. Use markdown.`;
  }, [chapter, content, courseName]);

  const send = async (e) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || thinking) return;

    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setThinking(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: chapterContext,
          messages: next,
          temperature: 0.5,
          max_tokens: 1024,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tutor unavailable.");
      setMessages((m) => [...m, { role: "assistant", content: data.text }]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Sorry, I ran into a problem: ${error.message}`,
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
      >
        {open ? <X size={18} /> : <GraduationCap size={18} />}
        {!open && <span className="hidden sm:inline">Chapter Tutor</span>}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-40 flex h-[480px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#11151D] sm:right-6">
          <div className="flex items-center gap-2 border-b border-gray-200 bg-indigo-600 px-4 py-3 text-white dark:border-gray-700">
            <GraduationCap size={18} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Chapter Tutor</p>
              <p className="truncate text-xs text-indigo-200">
                {chapter?.ChapterName}
              </p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="rounded-xl bg-gray-100 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                Hi! I know this chapter inside-out. Ask me anything about{" "}
                <strong>{chapter?.ChapterName}</strong> — explanations, examples,
                or a quick recap.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 [&_code]:text-xs [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-gray-950 [&_pre]:p-2 [&_pre]:text-gray-100"
                )}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 size={14} className="animate-spin" /> Thinking…
              </div>
            )}
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-700"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this chapter…"
              className="flex-1 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className="rounded-lg bg-indigo-600 p-2 text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
