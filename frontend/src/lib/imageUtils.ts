
const images = import.meta.glob('@/assets/products/*.{png,jpg,jpeg,svg,webp}', { eager: true, as: 'url' });

export const getImageUrl = (imageName: string): string => {
    // If absolute URL (http/https), return as is (fallback for existing data)
    if (imageName?.startsWith('http') || imageName?.startsWith('data:')) {
        return imageName;
    }

    // Try to find exact match
    const path = `/src/assets/products/${imageName}`;
    const key = Object.keys(images).find(k => k.endsWith(imageName));

    if (key && images[key]) {
        // In production/eager mode, the value is the URL string
        return images[key] as unknown as string;
    }

    // Fallback placeholder or empty string
    return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
};
