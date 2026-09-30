import Tag, { TagProps } from './ui/tag/Tag';
import { cn } from '../../../../utils/cn';
import React, { FC } from 'react';

type MicroBadgeProps = Omit<TagProps, 'children'> & {
  text?: string;
};

const MicroBadge: FC<MicroBadgeProps> = ({ text, className, ...rest }) => {
  const successBadge = ['paid', 'success', '200', 'complete', 'active', 'post', 'delivered'];
  const infoBadge = ['get', 'single family', 'vacant land'];
  const warningBadge = ['put', 'unpaid', 'negotiating', 'progress', 'inactive'];
  const errorBadge = ['delete', '400', 'failed', 'cancelled', 'suspended'];
  const mutedBadge = ['pending', 'under review', 'invited'];

  let color: TagProps['color'] = 'default';

  if (text) {
    if (successBadge.includes(text)) {
      color = 'success';
    } else if (infoBadge.includes(text)) {
      color = 'info';
    } else if (warningBadge.includes(text)) {
      color = 'warning';
    } else if (errorBadge.includes(text)) {
      color = 'error';
    } else if (mutedBadge.includes(text)) {
      color = 'muted';
    }
  }

  return (
    <Tag color={color} className={cn('capitalize', className && className)} {...rest}>
      {text}
    </Tag>
  );
};

export default MicroBadge;
