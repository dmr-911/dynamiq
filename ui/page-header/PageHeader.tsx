'use client';

import React, { ReactNode } from 'react';
import BaseHeading from '../base-heading/BaseHeading';
import BaseParagraph from '../base-paragraph/BaseParagraph';

type PageHeaderProps = {
  title: string;
  description?: string;
  cta?: ReactNode;
  badge?: any;
  titleSize?:
    | 'sm'
    | 'base'
    | 'lg'
    | 'md'
    | 'xs'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  lead?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  weight?: 'bold' | 'light' | 'normal' | 'medium' | 'semibold' | 'extrabold';
  color?:
    | 'primary'
    | 'secondary'
    | 'warning'
    | 'error'
    | 'success'
    | 'info'
    | 'gray'
    | 'dark-gray'
    | 'muted';
};

const PageHeader = ({
  title,
  description,
  cta,
  badge,
  titleSize = '2xl',
  as = 'h2',
  lead = 'tight',
  weight = 'semibold',
  color
}: PageHeaderProps) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* TILE & DESCRIPTION */}
        <div className="mb-4 md:mb-0 md:mr-4">
          <div className="flex items-center gap-x-2">
            <BaseHeading size={titleSize} as={as} lead={lead} weight={weight} color={color}>
              {title}
            </BaseHeading>
            {badge && badge}
          </div>
          <BaseParagraph size="sm" lead="normal">
            {description}
          </BaseParagraph>
        </div>
        {/* CTA BUTTONS */}
        {cta}
      </div>
    </div>
  );
};

export default PageHeader;
