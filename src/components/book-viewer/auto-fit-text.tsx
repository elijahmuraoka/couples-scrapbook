'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface AutoFitTextProps {
    text: string;
    className?: string;
    minFontSize?: number;
    maxFontSize?: number;
}

export function AutoFitText({
    text,
    className,
    minFontSize = 6,
    maxFontSize = 22,
}: AutoFitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const [fontSize, setFontSize] = useState<number | null>(null);

    const fitText = useCallback(() => {
        const container = containerRef.current;
        const textEl = textRef.current;
        if (!container || !textEl) return;

        const availableHeight = container.clientHeight;
        if (availableHeight === 0) return;

        let low = minFontSize;
        let high = maxFontSize;

        while (high - low > 0.5) {
            const mid = (low + high) / 2;
            textEl.style.fontSize = `${mid}px`;

            if (textEl.scrollHeight <= availableHeight) {
                low = mid;
            } else {
                high = mid;
            }
        }

        const finalSize = Math.floor(low * 2) / 2;
        textEl.style.fontSize = `${finalSize}px`;
        setFontSize(finalSize);
    }, [minFontSize, maxFontSize]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => fitText());
        observer.observe(container);

        // Re-fit after custom fonts load (measurement may differ with fallback font)
        document.fonts.ready.then(() => fitText());

        return () => observer.disconnect();
    }, [fitText]);

    useEffect(() => {
        fitText();
    }, [text, fitText]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        >
            <p
                ref={textRef}
                className={className}
                style={{
                    opacity: fontSize === null ? 0 : 1,
                    transition: 'opacity 0.2s ease-in',
                }}
            >
                {text}
            </p>
        </div>
    );
}
