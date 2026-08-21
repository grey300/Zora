import React from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChapterQuiz from "./ChapterQuiz";

const opts = {
  height: "390",
  width: "640",
  playerVars: { autoplay: 0 },
};

// codeExample arrives as an HTML-ish string ("<pre><code>...</code></pre>").
// Strip the wrapper tags and decode basic entities so we can render it cleanly.
function cleanCode(code) {
  return String(code)
    .replace(/<\/?pre>|<\/?code>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function ChapterContent({ chapter, content }) {
  const sections = content?.content?.sections || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      {/* Chapter header */}
      <div className="border-b border-gray-200 pb-6 dark:border-gray-800">
        <h2 className="text-2xl font-bold md:text-3xl">{chapter?.ChapterName}</h2>
        {chapter?.About && (
          <p className="mt-2 text-gray-500 dark:text-gray-400">{chapter.About}</p>
        )}
      </div>

      {/* Video */}
      {content?.videoId && (
        <div className="my-8 flex justify-center overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 [&_iframe]:max-w-full">
          <YouTube videoId={content.videoId} opts={opts} />
        </div>
      )}

      {/* Sections */}
      <div className="mt-8 space-y-8">
        {sections.map((section, index) => (
          <section key={index}>
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-bold text-green-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold">{section.title}</h3>
            </div>
            <div className="prose prose-gray mt-3 max-w-none text-[15px] leading-relaxed dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section?.description}
              </ReactMarkdown>
            </div>
            {section.codeExample && (
              <pre className="mt-4 overflow-x-auto rounded-xl border border-gray-800 bg-gray-950 p-4 text-sm leading-relaxed text-emerald-400">
                <code>{cleanCode(section.codeExample)}</code>
              </pre>
            )}
          </section>
        ))}
      </div>

      {/* End-of-chapter quiz */}
      <ChapterQuiz quiz={content?.quiz} />
    </div>
  );
}

export default ChapterContent;
