<?php

namespace App\Console\Commands;

use App\Models\MailLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class MailSender
 *
 * Console command to process and send queued emails stored in the mail_logs table.
 * It dynamically renders the content using a mail template and handles attachments, CC, and BCC.
 */
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
    protected $description = 'Sends unsent emails from the mail log using stored templates and attachments.';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle() {
        // Fetch all unsent mail logs along with related templates and attachments
        $mailLogs = MailLog::where('is_sent', false)
            ->with(['mail_template:id,content', 'mail_log_attachments:mail_log_id,file_url'])
            ->get();

        // Loop through each pending mail log
        foreach ($mailLogs as $mailLog) {
            // Get email content template
            $template = $mailLog->mail_template->content;

            // Parse dynamic data used to replace placeholders in the template
            $contentData = json_decode($mailLog->content_data, true) ?? [];

            // Replace placeholders in the template with actual data
            $content = $template;
            foreach ($contentData as $key => $value) {
                $content = str_replace('{{ '.$key.' }}', $value, $content);
            }

            // Decode CC and BCC recipients
            $cc = json_decode($mailLog->cc, true) ?? [];
            $bcc = json_decode($mailLog->bcc, true) ?? [];

            // Send the email using Laravel's Mail facade
            Mail::html($content, function ($message) use ($mailLog, $cc, $bcc) {
                // Set the recipient and subject
                $message->to($mailLog->recipient_email, $mailLog->recipient)
                    ->subject($mailLog->subject);

                // Add CC recipients
                foreach ($cc as $email) {
                    $message->cc($email);
                }

                // Add BCC recipients
                foreach ($bcc as $email) {
                    $message->bcc($email);
                }

                // Log the number of attachments for diagnostics
                Log::info('Attachment count: '.count($mailLog->mail_log_attachments));

                // Loop through and attach each file
                foreach ($mailLog->mail_log_attachments as $attachment) {
                    try {
                        // Get the file content from the stored URL
                        $fileContent = file_get_contents($attachment->file_url);

                        if ($fileContent !== false) {
                            // Attach file data with original filename
                            $message->attachData($fileContent, $attachment->file_name ?? basename($attachment->file_url));

                            // Free memory used by the file content
                            unset($fileContent);
                            gc_collect_cycles();
                        } else {
                            Log::warning("Unable to read file from: {$attachment->file_url}");
                        }
                    } catch (\Exception $e) {
                        // Log any exceptions during attachment handling
                        Log::error("Attachment error [{$attachment->file_url}]: ".$e->getMessage());
                    }
                }
            });

            // Mark the mail log as sent
            // $mailLog->update(['is_sent' => true]);
        }
    }
}
