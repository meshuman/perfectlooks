import { icons, type IconName } from '@/data/icons';

interface Props {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  class?: string;
}

export default function Icon({ name, size = 20, strokeWidth = 1.5, class: className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`shrink-0 ${className ?? ''}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}
