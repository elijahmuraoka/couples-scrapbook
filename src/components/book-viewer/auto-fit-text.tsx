'use client';

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react';

interface AutoFitTextProps {
    text: string;
    className?: string;
    minFontSize?: number;
    maxFontSize?: number;
    footer?: ReactNode;
}

export function AutoFitText({
    text,
    className,
    minFontSize = 6,
    maxFontSize = 22,
    footer,
}: AutoFitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState<number | null>(null);

    const fitText = useCallback(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        const availableHeight = container.clientHeight;
        if (availableHeight === 0) return;

        let low = minFontSize;
        let high = maxFontSize;

        while (high - low > 0.5) {
            const mid = (low + high) / 2;
            content.style.fontSize = `${mid}px`;

            if (content.scrollHeight <= availableHeight) {
                low = mid;
            } else {
                high = mid;
            }
        }

        const finalSize = Math.floor(low * 2) / 2;
        content.style.fontSize = `${finalSize}px`;
        setFontSize(finalSize);
    }, [minFontSize, maxFontSize]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => fitText());
        observer.observe(container);

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
            <div
                ref={contentRef}
                style={{
                    opacity: fontSize === null ? 0 : 1,
                    transition: 'opacity 0.2s ease-in',
                }}
            >
                <p className={className}>
                    {text}
                </p>
                {footer}
            </div>
        </div>
    );
}
