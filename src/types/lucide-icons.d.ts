declare module 'lucide-react/dist/esm/icons/*.js' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

  export type LucideIcon = ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>
  >;

  const icon: LucideIcon;
  export default icon;
}
