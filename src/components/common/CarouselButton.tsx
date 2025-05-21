import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselButton({ className, onClickLeft, onClickRight }: {className?: string, onClickLeft: () => void, onClickRight: () => void}) {
    return <div className={clsx("flex justify-between", className)}>
        <button
            className="bg-white/70 hover:bg-white/90 rounded-full shadow-md"
            onClick={onClickLeft}
        >
            <ChevronLeft className="h-6 w-6" />
        </button>

        <button
            className="bg-white/70 hover:bg-white/90 rounded-full shadow-md"
            onClick={onClickRight}
        >
            <ChevronRight className="h-6 w-6" />
        </button>
    </div>
}