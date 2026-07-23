import React from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

function LoadingDialogQ({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Title for accessibility */}
          <AlertDialogTitle>Loading...</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Keep description as simple text */}
        <AlertDialogDescription>
          Atsi Gu... Our AI is generating your quiz
        </AlertDialogDescription>

        {/* Separate div for image to avoid invalid HTML nesting */}
        <div className="flex flex-col items-center py-10">
          <Image
            src="/loader.gif"
            width={100}
            height={100}
            alt="Loading spinner"
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoadingDialogQ;
