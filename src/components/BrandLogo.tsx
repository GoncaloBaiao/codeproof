"use client";

import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  iconSize?: number;
  textSizeClassName?: string;
  subtitle?: string;
  compact?: boolean;
};

export function BrandLogo({
  href = "/",
  iconSize = 40,
  textSizeClassName = "text-2xl",
  subtitle,
  compact = false,
}: BrandLogoProps) {
  const content = (
    <>
      <Image
        src="/Logo%20digital%20CodeProof%20com%20escudo%20e%20cadeado.png"
        alt="CodeProof icon"
        width={iconSize}
        height={iconSize}
        className="object-contain"
        sizes={`${iconSize}px`}
        priority
      />
      <div className={compact ? "leading-tight" : "leading-none"}>
        <div className={`${textSizeClassName} font-black tracking-tight text-white`}>
          <span>Code</span>
          <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Proof
          </span>
        </div>
        {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
      </div>
    </>
  );

  return (
    <Link href={href} className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]">
      {content}
    </Link>
  );
}