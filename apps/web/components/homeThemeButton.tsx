import Link from "next/link";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { Home } from "lucide-react";


export function HomeButton() {
    return <Link href="/">
        <Home size={19} className="rounded border-2 dark:shadow-white dark:hover:shadow-white/20 dark:shadow-xs p-2 h-9 w-9 flex justify-center items-center shadow-sm hover:shadow-black/25 transition-all duration-300 cursor-pointer shadow-black hover:scale-97" />
    </Link>

}


export function ThemeButton() {
    return <AnimatedThemeToggler className="rounded border-2 dark:shadow-white dark:hover:shadow-white/20 dark:shadow-xs  p-2 h-9 w-9 flex justify-center items-center shadow-sm hover:shadow-black/25  dark:hover:shadow-none transition-all duration-300 cursor-pointer shadow-black hover:scale-97" />

}

export function HomeThemeButton({ centerText }: { centerText?: string }) {

    return <div className="flex gap-2 justify-between">

        <HomeButton />
        {centerText && <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">
                {centerText}
            </h1>

        </div>}

        <ThemeButton />
    </div>

} 
