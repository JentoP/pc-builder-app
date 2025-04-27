import Image from "next/image";

export default function Logo() {
    return (
        <Image
            src="/images/logo/pcbuildername.png"
            alt="Logo"
            width="250" height="150"
            className="p-2"/>
    )
}