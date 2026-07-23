import React from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function LoadingDialogQ({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Adding a title for accessibility */}
          <AlertDialogTitle>Loading...</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col items-center py-10">
              {/* Add alt text to the Image */}
              <Image
                src="/loader.gif"
                width={100}
                height={100}
                alt="Loading spinner"
              />
              <h2>Atsi Gu... Our AI is generating your quiz</h2>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoadingDialogQ;
