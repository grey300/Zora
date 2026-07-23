import Image from "next/image";
import ZoraLogo from "@/app/_components/public/ZoraW.png";

const Brand = ({ ...props }) => (
  <Image
    src={ZoraLogo}
    alt="Zora logo"
    width={90}
    height={30}
    priority
    {...props}
  />
);

export default Brand;
