<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Branch;
use App\Models\Equipment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a default admin user
        User::firstOrCreate(
            ['email' => 'admin@hire-tracker.com'],
            ['name' => 'Admin User', 'password' => Hash::make('password')]
        );

        // 2. Use the UserFactory to create a test user with specific credentials
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // 3. Create all 9 Branches from a single data array
        $branchData = [
            ['name' => 'Durham HQ',        'city' => 'Durham'],
            ['name' => 'Newcastle North',  'city' => 'Newcastle'],
            ['name' => 'Preston Central',  'city' => 'Preston'],
            ['name' => 'Leeds West',       'city' => 'Leeds'],
            ['name' => 'Manchester East',  'city' => 'Manchester'],
            ['name' => 'Sheffield South',  'city' => 'Sheffield'],
            ['name' => 'York Central',     'city' => 'York'],
            ['name' => 'Birmingham North', 'city' => 'Birmingham'],
            ['name' => 'Liverpool Docks',  'city' => 'Liverpool'],
        ];

        // Keyed by name so equipment entries below can look a branch up by it
        $branches = [];
        foreach ($branchData as $data) {
            $branches[$data['name']] = Branch::firstOrCreate(
                ['name' => $data['name']],
                ['city' => $data['city']]
            );
        }

        // 4. Start the Equipment list with the 6 original fixed records
        $equipmentData = [
            ['serial_number' => 'MIX-001',  'branch' => 'Durham HQ',       'name' => 'Makita 110V Cement Mixer', 'category' => 'mixers',    'status' => 'available'],
            ['serial_number' => 'CUT-089',  'branch' => 'Durham HQ',       'name' => 'Stihl TS410 Disc Cutter',  'category' => 'cutters',   'status' => 'maintenance'],
            ['serial_number' => 'MIX-002',  'branch' => 'Newcastle North', 'name' => 'Makita 110V Cement Mixer', 'category' => 'mixers',    'status' => 'available'],
            ['serial_number' => 'NAIL-442', 'branch' => 'Newcastle North', 'name' => 'Paslode IM350+ Nail Gun',  'category' => 'nail guns', 'status' => 'on_hire'],
            ['serial_number' => 'MIX-003',  'branch' => 'Preston Central', 'name' => 'Makita 110V Cement Mixer', 'category' => 'mixers',    'status' => 'available'],
            ['serial_number' => 'CUT-090',  'branch' => 'Leeds West',      'name' => 'Stihl TS410 Disc Cutter',  'category' => 'cutters',   'status' => 'maintenance'],
        ];

        // 5. Append 50 randomly generated records onto the same array
        $statuses = ['available', 'maintenance', 'on_hire'];

        $toolTemplates = [
            ['name' => 'Makita 110V Cement Mixer',          'category' => 'mixers',     'prefix' => 'MIX'],
            ['name' => 'Belle Minimix 150 Mixer',           'category' => 'mixers',     'prefix' => 'MIX'],
            ['name' => 'Stihl TS410 Disc Cutter',           'category' => 'cutters',    'prefix' => 'CUT'],
            ['name' => 'Husqvarna K770 Disc Cutter',        'category' => 'cutters',    'prefix' => 'CUT'],
            ['name' => 'Paslode IM350+ Nail Gun',           'category' => 'nail guns',  'prefix' => 'NAIL'],
            ['name' => 'DeWalt DCN692 Nail Gun',            'category' => 'nail guns',  'prefix' => 'NAIL'],
            ['name' => 'Makita HR2470 Rotary Hammer Drill', 'category' => 'drills',     'prefix' => 'DRL'],
            ['name' => 'Bosch GSB 18V Combi Drill',         'category' => 'drills',     'prefix' => 'DRL'],
            ['name' => 'Honda EU22i Generator',             'category' => 'generators', 'prefix' => 'GEN'],
            ['name' => 'Stephill SSDK8 Diesel Generator',   'category' => 'generators', 'prefix' => 'GEN'],
            ['name' => 'Bosch GSH 11E Breaker',             'category' => 'breakers',   'prefix' => 'BRK'],
            ['name' => 'Kango 950K Breaker',                'category' => 'breakers',   'prefix' => 'BRK'],
            ['name' => 'Wacker Neuson Plate Compactor',     'category' => 'compactors', 'prefix' => 'CMP'],
            ['name' => 'Bomag BPR 40/45 Compactor',         'category' => 'compactors', 'prefix' => 'CMP'],
            ['name' => 'Stihl MS 462 Chainsaw',             'category' => 'saws',       'prefix' => 'SAW'],
            ['name' => 'Makita LS1019L Mitre Saw',          'category' => 'saws',       'prefix' => 'SAW'],
        ];

        // Start each counter above the highest serial already claimed above,
        // so a generated serial can never collide with a fixed one
        $serialCounters = [
            'MIX' => 3, 'CUT' => 90, 'NAIL' => 442,
            'DRL' => 0, 'GEN' => 0, 'BRK' => 0, 'CMP' => 0, 'SAW' => 0,
        ];

        for ($i = 0; $i < 50; $i++) {
            $tool   = $toolTemplates[array_rand($toolTemplates)];
            $prefix = $tool['prefix'];
            $serialCounters[$prefix]++;

            $equipmentData[] = [
                'serial_number' => sprintf('%s-%03d', $prefix, $serialCounters[$prefix]),
                'branch'        => array_rand($branches),
                'name'          => $tool['name'],
                'category'      => $tool['category'],
                'status'        => $statuses[array_rand($statuses)],
            ];
        }

        // 6. One single loop creates every Equipment record — fixed and random alike
        foreach ($equipmentData as $item) {
            Equipment::firstOrCreate(
                ['serial_number' => $item['serial_number']],
                [
                    'branch_id' => $branches[$item['branch']]->id,
                    'name'      => $item['name'],
                    'category'  => $item['category'],
                    'status'    => $item['status'],
                ]
            );
        }
    }
}