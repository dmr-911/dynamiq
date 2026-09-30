import React from 'react';
import TimelineItem from './components/TimelineItem';
import TimelineContainer from './components/TimelineContainer';
import TimelineTitle from './components/TimelineTitle';
import TimelineSubtitle from './components/TimelineSubtitle';
import TimelineContent from './components/TimelineContent';

interface Activity {
  [key: string]: any;
  title?: string | { type: string; name: string };
  subtitle?: string;
  icon?: string;
}

export interface TimelineProps {
  activities: Activity[];
  content?: string | ((activity: Activity) => React.ReactNode);
  title?: string | ((activity: Activity) => React.ReactNode);
  subtitle?: string | ((activity: Activity) => React.ReactNode);
}

const Timeline: React.FC<TimelineProps> = ({ activities, content, title, subtitle }) => {
  return (
    <div>
      <div className="relative">
        {activities?.map((activity, index) => (
          <TimelineItem
            key={index}
            icon={activity?.icon}
            isLast={index === activities?.length - 1}
            isSuccess={activity?.status === 'complete'}
          >
            <TimelineContainer>
              {/* check title is string or component */}

              {title ? (
                typeof title === 'string' ? (
                  <TimelineTitle>{title}</TimelineTitle>
                ) : (
                  <TimelineTitle>{title(activity)}</TimelineTitle>
                )
              ) : activity?.title ? (
                <TimelineTitle>
                  {typeof activity.title === 'string' ? activity.title : activity.title.name}
                </TimelineTitle>
              ) : null}

              {/* check title is string or component */}
              {subtitle ? (
                typeof subtitle === 'string' ? (
                  <TimelineSubtitle>{subtitle}</TimelineSubtitle>
                ) : (
                  <TimelineSubtitle>{subtitle(activity)}</TimelineSubtitle>
                )
              ) : activity?.subtitle ? (
                <TimelineSubtitle>{activity.subtitle}</TimelineSubtitle>
              ) : null}

              {/* check content is string or component */}
              {content &&
                (typeof content === 'string' ? (
                  <TimelineContent>{content}</TimelineContent>
                ) : (
                  <TimelineContent>{content(activity)}</TimelineContent>
                ))}
            </TimelineContainer>
          </TimelineItem>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
