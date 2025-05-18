import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  docco,
  monokaiSublime,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useThemeStore from '@/_stores/theme-store';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type CodePreviewProps = {
  code: string;
  lineNumbers?: number[];
  className?: string;
  children: ReactNode;
};

const CodePreview = ({
  code,
  lineNumbers = [],
  className,
  children,
}: CodePreviewProps) => {
  const { theme } = useThemeStore();
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Tabs defaultValue="preview">
      <Card className={className}>
        <TabsList variant="outline">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <CardBody>
          <TabsContent value="preview">{children}</TabsContent>
          <TabsContent value="code">
            <div className="relative">
              <Button
                variant="ghost"
                size="xs"
                className="absolute top-2 right-2 z-10"
                onClick={onCopy}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <SyntaxHighlighter
                language="typescript"
                style={theme === 'dark' ? monokaiSublime : docco}
                showLineNumbers
                wrapLines
                customStyle={{
                  maxHeight: '400px',
                  overflow: 'auto',
                  borderRadius: '10px',
                  fontSize: '14px',
                }}
                lineProps={lineNumber => ({
                  style: {
                    display: 'block',
                    backgroundColor: lineNumbers.includes(lineNumber)
                      ? theme === 'dark'
                        ? '#3f3f3f'
                        : '#f0f0f0'
                      : 'transparent',
                  },
                })}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        </CardBody>
      </Card>
    </Tabs>
  );
};

export default CodePreview;
