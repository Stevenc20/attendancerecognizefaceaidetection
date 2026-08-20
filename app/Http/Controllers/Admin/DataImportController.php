<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Grade;
use App\Models\Major;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\Process\Process;

class DataImportController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/import/index');
    }

    public function store(Request $request)
    {
        // Disable execution time limit for massive imports
        set_time_limit(0);

        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB, removed mimes because Excel mimes are often misdetected
        ]);

        $file = $request->file('file');

        $importsDir = storage_path('app/imports');
        if (! is_dir($importsDir)) {
            mkdir($importsDir, 0755, true);
        }

        $fileName = 'latest_import.xlsx';
        $file->move($importsDir, $fileName);

        $fullPath = $importsDir.'/'.$fileName;
        $scriptPath = storage_path('app/scripts/parse_excel.py');

        // Execute python script to parse Excel
        $process = new Process(['python3', $scriptPath, $fullPath]);
        $process->setTimeout(300); // 5 minutes max
        $process->run();

        if (! $process->isSuccessful()) {
            $errorDetail = $process->getErrorOutput() ?: $process->getOutput();
            Log::error('Python Excel Parser Error: '.$errorDetail);

            return redirect()->back()->withErrors(['file' => 'System Error: '.substr($errorDetail, 0, 200)]);
        }

        $output = trim($process->getOutput());
        if (! file_exists($output)) {
            Log::error('Python output file not found: '.$output);

            return redirect()->back()->withErrors(['file' => 'Failed to parse Excel: Internal processing error.']);
        }

        $jsonContent = file_get_contents($output);
        $parsedData = json_decode($jsonContent, true);

        // Clean up the temp JSON file
        @unlink($output);

        if (! $parsedData || isset($parsedData['error'])) {
            $error = $parsedData['error'] ?? 'Unknown parsing error';
            Log::error('Python Excel Parser Error: '.$error);

            return redirect()->back()->withErrors(['file' => 'Failed to parse Excel: '.$error]);
        }

        $stats = [
            'classrooms_created' => 0,
            'students_imported' => 0,
            'teachers_imported' => 0,
        ];

        // Massively optimize performance by hashing once
        $defaultPassword = Hash::make('smkn40jaya');

        // Process the JSON data using a transaction for massive performance boost
        DB::transaction(function () use ($parsedData, &$stats, $defaultPassword) {
            foreach ($parsedData as $classData) {
                $gradeName = $classData['grade'];
                $majorName = $classData['major'];
                $groupNumber = $classData['group'];

                // Find or create Grade
                $grade = Grade::firstOrCreate(['name' => $gradeName]);

                // Find or create Major (generate a short code if needed)
                $majorCode = collect(explode(' ', $majorName))->map(function ($word) {
                    return substr($word, 0, 1);
                })->join('');
                $major = Major::firstOrCreate(
                    ['name' => $majorName],
                    ['code' => $majorCode]
                );

                // Find or create Classroom
                $classroomName = trim($gradeName.' '.$majorCode.' '.$groupNumber);
                $classroom = Classroom::firstOrCreate(
                    [
                        'grade_id' => $grade->id,
                        'major_id' => $major->id,
                        'section' => $groupNumber,
                    ],
                    [
                        'name' => $classroomName,
                    ]
                );
                $stats['classrooms_created']++;

                // Process Teacher (Wali Kelas)
                if (! empty($classData['teacher'])) {
                    $teacherNip = $classData['teacher']['nip'];
                    $teacherName = $classData['teacher']['name'];

                    if ($teacherNip) {
                        $teacher = User::firstOrCreate(
                            ['nip' => $teacherNip],
                            [
                                'name' => $teacherName,
                                'email' => $teacherNip.'@teacher.smkn40.sch.id',
                                'password' => $defaultPassword,
                                'role' => User::ROLE_TEACHER,
                                'account_status' => User::STATUS_ACTIVE,
                            ]
                        );

                        // Assign teacher to classroom
                        $classroom->update(['teacher_id' => $teacher->id]);
                        $stats['teachers_imported']++;
                    }
                }

                // Process Students
                $studentsToUpsert = [];
                foreach ($classData['students'] as $studentData) {
                    $nis = $studentData['nis'];
                    $name = $studentData['name'];

                    if ($nis) {
                        $studentsToUpsert[] = [
                            'nis' => $nis,
                            'name' => $name,
                            'email' => $nis.'@student.smkn40.sch.id',
                            'password' => $defaultPassword,
                            'role' => User::ROLE_STUDENT,
                            'classroom_id' => $classroom->id,
                            'account_status' => User::STATUS_ACTIVE,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        $stats['students_imported']++;
                    }
                }

                if (! empty($studentsToUpsert)) {
                    User::upsert(
                        $studentsToUpsert,
                        ['nis'],
                        ['name', 'email', 'password', 'classroom_id', 'updated_at']
                    );
                }
            }
        });

        return redirect()->back()->with('success', "Import completed successfully! Created {$stats['classrooms_created']} classes, imported {$stats['students_imported']} students and {$stats['teachers_imported']} teachers.");
    }
}
