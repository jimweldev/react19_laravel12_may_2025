import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { MailLog } from '@/_types/mail-log';
import ErrorDialog from '@/components/errors/error-dialog';
import InputGroup from '@/components/forms/input-group';
import IframePreview from '@/components/iframe/iframe-preview';
import Fancybox from '@/components/images/fancy-box';
import DialogSkeleton from '@/components/skeletons/dialog-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mainInstance } from '@/instances/main-instance';
import { getDateTimezone } from '@/lib/get-date-timezone';

type ViewMailLogProps = {
  selectedItem: MailLog | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const populateTemplate = (data: MailLog | null | undefined): string => {
  if (!data || !data.mail_template || !data.content_data) {
    return '';
  }

  let content: Record<string, string>;
  try {
    content = JSON.parse(data.content_data);
  } catch (_error) {
    toast.error('Failed to parse content data');
    return '';
  }

  const template = data.mail_template.content || '';

  return template.replace(/{{\s*(\w+)\s*}}/g, (_match: string, key: string) => {
    return content[key] ?? '';
  });
};

const ViewMailLog: React.FC<ViewMailLogProps> = ({
  selectedItem,
  open,
  setOpen,
}) => {
  const title = 'View Mail Log';
  const description = 'View mail log';
  const {
    data: mailLog,
    isFetching,
    error,
  } = useQuery<MailLog>({
    queryKey: ['mail/templates', 'view', selectedItem?.id],
    queryFn: async ({ signal }) => {
      const res = await mainInstance.get<MailLog>(
        `/api/mails/logs/${selectedItem?.id}`,
        { signal },
      );
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  const getCommaSeparated = (cc: string) => {
    try {
      const ccArray = JSON.parse(cc || '[]');
      if (!Array.isArray(ccArray)) {
        throw new Error('Parsed value is not an array.');
      }
      return ccArray.join(', ');
    } catch (_error) {
      return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="lg">
        {isFetching ? (
          <DialogSkeleton
            title={title}
            description={description}
            inputCount={1}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogBody>
              {error ? (
                <ErrorDialog error={error} />
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2">
                    <InputGroup className="col-span-12 md:col-span-12">
                      <div className="flex items-center border px-3">
                        <div className="text-xs">Subject</div>
                      </div>
                      <Input
                        type="text"
                        inputSize="sm"
                        value={mailLog?.subject || ''}
                        readOnly
                      />
                    </InputGroup>

                    <InputGroup className="col-span-12 md:col-span-6">
                      <div className="flex items-center border px-3">
                        <div className="text-xs">To</div>
                      </div>
                      <Input
                        type="text"
                        inputSize="sm"
                        value={mailLog?.recipient_email || ''}
                        readOnly
                      />
                    </InputGroup>
                    <InputGroup className="col-span-12 md:col-span-6">
                      <div className="flex items-center border px-3">
                        <div className="text-xs">Date</div>
                      </div>
                      <Input
                        type="text"
                        inputSize="sm"
                        value={getDateTimezone(
                          mailLog?.created_at || '',
                          'date_time',
                        )}
                        readOnly
                      />
                    </InputGroup>
                    <InputGroup className="col-span-12 md:col-span-6">
                      <div className="flex items-center border px-3">
                        <div className="text-xs">Cc</div>
                      </div>
                      <Input
                        type="text"
                        inputSize="sm"
                        value={getCommaSeparated(mailLog?.cc || '') || '-'}
                        readOnly
                      />
                    </InputGroup>
                    <InputGroup className="col-span-12 md:col-span-6">
                      <div className="flex items-center border px-3">
                        <div className="text-xs">Bcc</div>
                      </div>
                      <Input
                        type="text"
                        inputSize="sm"
                        value={getCommaSeparated(mailLog?.bcc || '') || '-'}
                        readOnly
                      />
                    </InputGroup>
                  </div>

                  <IframePreview htmlContent={populateTemplate(mailLog)} />
                  <Fancybox>
                    <div className="flew-wrap flex gap-2">
                      {mailLog?.mail_log_attachments?.map(attachment => (
                        <a
                          key={attachment.id}
                          data-fancybox={`${attachment.id}`}
                          href={attachment.file_url}
                        >
                          <Badge>{attachment.file_name}</Badge>
                        </a>
                      ))}
                    </div>
                  </Fancybox>
                </div>
              )}
            </DialogBody>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMailLog;
