import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/">
        <Image
            src="/images/logo/pcbuildername.png"
            alt="Logo"
            width="250" height="180"
            className="p-2"
            priority
        />
        </Link>
    )
}