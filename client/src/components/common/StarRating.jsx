import { Star } from 'lucide-react';
import { starsArray } from '../../utils/helpers';

/**
 * StarRating – renders filled/half/empty stars.
 * @param {number}  rating    - e.g. 4.3
 * @param {number}  count     - review count label
 * @param {string}  size      - 'sm' | 'md' | 'lg'
 * @param {boolean} showCount - show the review count
 */
export default function StarRating({
  rating = 0,
  count,
  size = 'sm',
  showCount = true,
  className = '',
}) {
  const stars = starsArray(rating);

  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  const iconSize = sizeMap[size] || sizeMap.sm;

  const textMap = { xs: 'text-xs', sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  const textSize = textMap[size] || textMap.sm;

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`Rating: ${rating} out of 5`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {stars.map((s, idx) => (
          <span key={idx} className="relative inline-block">
            <Star className={`${iconSize} text-gray-300`} fill="currentColor" />
            {s > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: s === 1 ? '100%' : '50%' }}
              >
                <Star className={`${iconSize} text-warning-500`} fill="currentColor" />
              </span>
            )}
          </span>
        ))}
      </div>

      {typeof rating === 'number' && (
        <span className={`font-semibold text-text-primary ${textSize}`}>{rating.toFixed(1)}</span>
      )}

      {showCount && count !== undefined && (
        <span className={`text-text-muted ${textSize}`}>
          ({count.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
}
