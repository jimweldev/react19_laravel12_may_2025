<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('mail_log_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_log_id')->constrained()->onDelete('cascade');
            $table->string('file_name')->nullable();
            $table->string('file_type');
            $table->string('file_url');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('mail_log_attachments');
    }
};
