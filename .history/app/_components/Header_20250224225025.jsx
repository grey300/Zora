import React from "react";
import Image from "next/image";
import { AuroraBackground } from "@/components/aurora-background";
function Header() {
  return (
    <AuroraBackground>
      <div className="flex justify-between p-3 shadow-md">
        <Image src={"/Zora.png"} width={150} height={100} />
      </div>
    </AuroraBackground>
  );
}

export default Header;
