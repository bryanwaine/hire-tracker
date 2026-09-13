import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Logs({ auth, logs, branches }) {
    console.log(auth)
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Safety Inspection Logs</h2>}>
            <Head title="Inspection Logs" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden p-6 border-t-4 border-amber-500">
                        <h3 className="text-lg font-bold mb-4 text-[#1C2B26]">Audit Trail</h3>
                        
                        {logs.length === 0 ? (
                            <p className="text-gray-500 italic p-4 bg-gray-50 rounded">No safety inspections have been logged yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="p-3 font-medium text-sm text-gray-600">Date & Time</th>
                                            <th className="p-3 font-medium text-sm text-gray-600">Equipment</th>
                                            <th className="p-3 font-medium text-sm text-gray-600">Serial</th>
                                            <th className="p-3 font-medium text-sm text-gray-600">Inspected By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map(log => (
                                            <tr key={log.id} className="border-b hover:bg-gray-50">
                                                {/* Format the date nicely for the UK */}
                                                <td className="p-3 text-sm">{new Date(log.created_at).toLocaleString('en-GB')}</td>
                                                <td className="p-3 font-medium">{log.equipment.name}</td>
                                                <td className="p-3 text-sm text-gray-500">{log.equipment.serial_number}</td>
                                                <td className="p-3 text-sm">
                                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-medium flex items-center gap-2 w-max">
                                                        <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                                        {log.user.name}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}