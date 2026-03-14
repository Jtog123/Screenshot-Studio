import { ReactNode, useEffect, useRef } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function ScrollFadeIn({ children }: LayoutProps) {
    const ref = useRef<HTMLDivElement>(null);  // ✅ Specify type

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && ref.current) {
                        ref.current.classList.add("animate-fade-in");  // ✅ Fixed class name
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="opacity-0">
            {children}
        </div>
    );
}