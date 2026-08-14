<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaceEmbedding;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentEnrollmentController extends Controller
{
    public function index(User $student)
    {
        if ($student->role !== User::ROLE_STUDENT) {
            abort(403);
        }

        $hasEnrolled = FaceEmbedding::where('user_id', $student->id)->exists();

        return Inertia::render('admin/students/enroll', [
            'student' => $student,
            'hasEnrolled' => $hasEnrolled
        ]);
    }

    public function store(Request $request, User $student)
    {
        if ($student->role !== User::ROLE_STUDENT) {
            abort(403);
        }

        $request->validate([
            'embedding' => 'required|array'
        ]);

        // Delete any existing embedding
        FaceEmbedding::where('user_id', $student->id)->delete();

        // Store new embedding
        FaceEmbedding::create([
            'user_id' => $student->id,
            'embedding_data' => $request->embedding
        ]);

        return redirect()->route('admin.students')->with('success', "Face enrollment for {$student->name} successful!");
    }
}
