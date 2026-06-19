import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

export function BrutalistSignupCard({
  className,
  mode = "signin"
}: {
  className?: string,
  mode?: "signin" | "signup"
}) {
  const isSignIn = mode === "signin";
  const title = isSignIn ? "Sign-in" : "Sign-up";
  const subtitle = isSignIn ? "Welcome back." : "Start for free.";

  return (
    <div
      className={`block w-full bg-[#EBEBEB] relative group overflow-hidden border-b-2  border-black ${className || ''}`}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      <div className="absolute  top-0 right-0 bg-black w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center z-20">
        <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[1.5] transition-transform duration-300 " />
      </div>

      <div className="p-6 flex flex-col h-full relative z-10">

        <div className="mb-12">
          <Plus className="w-6 h-6 text-black stroke-[1.5]" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col">
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tighter leading-none mb-4">
            {title}
          </h2>

          <div className="w-full h-[2px] bg-black mb-4"></div>

          <p className="text-xs font-mono font-bold tracking-[0.2em] text-black/90 uppercase">
            {subtitle}
          </p>
        </div>

      </div>
    </div>
  );
}
