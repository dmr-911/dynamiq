import React from 'react';
import AvatarGroup from './AvatarGroup';
const avatarData = [
  {
    src: 'https://example.com/image1.jpg',
    alt: 'User 1'
  },
  {
    src: 'https://example.com/image2.jpg',
    alt: 'User 2'
  },
  {
    src: 'https://example.com/image3.jpg',
    alt: 'User 3'
  }
];

function AvatarGroupStory(args: any) {
  return <AvatarGroup avatars={avatarData} {...args} />;
}

export default AvatarGroupStory;

AvatarGroupStory.argTypes = {
  size: {
    control: {
      type: 'select'
    },
    options: ['xl', 'lg', 'md', 'sm', 'xs', 'xxs', 'xxxs'],
    description: 'Size of the avatar'
  },
  avatars: {
    control: {
      type: 'array',
      of: { type: 'object', properties: { image: { type: 'string' }, name: { type: 'string' } } }
    },
    description: 'List of avatars'
  },
  limit: {
    control: {
      type: 'number'
    },
    description: 'Limit of avatars to display'
  }
};
