<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\InspectionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function transfer(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
        ]);

        $equipment->update([
            'branch_id' => $validated['branch_id'],
            'status' => 'in_transit'
        ]);

        // Inertia will automatically refresh the frontend data
        return back();
    }

    public function receive(Equipment $equipment)
    {
        if ($equipment->status === 'in_transit') {
            $equipment->update(['status' => 'available']);
        }

        return back();
    }

    public function inspect(Equipment $equipment)
    {
        // Only allow inspection logs for items currently in maintenance
        if ($equipment->status === 'maintenance') {
            $equipment->update([
                'status' => 'available'
            ]);
        }
        // Generate the audit trail record
        InspectionLog::create([
            'equipment_id' => $equipment->id,
            'user_id' => auth()->id(),
        ]);

        return back()->with('message', 'Safety inspection logged successfully.');
    }

    public function logs()
    {
        // Fetch logs with the associated user and equipment data, newest first
        $logs = InspectionLog::with(['equipment', 'user'])->latest()->get();
        return Inertia::render('Logs', ['logs' => $logs]);
    }
}