import { useState } from 'react';
import { Star, ThumbsUp, User, ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/imageUtils';

interface Review {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    images?: string[];
    likes: number;
    verified?: boolean;
}

// Mock data generator based on productId to simulate dynamic content
const getMockReviews = (productId: string): Review[] => {
    return [
        {
            id: '1',
            userName: 'Anjali Sharma',
            rating: 5,
            date: '12 Oct, 2023',
            comment: 'Absolutely love the fabric quality! It looks exactly like the picture. Very elegant and perfect for weddings.',
            likes: 24,
            verified: true,
            images: [
                // Using placeholder images for demo
                '/placeholder-review-1.jpg'
            ]
        },
        {
            id: '2',
            userName: 'Priya Iyer',
            rating: 4,
            date: '05 Sep, 2023',
            comment: 'Great saree, very comfortable to wear. The color is slightly darker than the image but still beautiful.',
            likes: 12,
            verified: true
        },
        {
            id: '3',
            userName: 'Sneha Patel',
            rating: 5,
            date: '28 Aug, 2023',
            comment: 'Fast delivery and amazing packaging. The silk feels very premium. Will definitely buy again.',
            likes: 8,
            verified: true
        },
        {
            id: '4',
            userName: 'Meera K',
            rating: 3,
            date: '10 Aug, 2023',
            comment: 'Quality is good but delivery took longer than expected.',
            likes: 2,
            verified: true
        }
    ];
};

interface ProductReviewsProps {
    productId: string;
    rating: number;
    reviewsCount: number;
}

const ProductReviews = ({ productId, rating, reviewsCount }: ProductReviewsProps) => {
    const reviews = getMockReviews(productId);

    // Calculate distribution
    const total = reviews.length;
    const distribution = {
        5: Math.round((reviews.filter(r => r.rating === 5).length / total) * 100) || 60,
        4: Math.round((reviews.filter(r => r.rating === 4).length / total) * 100) || 20,
        3: Math.round((reviews.filter(r => r.rating === 3).length / total) * 100) || 10,
        2: Math.round((reviews.filter(r => r.rating === 2).length / total) * 100) || 5,
        1: Math.round((reviews.filter(r => r.rating === 1).length / total) * 100) || 5,
    };

    return (
        <div className="mt-16 border-t pt-10">
            <h2 className="font-serif text-2xl font-semibold mb-8">Ratings & Reviews</h2>

            <div className="grid md:grid-cols-12 gap-10">
                {/* Rating Summary */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <div className="flex items-end gap-4">
                        <div className="text-5xl font-bold font-display text-foreground">{rating}</div>
                        <div className="mb-1">
                            <div className="flex text-gold mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className={i < Math.round(rating) ? "fill-gold" : "text-muted/30 fill-muted/30"} />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{reviewsCount} Reviews</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-3 text-sm">
                                <span className="w-3 font-medium">{star}</span>
                                <Star size={12} className="text-gold fill-gold" />
                                <Progress value={distribution[star as keyof typeof distribution]} className="h-2" />
                                <span className="w-8 text-right text-muted-foreground">{distribution[star as keyof typeof distribution]}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-10 bg-muted/20 rounded-xl">
                            <p className="text-muted-foreground">No reviews yet. Be the first to review this product.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b pb-6 last:border-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {review.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground">{review.userName}</h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-[4px] flex items-center gap-1">
                                                        {review.rating} <Star size={10} className="fill-current" />
                                                    </span>
                                                    <span>• {review.date}</span>
                                                    {review.verified && <span className="text-green-600 font-medium">• Verified Buyer</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-foreground/80 my-3 leading-relaxed">
                                        {review.comment}
                                    </p>

                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mb-3">
                                            {review.images.map((img, idx) => (
                                                <div key={idx} className="w-16 h-16 rounded-lg bg-muted overflow-hidden border">
                                                    {/* Use placeholder if real image fails */}
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <ImageIcon size={20} className="text-muted-foreground" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mt-3">
                                        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
                                            <ThumbsUp size={14} className="mr-1.5" /> Helpful ({review.likes})
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center pt-4">
                        <Button variant="outline">View All Reviews</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
