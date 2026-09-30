import React from 'react';
import Avatar from './Avatar';

const AvatarStory = (args: any) => {
  return <Avatar {...args} />;
};

AvatarStory.argTypes = {
  overlaps: {
    control: 'boolean',
    description: 'Determines if the avatar overlaps with other elements'
  },
  src: {
    control: 'text',
    description: 'Source URL of the avatar image'
  },
  alt: {
    control: 'text',
    description: 'Alternative text for the avatar image'
  },
  size: {
    control: {
      type: 'select'
    },
    options: ['xl', 'lg', 'md', 'sm', 'xs', 'xxs', 'xxxs'],
    description: 'Size of the avatar'
  },
  text: {
    control: 'text',
    description: 'Text to be displayed inside the avatar if no image is provided'
  },
  shape: {
    control: {
      type: 'select'
    },
    options: ['straight', 'rounded', 'smooth', 'curved', 'full'],
    description: 'Shape of the avatar'
  },
  mask: {
    control: {
      type: 'select'
    },
    options: ['hex', 'hexed', 'blob', 'deca', 'diamond'],
    description: 'Mask style of the avatar'
  },
  color: {
    control: {
      type: 'select'
    },
    options: ['default', 'primary', 'info', 'success', 'warning', 'danger', 'yellow', 'violet'],
    description: 'Color theme of the avatar'
  }
};

export default AvatarStory;
