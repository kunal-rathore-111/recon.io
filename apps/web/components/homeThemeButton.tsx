import Link from "next/link";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { Home } from "lucide-react";

export function HomeThemeButton({ centerText }: { centerText?: string }) {

    return <div className="flex gap-2 justify-between">
        <div className='rounded border-2 border-gray-500 dark:border-zinc-600 p-2 h-8 w-8 flex justify-center items-center shadow-sm hover:shadow-black/25 transition-all duration-300 cursor-pointer shadow-black hover:scale-97'>

            <Link href="/"><Home size={18} /></Link>
        </div>

        {centerText && <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">
                {centerText}
            </h1>

        </div>}
        <div className='rounded border-2 border-gray-500 dark:border-zinc-600 p-2  h-8 w-8 flex justify-center items-center shadow-sm hover:shadow-black/25 transition-all duration-300  shadow-black hover:scale-97'>
            <AnimatedThemeToggler />
        </div>
    </div>
} 
