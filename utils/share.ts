
import { toBlob } from 'html-to-image';

export const handleShareImage = async (
    element: HTMLElement | null,
    title: string,
    text: string
) => {
    if (!element) {
        console.error("Share element not found");
        throw new Error("Element not found");
    }

    const downloadFallback = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'progress.png';
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the object URL
    };
    
    let imageBlob: Blob;
    try {
        // Further performance optimizations: explicitly provide dimensions and skip auto-scaling
        // to reduce the library's workload and speed up blob generation. This is the most
        // critical step for preserving the "user gesture" context.
        const blob = await toBlob(element, { 
            pixelRatio: 1,
            width: 600, // Matches ShareCard component's width
            height: 400, // Matches ShareCard component's height
            skipAutoScale: true,
        });
        if (!blob) {
            throw new Error("Image blob generation failed.");
        }
        imageBlob = blob;
    } catch (generationError) {
        console.error("Failed to generate image for sharing", generationError);
        // Re-throw so the calling component can display a user-friendly error.
        throw generationError;
    }

    try {
        const file = new File([imageBlob], 'progress.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
             await navigator.share({
                title: title,
                text: text,
                files: [file],
            });
        } else {
            // Fallback for desktop or browsers that don't support sharing files
            console.log("Web Share API not supported, falling back to download.");
            downloadFallback(imageBlob);
        }
    } catch (error: any) {
        // Don't trigger download if the user simply cancelled the share dialog.
        if (error?.name === 'AbortError') {
            console.log('Share cancelled by user.');
            return;
        }
        
        console.error('Sharing failed, falling back to download', error);
        // Fallback for other errors during share process
        downloadFallback(imageBlob);
    }
};
