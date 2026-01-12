/**
 * Resizes and compresses an image file to a Base64 string.
 * @param file The file object from input.
 * @param maxWidth Maximum width of the image.
 * @param quality Quality from 0 to 1 (e.g. 0.7).
 */
export const compressImage = (file: File, maxWidth: number = 600, quality: number = 0.6, format: 'image/jpeg' | 'image/png' = 'image/jpeg'): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const elem = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                elem.width = width;
                elem.height = height;

                const ctx = elem.getContext('2d');
                if (!ctx) {
                    reject(new Error("Canvas failure"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to specified format
                const dataUrl = elem.toDataURL(format, quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
