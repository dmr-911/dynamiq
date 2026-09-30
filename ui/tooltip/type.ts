import { Placement } from '@floating-ui/react';
import { ReactNode } from 'react';

export interface TooltipProps {
  content?: ReactNode;
  placement?: Placement;
  indicatorArrow?: boolean;
  children: ReactNode;
  className?: string;
  arrowColor?: string;
}
