# Hire Tracker: Fleet Logistics & Maintenance System

A full-stack Single Page Application (SPA) designed for the equipment hire and service industry. Built to manage multi-branch inventory, enforce regulatory safety compliance, and provide mobile-ready data endpoints for yard staff.

Live url: https://hire-tracker.site.je

## Project Overview
This project was built to solve practical logistical challenges in tool and plant machinery rental. Rather than a standard CRUD app, this system implements real-world business rules, such as preventing the transfer of unsafe equipment and maintaining strict audit trails for maintenance checks.

### Core Business Features
* **Multi-Branch Logistics:** Yard staff can view stock across multiple locations and initiate branch-to-branch transfers. Items are locked in an `IN_TRANSIT` state until the destination branch explicitly marks them as received.
* **"Safety First" Compliance Blocker:** Equipment flagged for maintenance cannot be transferred or rented. The system physically blocks state changes until an authorized user logs a formal safety inspection, automatically generating a timestamped audit trail tied to the user's ID.
* **Mobile-Ready REST API:** Includes a dedicated JSON endpoint (`/api/equipment/{serial_number}`) designed to be consumed by a mobile app (e.g., React Native) or handheld barcode scanners in the yard.

## Tech Stack & Architecture
* **Backend:** PHP 8.3 / Laravel 11
* **Frontend:** React.js 18 / Tailwind CSS
* **Bridge:** Inertia.js (Enables a seamless SPA experience without the overhead of managing a separate API for the web dashboard).
* **Database:** MySQL (Production) / SQLite (Local)
* **Hosting:** InfinityFree (panel system using the VistaPanel)

## Database Schema
The relational database is structured to support scalability across 30+ locations:
* `branches`: Manages location data (`id`, `name`, `city`).
* `equipment`: Tracks individual assets, their current status (`available`, `in_transit`, `maintenance`), and belongs to a `branch_id`.
* `inspection_logs`: Provides a compliance audit trail, linking an `equipment_id` to the `user_id` who authorized the safety check.

## Mobile Integration (API)
To support warehouse staff away from the desk, the system exposes a read-only REST API endpoint for quick status checks.

**GET** `/api/equipment/{serial_number}`
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Makita 110V Cement Mixer",
        "serial_number": "MIX-001",
        "status": "AVAILABLE",
        "current_location": "Durham HQ",
        "last_updated": "2 minutes ago"
    }
}
```

## Infrastructure & Deployment Notes
This application is currently deployed on a shared panel-based hosting environment (InfinityFree). To achieve this, several environment constraints were overcome:

* Bypassed composite index caps by enforcing strict string length limits in `AppServiceProvider`.

* Handled rigid directory structures by dual-compiling Vite assets to satisfy both Laravel's internal manifest requirements and the browser's external asset requests.

* Secured database migrations via a token-protected setup route, bypassing the lack of SSH/terminal access on the production server.

## Local Setup Instructions

1. Clone the repository:

    ``` bash
    git clone https://github.com/bryanwaine/hire-tracker.git
    ```

2. Install PHP and Node dependencies:
    ``` bash
    composer install
    npm install
    ```

3. Set up your environment file:
    ``` bash
    cp .env.example .env
    php artisan key:generate
    ```

4. Run migrations and seed the database with dummy branch data:
    ``` bash
    php artisan migrate:fresh --seed
    ```

5. Compile the React frontend and start the Laravel server:
    ``` bash
    npm run dev
    php artisan serve
    ```