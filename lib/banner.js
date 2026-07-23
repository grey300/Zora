/**
 * Build an AI banner URL (Pollinations, keyless) that visually depicts the
 * course subject. Pure function — safe on server and client.
 *
 * The prompt is subject-first: the topic and its recognizable objects lead,
 * style modifiers trail, so the image shows the subject rather than
 * generic abstract art.
 */
export function courseBannerUrl({ topic, courseName, category }) {
  const subject = courseName || topic || category || "learning";
  const prompt = encodeURIComponent(
    `${subject}: detailed digital illustration showing recognizable objects, tools and symbols of ${
      topic || subject
    }, educational ${category || ""} theme, rich vibrant colors, high quality, no text, no words, no letters`
  );
  const seed = Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${prompt}?width=600&height=400&nologo=true&seed=${seed}`;
}
