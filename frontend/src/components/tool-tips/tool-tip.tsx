import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type ToolTipProps = {
  children: React.ReactNode;
  content: string;
  delayDuration?: number;
};

const ToolTip = ({ children, content, delayDuration = 500 }: ToolTipProps) => {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolTip;
