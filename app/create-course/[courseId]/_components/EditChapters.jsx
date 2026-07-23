import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiEdit } from "react-icons/ci";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function EditChapters({
  course = { courseOutput: { Chapters: [] } },
  index,
  refreshData,
  // When true (course already generated), offer AI regeneration with the
  // custom instructions.
  allowRegenerate = false,
}) {
  const Chapters = course?.courseOutput?.Chapters || [];

  const [name, setName] = useState(Chapters[index]?.ChapterName || "");
  const [about, setAbout] = useState(Chapters[index]?.About || "");
  const [customPrompt, setCustomPrompt] = useState(
    Chapters[index]?.customPrompt || ""
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (Chapters[index]) {
      setName(Chapters[index].ChapterName || "");
      setAbout(Chapters[index].About || "");
      setCustomPrompt(Chapters[index].customPrompt || "");
    }
  }, [course, index]);

  const saveMeta = async () => {
    if (!course || !Chapters[index]) return;
    const updatedChapters = [...Chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      ChapterName: name,
      About: about,
      customPrompt,
    };
    try {
      const res = await fetch(`/api/courses/${course.courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseOutput: { ...course.courseOutput, Chapters: updatedChapters },
        }),
      });
      if (!res.ok) console.error("Failed to update chapter");
    } catch (error) {
      console.error("Failed to update course:", error);
    }
    refreshData(true);
  };

  const regenerate = async () => {
    setBusy(true);
    setMessage("");
    try {
      await saveMeta();
      const res = await fetch(`/api/courses/${course.courseId}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, customPrompt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Regeneration failed.");
      setMessage("Chapter regenerated with your instructions ✓");
      refreshData(true);
    } catch (error) {
      setMessage(error.message || "Regeneration failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!course || !Chapters[index]) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <CiEdit className="ml-1 inline cursor-pointer hover:text-indigo-500" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className="mt-3">
                <label className="text-sm font-medium">Chapter Name</label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  className="h-24"
                  value={about}
                  onChange={(event) => setAbout(event.target.value)}
                />
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium">
                  Custom AI instructions{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <Textarea
                  className="h-20"
                  placeholder='e.g. "Explain with real-world examples", "Keep it beginner friendly", "Add more code samples"'
                  value={customPrompt}
                  onChange={(event) => setCustomPrompt(event.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Used when this chapter&apos;s content is (re)generated.
                </p>
              </div>
              {message && (
                <p className="mt-3 rounded-md bg-indigo-500/10 px-3 py-2 text-sm text-indigo-500">
                  {message}
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          {allowRegenerate && (
            <Button
              variant="outline"
              onClick={regenerate}
              disabled={busy}
              type="button"
            >
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Regenerate content
            </Button>
          )}
          <DialogClose asChild>
            <Button onClick={saveMeta} disabled={busy}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditChapters;
