<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\FaceEmbedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FaceEnrollmentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $hasEnrolled = FaceEmbedding::where('user_id', $user->id)->exists();

        return Inertia::render('student/enrollment/index', [
            'hasEnrolled' => $hasEnrolled
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'embedding' => 'required|array',
            'embedding.*' => 'numeric'
        ]);

        $user = Auth::user();

        // Delete any existing embedding
        FaceEmbedding::where('user_id', $user->id)->delete();

        // Store new embedding
        FaceEmbedding::create([
            'user_id' => $user->id,
            'embedding_data' => $request->embedding
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Face enrollment successful!');
    }
}
