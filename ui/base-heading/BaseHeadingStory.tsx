import React from 'react';
import BaseHeading from './BaseHeading';

function BaseHeadingStory(args: any) {
  return <BaseHeading {...args}>Base heading</BaseHeading>;
}

BaseHeadingStory.argTypes = {
  size: {
    control: 'select',
    options: ['sm', 'md', 'lg', 'xs', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'],
    description: 'Size of the avatar'
  },
  as: {
    control: {
      type: 'select'
    },
    options: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    description: 'HTML element to render the avatar as'
  },
  lead: {
    control: {
      type: 'select'
    },
    options: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
    description: 'Line height of the avatar text'
  },
  weight: {
    control: {
      type: 'select'
    },
    options: ['bold', 'light', 'normal', 'medium', 'semibold', 'extrabold'],
    description: 'Font weight of the avatar text'
  },
  color: {
    control: {
      type: 'select'
    },
    options: [
      'primary',
      'secondary',
      'warning',
      'error',
      'success',
      'info',
      'gray',
      'dark-gray',
      'muted'
    ],
    description: 'Color theme of the avatar'
  },
  children: {
    control: 'text',
    description: 'Content to be displayed inside the avatar'
  },
  className: {
    control: 'text',
    description: 'Additional CSS classes to apply to the avatar'
  }
};

export default BaseHeadingStory;
