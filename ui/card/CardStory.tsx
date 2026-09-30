import React from 'react';
import Card from './Card';

function CardStory(args: any) {
  return (
    <Card {...args} className="p-4">
      {...args?.children || 'this is children'}
    </Card>
  );
}

CardStory.argTypes = {
  children: {
    control: 'text',
    description: 'Content to be displayed inside the component'
  },
  color: {
    control: {
      type: 'select'
    },
    options: [
      'default',
      'contrast',
      'muted',
      'mutedContrast',
      'primary',
      'info',
      'success',
      'warning',
      'danger'
    ],
    description: 'Color theme of the component'
  },
  className: {
    control: 'text',
    description: 'Additional CSS classes to apply to the component'
  },
  shape: {
    control: {
      type: 'select'
    },
    options: ['straight', 'rounded', 'smooth', 'curved'],
    description: 'Shape of the component'
  },
  shadow: {
    control: {
      type: 'select'
    },
    options: ['flat', 'hover', 'none'],
    description: 'Shadow style of the component'
  }
};
export default CardStory;
