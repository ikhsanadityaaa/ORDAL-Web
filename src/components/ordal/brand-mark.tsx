import Image from "next/image";

export function BrandMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return <Image src="/logo.svg" alt="" width={size} height={size} className={className} />;
}
