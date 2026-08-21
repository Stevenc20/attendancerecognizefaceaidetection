<?php

namespace App\Http\Controllers\Piket;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->format('Y-m-d');

        $classrooms = Classroom::with(['teacher', 'students.attendances' => function ($query) use ($today) {
            $query->where('date', $today);
        }])->get();

        $stats = [
            'total_students' => 0,
            'present' => 0,
            'late' => 0,
            'absent' => 0,
            'sick_permit' => 0,
        ];

        $classData = [];
        $alerts = [];

        foreach ($classrooms as $classroom) {
            $studentsCount = $classroom->students->count();
            $stats['total_students'] += $studentsCount;

            $classStats = [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'teacher' => $classroom->teacher ? $classroom->teacher->name : 'Tanpa Wali Kelas',
                'total' => $studentsCount,
                'present' => 0,
                'late' => 0,
                'absent' => 0,
                'sick_permit' => 0,
            ];

            foreach ($classroom->students as $student) {
                $attendance = $student->attendances->first();

                if (! $attendance) {
                    $classStats['absent']++;
                    $stats['absent']++;
                    $alerts[] = [
                        'student_name' => $student->name,
                        'classroom' => $classroom->name,
                        'teacher' => $classroom->teacher ? $classroom->teacher->name : '-',
                        'status' => 'Belum Hadir',
                    ];
                } else {
                    switch ($attendance->status) {
                        case 'present':
                            $classStats['present']++;
                            $stats['present']++;
                            break;
                        case 'late':
                            $classStats['late']++;
                            $stats['late']++;
                            break;
                        case 'absent':
                            $classStats['absent']++;
                            $stats['absent']++;
                            $alerts[] = [
                                'student_name' => $student->name,
                                'classroom' => $classroom->name,
                                'teacher' => $classroom->teacher ? $classroom->teacher->name : '-',
                                'status' => 'Alpha',
                            ];
                            break;
                        case 'sick':
                        case 'permit':
                            $classStats['sick_permit']++;
                            $stats['sick_permit']++;
                            $alerts[] = [
                                'student_name' => $student->name,
                                'classroom' => $classroom->name,
                                'teacher' => $classroom->teacher ? $classroom->teacher->name : '-',
                                'status' => ucfirst($attendance->status),
                                'remarks' => $attendance->remarks,
                            ];
                            break;
                    }
                }
            }

            $classData[] = $classStats;
        }

        return Inertia::render('dashboards/piket', [
            'stats' => $stats,
            'classrooms' => $classData,
            'alerts' => $alerts,
        ]);
    }
}
