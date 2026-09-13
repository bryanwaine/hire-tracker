import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({ auth, branches, equipment }) {
    const [transferData, setTransferData] = useState({});
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [inspectingItem, setInspectingItem] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const handleTransfer = (equipmentId) => {
        const destinationId = transferData[equipmentId];
        if (!destinationId) return alert("Please select a destination branch");

        router.post(`/equipment/${equipmentId}/transfer`, {
            branch_id: destinationId,
        });
    };

    const handleReceive = (equipmentId) => {
        router.post(`/equipment/${equipmentId}/receive`);
    };

    const handleConfirmInspection = () => {
        router.post(
            `/equipment/${inspectingItem.id}/inspect`,
            {},
            {
                onSuccess: () => {
                    setInspectingItem(null); // Close the modal
                    setToastMessage(
                        "✅ Safety inspection logged successfully. Item unlocked.",
                    );
                    setTimeout(() => setToastMessage(null), 3000);
                },
            },
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Fleet Logistics Dashboard
                </h2>
            }
        >
            <Head title="Logistics Dashboard" />
            {/* Success Toast Notification */}
            {toastMessage && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce">
                    {toastMessage}
                </div>
            )}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Branch Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                onClick={() => setSelectedBranch(branch)}
                                className="bg-white shadow-sm sm:rounded-lg p-6 border-t-4 border-[#0B6E5F] cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0B6E5F] transition-colors">
                                            {branch.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Location: {branch.city}
                                        </p>
                                    </div>
                                    <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
                                        {/* Count how many items belong to this branch */}
                                        {
                                            equipment.filter(
                                                (e) =>
                                                    e.branch_id === branch.id,
                                            ).length
                                        }{" "}
                                        Items
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-4">
                                    Click to view inventory
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Live Inventory Table */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-4">
                                Live Inventory
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="p-3 font-medium text-sm text-gray-600">
                                                Equipment
                                            </th>
                                            <th className="p-3 font-medium text-sm text-gray-600">
                                                Serial
                                            </th>
                                            <th className="p-3 font-medium text-sm text-gray-600">
                                                Current Branch
                                            </th>
                                            <th className="p-3 font-medium text-sm text-gray-600">
                                                Status
                                            </th>
                                            <th className="p-3 font-medium text-sm text-gray-600">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipment.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="p-3">
                                                    {item.name}
                                                </td>
                                                <td className="p-3 text-sm text-gray-500">
                                                    {item.serial_number}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {item.branch.name}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            item.status ===
                                                            "available"
                                                                ? "bg-green-100 text-green-800"
                                                                : item.status ===
                                                                    "in_transit"
                                                                  ? "bg-blue-100 text-blue-800"
                                                                  : item.status ===
                                                                      "maintenance"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {item.status ===
                                                    "available" ? (
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                className="text-xs border-gray-300 rounded shadow-sm py-1"
                                                                onChange={(e) =>
                                                                    setTransferData(
                                                                        {
                                                                            ...transferData,
                                                                            [item.id]:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                defaultValue=""
                                                            >
                                                                <option
                                                                    value=""
                                                                    disabled
                                                                >
                                                                    Select
                                                                    destination...
                                                                </option>
                                                                {branches
                                                                    .filter(
                                                                        (b) =>
                                                                            b.id !==
                                                                            item.branch_id,
                                                                    )
                                                                    .map(
                                                                        (b) => (
                                                                            <option
                                                                                key={
                                                                                    b.id
                                                                                }
                                                                                value={
                                                                                    b.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    b.name
                                                                                }
                                                                            </option>
                                                                        ),
                                                                    )}
                                                            </select>
                                                            <button
                                                                onClick={() =>
                                                                    handleTransfer(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="px-3 py-1 bg-[#0B6E5F] text-white text-xs font-bold rounded hover:bg-opacity-90 transition-opacity"
                                                            >
                                                                Transfer
                                                            </button>
                                                        </div>
                                                    ) : item.status ===
                                                      "in_transit" ? (
                                                        <button
                                                            onClick={() =>
                                                                handleReceive(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-opacity-90 transition-opacity"
                                                        >
                                                            Mark as Arrived
                                                        </button>
                                                    ) : item.status ===
                                                      "maintenance" ? (
                                                        <button
                                                            onClick={() => {
                                                                setInspectingItem(
                                                                    item,
                                                                );
                                                            }}
                                                            className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded hover:bg-opacity-90 transition-opacity flex items-center gap-1"
                                                        >
                                                            {/* SVG Checkmark Icon */}
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                ></path>
                                                            </svg>
                                                            Log Safety Check
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">
                                                            Unavailable
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Safety Inspection Confirmation Modal */}
            {inspectingItem && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Confirm Safety Check
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                You are about to clear the following item for
                                hire:
                            </p>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-6">
                                <p className="font-semibold text-gray-800">
                                    {inspectingItem.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Serial: {inspectingItem.serial_number}
                                </p>
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-6">
                                I confirm this equipment has been tested and
                                meets all regulatory safety standards.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setInspectingItem(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmInspection}
                                    className="px-4 py-2 bg-amber-500 text-white font-medium rounded hover:bg-amber-600 transition-colors"
                                >
                                    Confirm & Unlock
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Branch Inventory Modal Overlay */}
            {selectedBranch && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedBranch.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Current On-Site Inventory
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedBranch(null)}
                                className="text-gray-400 hover:text-gray-800 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="p-3 font-medium text-sm text-gray-600">
                                            Equipment
                                        </th>
                                        <th className="p-3 font-medium text-sm text-gray-600">
                                            Serial
                                        </th>
                                        <th className="p-3 font-medium text-sm text-gray-600">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Filter equipment dynamically to only show this branch's stock */}
                                    {equipment
                                        .filter(
                                            (e) =>
                                                e.branch_id ===
                                                selectedBranch.id,
                                        )
                                        .map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="p-3">
                                                    {item.name}
                                                </td>
                                                <td className="p-3 text-sm text-gray-500">
                                                    {item.serial_number}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            item.status ===
                                                            "available"
                                                                ? "bg-green-100 text-green-800"
                                                                : item.status ===
                                                                    "in_transit"
                                                                  ? "bg-blue-100 text-blue-800"
                                                                  : item.status ===
                                                                      "maintenance"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
