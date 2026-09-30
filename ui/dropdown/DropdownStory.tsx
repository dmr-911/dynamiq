import React from 'react';
import Dropdown from './Dropdown';

const DropdownStory = (args: any) => {
  return <Dropdown>This is dropdown</Dropdown>;
};

// DropdownStory.argTypes = {
//   children: {
//     control: {
//       type: 'text'
//     },
//     description: 'Content inside the dropdown'
//   },
//   title: {
//     control: 'text',
//     description: 'Title of the dropdown'
//   },
//   toggleIcon: {
//     control: 'text',
//     description: 'CSS class or icon name for the toggle icon'
//   },
//   toggleImage: {
//     control: 'react-element',
//     description: 'React element or image for the toggle button'
//   },
//   indicator: {
//     control: 'boolean',
//     description: 'Show an indicator arrow or not'
//   },
//   showAll: {
//     control: 'text',
//     description: 'Text to show when all options are displayed'
//   },
//   toggleClassNames: {
//     control: 'text',
//     description: 'CSS class names for the toggle button'
//   },
//   indicatorClasses: {
//     control: 'text',
//     description: 'CSS class names for the indicator'
//   },
//   orientation: {
//     control: {
//       type: 'select'
//     },
//     options: ['start', 'end'],
//     description: 'Orientation of the dropdown'
//   },
//   shape: {
//     control: {
//       type: 'select'
//     },
//     options: ['straight', 'rounded', 'smooth', 'curved'],
//     description: 'Shape of the dropdown'
//   }
// };
export default DropdownStory;
