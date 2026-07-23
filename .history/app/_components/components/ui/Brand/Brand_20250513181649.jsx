import Image from "next/image";

const Brand = ({ ...props }) => (
  <Image
    src="/_components/public/ZoraW.png"
    alt="Zora logo"
    width={90}
    height={30}
    priority
    {...props}
  />
);

export default Brand;
