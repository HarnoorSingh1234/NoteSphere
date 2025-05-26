import { Heart } from 'lucide-react';

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onToggleLike: () => void;
  disabled?: boolean;
}

export default function LikeButton({ isLiked, likesCount, onToggleLike, disabled }: LikeButtonProps) {
  return (
    <button
      onClick={onToggleLike}
      disabled={disabled}
      className={`flex items-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 ${
        isLiked ? 'text-[#DE5499]' : 'text-[#264143]/70'
      }`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-[0.15em] transition-all ${
        isLiked 
          ? 'border-[#DE5499] bg-[#DE5499]/10' 
          : 'border-[#264143]/20 bg-[#EDDCD9]/70'
      }`}>
        <Heart 
          className={`h-3.5 w-3.5 transition-all ${isLiked ? 'fill-[#DE5499]' : ''}`}
        />
      </div>
      <span className="text-sm font-medium">
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
}