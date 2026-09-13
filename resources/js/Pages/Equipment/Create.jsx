import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('equipment.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Equipment</h2>}>
            <Head title="Add Equipment" />
            
            <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-sm sm:rounded-lg">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        placeholder="Equipment Name" 
                        value={data.name} 
                        onChange={e => setData('name', e.target.value)} 
                        className="border p-2 rounded"
                    />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}

                    <input 
                        type="text" 
                        placeholder="Category (e.g. Power Tools)" 
                        value={data.category} 
                        onChange={e => setData('category', e.target.value)} 
                        className="border p-2 rounded"
                    />
                    {errors.category && <span className="text-red-500">{errors.category}</span>}

                    <button type="submit" disabled={processing} className="bg-blue-500 text-white p-2 rounded">
                        Save Equipment
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}