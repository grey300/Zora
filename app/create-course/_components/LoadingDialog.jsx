import React from "react";
import { Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function LoadingDialog({ loading, description }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">Generating</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col items-center py-8">
              {/* Pulsing AI orb */}
              <div className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/30" />
                <span className="absolute inline-flex h-14 w-14 rounded-full bg-green-500/20" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                  <Sparkles size={22} className="animate-pulse" />
                </span>
              </div>

              <p className="mt-5 text-base font-semibold text-foreground">
                Atsi Gu… the AI is working
              </p>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                {description || "Designing your course. This takes a moment."}
              </p>

              {/* Indeterminate progress bar */}
              <div className="mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-1/3 animate-[loading-slide_1.2s_ease-in-out_infinite] rounded-full bg-green-500" />
              </div>
              <style>{`@keyframes loading-slide { 0% { margin-left: -35%; } 100% { margin-left: 105%; } }`}</style>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoadingDialog;
