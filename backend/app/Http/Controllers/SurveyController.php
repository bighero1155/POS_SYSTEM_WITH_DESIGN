<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function index()
    {
        return Survey::orderBy('created_at', 'desc')->get();
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating'   => 'required|integer|min:1|max:5',
            'comment'  => 'nullable|string|max:255',
        ]);

        $survey = Survey::create($validated);

        return response()->json([
            'message' => 'Thank you for your feedback and Suggestions!',
            'survey' => $survey
        ], 201);
    }
}
