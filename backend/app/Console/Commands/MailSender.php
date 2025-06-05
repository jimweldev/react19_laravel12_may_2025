<?php

namespace App\Console\Commands;

use App\Models\MailLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailSender extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:mail-sender';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle() {
        $mailLogs = MailLog::where('is_sent', false)
            ->with(['mail_template:id,content', 'mail_log_attachments:mail_log_id,file_url']) // include attachments
            ->get();

        foreach ($mailLogs as $mailLog) {
            $template = $mailLog->mail_template->content;
            $contentData = json_decode($mailLog->content_data, true) ?? [];

            // Apply content data to template
            $content = $template;
            foreach ($contentData as $key => $value) {
                $content = str_replace('{{ '.$key.' }}', $value, $content);
            }

            $cc = json_decode($mailLog->cc, true) ?? [];
            $bcc = json_decode($mailLog->bcc, true) ?? [];

            Mail::html($content, function ($message) use ($mailLog, $cc, $bcc) {
                $message->to($mailLog->recipient_email, $mailLog->recipient)
                    ->subject($mailLog->subject);

                foreach ($cc as $email) {
                    $message->cc($email);
                }

                foreach ($bcc as $email) {
                    $message->bcc($email);
                }

                Log::info('Attachment count: '.count($mailLog->mail_log_attachments));

                foreach ($mailLog->mail_log_attachments as $attachment) {
                    try {
                        $fileContent = file_get_contents($attachment->file_url);

                        if ($fileContent !== false) {
                            $message->attachData($fileContent, basename($attachment->file_url));

                            // Free memory
                            unset($fileContent);
                            gc_collect_cycles();
                        } else {
                            Log::warning("Unable to read file from: {$attachment->file_url}");
                        }
                    } catch (\Exception $e) {
                        Log::error("Attachment error [{$attachment->file_url}]: ".$e->getMessage());
                    }
                }
            });

            // Optionally mark as sent
            // $mailLog->update(['is_sent' => true]);
        }
    }
}
