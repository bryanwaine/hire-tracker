import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, equipment }) {
    const { data, setData, put, processing, errors } = useForm({
        name: equipment.name,
        category: equipment.category,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('equipment.update', equipment.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Equipment</h2>}>
            <Head title="Edit Equipment" />
            
            <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-sm sm:rounded-lg">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        value={data.name} 
                        onChange={e => setData('name', e.target.value)} 
                        className="border p-2 rounded"
                    />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}

                    <input 
                        type="text" 
                        value={data.category} 
                        onChange={e => setData('category', e.target.value)} 
                        className="border p-2 rounded"
                    />
                    {errors.category && <span className="text-red-500">{errors.category}</span>}

                    <button type="submit" disabled={processing} className="bg-green-500 text-white p-2 rounded">
                        Update Equipment
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}