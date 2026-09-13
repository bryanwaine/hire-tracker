import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, equipment }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Equipment Inventory</h2>}>
            <Head title="Equipment" />
            
            <div className="max-w-7xl mx-auto p-6 mt-6 bg-white shadow-sm sm:rounded-lg">
                <Link href={route('equipment.create')} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                    Add New Equipment
                </Link>
                
                <ul className="mt-4 divide-y">
                    {equipment.map((item) => (
                        <li key={item.id} className="py-4">
                            <strong className="text-lg">{item.name}</strong> ({item.category}) <br/>
                            Status: <span className="font-medium text-green-700">{item.status}</span>
                            <div className="flex gap-3">
                                <Link href={route('equipment.edit', item.id)} className="text-blue-600 hover:underline">
                                    Edit
                                </Link>
                                <Link 
                                    href={route('equipment.destroy', item.id)} 
                                    method="delete" 
                                    as="button" 
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}