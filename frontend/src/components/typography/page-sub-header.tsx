interface PageHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const PageSubHeader = ({ className, children }: PageHeaderProps) => {
  return (
    <h4 className={`text-medium mb-1 font-semibold ${className}`}>
      {children}
    </h4>
  );
};

export default PageSubHeader;
