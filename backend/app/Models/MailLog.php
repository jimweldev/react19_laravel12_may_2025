<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailLog extends Model {
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function mail_template() {
        return $this->belongsTo(MailTemplate::class);
    }

    public function mail_log_attachments() {
        return $this->hasMany(MailLogAttachment::class, 'mail_log_id', 'id');
    }
}
