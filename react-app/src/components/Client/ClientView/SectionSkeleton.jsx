import { capitalize } from 'lodash';

export default function SectionSkeleton({
  title,
  children,
  noBoundary,
  noOuterStyles,
}) {
  const className = noOuterStyles
    ? ''
    : noBoundary
      ? 'bg-white mb-3'
      : 'bg-white rounded-2 border overflow-hidden border-dark shadow-sm mb-3';
  return (
    <div className={className}>
      <div className="rounded-top-2 custom-bg-grey text-white text-center p-1">
        {capitalize(title)}
      </div>
      {children}
    </div>
  );
}
