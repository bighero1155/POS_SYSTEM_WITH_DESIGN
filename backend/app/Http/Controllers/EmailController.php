<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EmailController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $processedMessage = $this->formatPesoInMessage($validated['message']);

        $emailContent = "
            <div style='font-family: monospace;'>
                <p>Hi, " . htmlspecialchars($validated['name'], ENT_QUOTES, 'UTF-8') . ",</p>
                <p>Here is your purchase receipt from REKBRANEZ:</p>
                <pre style='background:#f8f9fa; padding:10px; border-radius:4px; white-space: pre-wrap;'>" .
            htmlspecialchars($processedMessage, ENT_QUOTES, 'UTF-8') .
            "</pre>
            </div>
        ";

        $response = Http::post('https://hook.eu2.make.com/caf4tbvnah15gp9kebmae5kqrp8rjdda', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $emailContent,
            'currency' => 'PHP',
            'raw_message' => $processedMessage,
        ]);

        return response()->json([
            'message' => $response->successful()
                ? 'Thank you for your Purchase!'
                : 'Failed to submit Receipt',
            'success' => $response->successful(),
        ], $response->status());
    }

    private function formatPesoInMessage($message)
    {
        $message = preg_replace('/(\d+(?:\.\d{2})?)\b/', '$1 PHP', $message);
        $message = preg_replace('/(php|peso|pesos)\s*php/i', 'PHP', $message);
        $message = preg_replace('/php\s+php/i', 'PHP', $message);

        return $message;
    }
}
