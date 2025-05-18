interface PageHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const PageHeader = ({ className, children }: PageHeaderProps) => {
  return <h2 className={`text-2xl font-medium ${className}`}>{children}</h2>;
};

export default PageHeader;
