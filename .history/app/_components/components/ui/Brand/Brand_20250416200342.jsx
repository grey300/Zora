import Image from "next/image"

const Brand = ({ ...props }) => (
    <Image
        src="/ZoraW.png"
        alt="Zora logo"
        {...props}
        width={90}
        height={30}
        priority
    />
)
export default Brand