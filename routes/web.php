<?php

use App\Models\Branch;
use App\Models\Equipment;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EquipmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

// Secure database migration route using a secret key
Route::get('/run-migrations', function () {
    if (request('token') !== 'hire2026')
        abort(403);
    Artisan::call('migrate:fresh', ['--force' => true]);
    return 'Migrations completed successfully!';
});

// Secure database setup route using a secret key
Route::get('/setup-db-secret', function () {
    if (request('token') !== 'hire2026')
        abort(403);
    Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
    return 'Logistics tables created and seeded!';
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'branches' => Branch::all(),
        'equipment' => Equipment::with('branch')->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/equipment/{equipment}/transfer', [EquipmentController::class, 'transfer'])
    ->middleware(['auth', 'verified'])
    ->name('equipment.transfer');

Route::post('/equipment/{equipment}/receive', [EquipmentController::class, 'receive'])
    ->middleware(['auth', 'verified'])
    ->name('equipment.receive');

Route::post('/equipment/{equipment}/inspect', [EquipmentController::class, 'inspect'])
    ->middleware(['auth', 'verified'])
    ->name('equipment.inspect');

Route::get('/logs', [EquipmentController::class, 'logs'])
    ->middleware(['auth', 'verified'])
    ->name('logs');

Route::middleware('auth')->group(function () {
    Route::resource('/equipment', EquipmentController::class);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// MOBILE API ENDPOINTS (Mobile Apps / Scanners)

Route::get('/api/equipment/{serial_number}', function ($serial_number) {
    $equipment = Equipment::with('branch')
        ->where('serial_number', $serial_number)
        ->first();
    
    if (!$equipment) {
        return response()->json([
            'success' => false,
            'message' => 'Equipment not found in the system.'
        ], 404);
    }

    // Return a clean JSON response structured for a mobile app
    return response()->json([
        'success' => true,
        'data' => [
            'id' => $equipment->id,
            'name' => $equipment->name,
            'serial_number' => $equipment->serial_number,
            'status' => strtoupper($equipment->status),
            'current_location' => $equipment->branch->name,
            'last_updated' => $equipment->updated_at->diffForHumans(),
        ]
    ]);
});

require __DIR__ . '/auth.php';