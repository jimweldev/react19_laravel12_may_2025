import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type ToolTipProps = {
  children: React.ReactNode;
  content: string;
};

const ToolTip = ({ children, content }: ToolTipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolTip;
