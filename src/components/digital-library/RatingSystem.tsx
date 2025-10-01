import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Flag, 
  User,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface Rating {
  id: string;
  user_id: string;
  user_name?: string;
  rating: number;
  comment?: string;
  created_at: string;
  helpful_count: number;
  is_flagged: boolean;
}

interface RatingSystemProps {
  resourceId: string;
  ratings?: Rating[];
  averageRating?: number;
  totalRatings?: number;
  canRate?: boolean;
  onRatingSubmit?: (rating: number, comment: string) => void;
  onHelpfulClick?: (ratingId: string) => void;
  onFlagClick?: (ratingId: string) => void;
}

export const RatingSystem: React.FC<RatingSystemProps> = ({
  resourceId,
  ratings = [],
  averageRating = 0,
  totalRatings = 0,
  canRate = true,
  onRatingSubmit,
  onHelpfulClick,
  onFlagClick
}) => {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    if (!showRatingForm) {
      setShowRatingForm(true);
    }
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRatingSubmit?.(userRating, userComment);
      setUserRating(0);
      setUserComment('');
      setShowRatingForm(false);
      toast.success('تم إرسال التقييم بنجاح');
    } catch (error) {
      toast.error('فشل في إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              interactive ? 'cursor-pointer' : ''
            } ${
              star <= (interactive ? (hoverRating || userRating) : rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => handleStarClick(star) : undefined}
            onMouseEnter={interactive ? () => handleStarHover(star) : undefined}
            onMouseLeave={interactive ? handleStarLeave : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            التقييمات والمراجعات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div>
                {renderStars(averageRating)}
                <p className="text-sm text-muted-foreground mt-1">
                  {totalRatings} تقييم
                </p>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter(r => r.rating === star).length;
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{star}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Form */}
      {canRate && (
        <Card>
          <CardHeader>
            <CardTitle>قيّم هذا المصدر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">تقييمك</label>
              {renderStars(0, true)}
            </div>
            
            {showRatingForm && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    تعليق (اختياري)
                  </label>
                  <Textarea
                    placeholder="شاركنا رأيك في هذا المصدر..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitRating}
                    disabled={isSubmitting || userRating === 0}
                  >
                    {isSubmitting ? (
                      <>جاري الإرسال...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 ml-2" />
                        إرسال التقييم
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowRatingForm(false);
                      setUserRating(0);
                      setUserComment('');
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">المراجعات</h3>
        
        {ratings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد مراجعات بعد</p>
              <p className="text-sm text-muted-foreground mt-1">
                كن أول من يقيّم هذا المصدر
              </p>
            </CardContent>
          </Card>
        ) : (
          ratings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {rating.user_name || 'مستخدم'}
                      </span>
                      {renderStars(rating.rating)}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(rating.created_at)}
                      </span>
                    </div>
                    
                    {rating.comment && (
                      <p className="text-sm leading-relaxed">
                        {rating.comment}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onHelpfulClick?.(rating.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ThumbsUp className="h-3 w-3 ml-1" />
                        مفيد ({rating.helpful_count})
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFlagClick?.(rating.id)}
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <Flag className="h-3 w-3 ml-1" />
                        إبلاغ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};