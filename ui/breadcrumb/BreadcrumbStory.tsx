import React from 'react';
import Breadcrumb from './Breadcrumb';

function BreadcrumbStory(args: any) {
  return <Breadcrumb {...args} />;
}

BreadcrumbStory.argTypes = {
  separator: {
    control: {
      type: 'select'
    },
    options: ['slash', 'chevron', 'arrow', 'dot'],
    description: 'Type of separator used in the component'
  },
  back: {
    control: 'boolean',
    description: 'Boolean to determine if a back button is shown'
  }
};
export default BreadcrumbStory;
