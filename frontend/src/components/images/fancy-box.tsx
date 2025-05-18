import { useEffect, useRef } from 'react';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

type FancyboxProps = {
  delegate?: string;
  options?: Record<string, unknown>;
  children?: React.ReactNode;
};

const Fancybox = ({
  delegate = '[data-fancybox]',
  options,
  children,
}: FancyboxProps) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef}>{children}</div>;
};

export default Fancybox;
