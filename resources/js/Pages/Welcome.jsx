import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome to Hire Tracker" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">

                    <main className="px-6 sm:px-6 lg:px-8 w-full max-w-7xl flex justify-center items-center flex-col gap-6">
                            <div className="max-w-2xl w-full bg-[#D3D8D2] rounded-xl shadow-sm border border-[#D3D8D2] p-8 md:p-12 text-center">
                                <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#1C2B26]">
                                    Hire Tracker
                                </h1>
                                <p className="text-lg text-[#6B7671] mb-8">
                                    Internal inventory and maintenance tracking for power tools, access systems, and small plant operations.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {auth?.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="px-6 py-3 bg-[#0B6E5F] text-white font-medium rounded-lg hover:bg-opacity-90 transition-opacity"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="px-6 py-3 bg-[#0B6E5F] text-white font-medium rounded-lg hover:bg-opacity-90 transition-opacity"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="px-6 py-3 bg-transparent border-2 border-[#0B6E5F] text-[#0B6E5F] font-medium rounded-lg hover:bg-[#F6F7F5] transition-colors"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                    </main>

                    <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                        <a
                            href="https://bryanwaine.netlify.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0B6E5F] hover:underline"
                        >
                            Nwanne Ezeaka
                        </a> © {new Date().getFullYear()} | Built with{" "}
                        <a
                            href="https://laravel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0B6E5F] hover:underline"
                        >
                            Laravel
                        </a>{" "}
                        and{" "}
                        <a
                            href="https://inertiajs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0B6E5F] hover:underline"
                        >
                            Inertia.js
                        </a>
                    </footer>
                </div>
            </div>
        </>
    );
}
