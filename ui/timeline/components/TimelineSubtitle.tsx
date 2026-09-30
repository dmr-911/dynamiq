const TimelineSubtitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-1 text-sm font-medium text-muted-400 dark:text-muted-500">{children}</div>
  );
};

export default TimelineSubtitle;
