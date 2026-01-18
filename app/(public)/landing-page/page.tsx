import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import {
    CheckCircle2,
    MapPin,
    UserCheck,
    ShieldCheck,
    Monitor,
    Smartphone,
    MessageCircle,
    Clock,
    FileText,
    History,
    Lock,
    ArrowRight
} from "lucide-react";

export default function LandingPage() {
    const whatsappNumber = "6281234567890"; // Placeholder
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo%20Humana,%20saya%20tertarik%20untuk%20diskusi%20lebih%20lanjut%20mengenai%20sistem%20HR.`;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-[#0C212F] selection:text-white">
            {/* Navigation - Light style (as previous) with new layout */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 bg-white/80 border-zinc-200">
                <nav className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 max-w-7xl mx-auto">
                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold text-xl">
                            <div className="h-8 w-8 rounded-lg bg-[#0C212F] flex items-center justify-center shadow-lg shadow-[#0C212F]/10">
                                <span className="text-white font-bold">H</span>
                            </div>
                            <span className="text-[#0C212F] font-bold tracking-tight">Humana</span>
                        </div>
                    </div>

                    {/* Desktop nav - Pill style on light bg */}
                    <div className="hidden md:flex items-center gap-1 text-sm font-semibold">
                        <Link href="#about" className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Tentang</Link>
                        <Link href="#workflow" className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Cara Kerja</Link>
                        <Link href="#features" className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Fitur</Link>
                        <Link href="#partners" className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Mitra</Link>
                    </div>

                    <div className="flex justify-end">
                        <Button asChild className="rounded-full px-7 bg-[#0C212F] text-white hover:bg-[#0C212F]/90 shadow-lg shadow-[#0C212F]/20 font-bold text-sm">
                            <Link href={whatsappLink} target="_blank">Konsultasi</Link>
                        </Button>
                    </div>
                </nav>
            </header>

            <main>
                {/* 1. Deskripsi Humana (Opening Section) */}
                <section id="about" className="pt-32 pb-32 max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <Badge variant="outline" className="mb-6 px-4 py-1.5 border-[#0C212F]/20 text-[#0C212F] font-semibold text-xs tracking-wider uppercase">
                                Enterprise HR Control
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#0C212F] leading-[1.15] mb-8">
                                Sistem Manajemen HR yang Menitikberatkan pada Kontrol dan Akurasi Data.
                            </h1>
                            <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-xl">
                                Humana membantu perusahaan mengelola presensi, cuti, dan aktivitas karyawan melalui validasi berlapis. Kami memastikan setiap data yang masuk adalah fakta lapangan, bukan sekadar input manual tanpa bukti.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="rounded-xl px-10 h-16 bg-[#0C212F] text-white hover:bg-[#0C212F]/90 text-lg font-bold group">
                                    <Link href={whatsappLink} target="_blank" className="flex items-center gap-3">
                                        Pelajari Sistem <MessageCircle className="w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(12,33,47,0.15)] border border-zinc-100">
                            <Image
                                src="/home/dedsec/.gemini/antigravity/brain/50dbf179-48e0-4e9b-8184-72c39350e650/hero_dashboard_mockup_png_1768741461555.png"
                                alt="Humana Web Dashboard Interface"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Cara Kerja Humana (Workflow) */}
                <section id="workflow" className="py-32 bg-[#0C212F]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Alur Kerja Terverifikasi</h2>
                            <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
                                Dirancang untuk menghilangkan celah manipulasi data melalui proses verifikasi yang runtut dan otomatis.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                {
                                    icon: <Smartphone className="w-8 h-8 text-white" />,
                                    title: "Aplikasi Mobile",
                                    desc: "Karyawan melakukan presensi langsung dari aplikasi mobile Humana di lokasi kerja."
                                },
                                {
                                    icon: <UserCheck className="w-8 h-8 text-white" />,
                                    title: "Verifikasi Wajah",
                                    desc: "Sistem melakukan pemindaian wajah secara real-time untuk memastikan identitas pengguna."
                                },
                                {
                                    icon: <MapPin className="w-8 h-8 text-white" />,
                                    title: "Validasi Lokasi",
                                    desc: "Teknologi geofencing memastikan presensi hanya dilakukan di radius area resmi perusahaan."
                                },
                                {
                                    icon: <Monitor className="w-8 h-8 text-white" />,
                                    title: "Dashboard HR",
                                    desc: "Data tersinkronisasi otomatis ke dashboard pusat untuk dipantau secara langsung oleh tim Manajemen."
                                }
                            ].map((step, i) => (
                                <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all">
                                    <div className="mb-8 w-16 h-16 rounded-2xl bg-[#0C212F] border border-white/20 flex items-center justify-center shadow-inner">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
                                    <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Fitur Humana (Berbasis Masalah) */}
                <section id="features" className="py-40 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <h2 className="text-4xl font-bold text-[#0C212F] mb-6 tracking-tight">Solusi untuk Kendala HR Operasional</h2>
                        <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
                            Kami tidak menawarkan daftar fitur, kami menawarkan penyelesaian untuk masalah nyata di lapangan.
                        </p>
                    </div>

                    <div className="space-y-40">
                        {/* Feature 1 */}
                        <div className="grid lg:grid-cols-2 gap-32 items-center">
                            <div>
                                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold inline-block mb-6 italic">
                                    Masalah: "Titip Absen" dan Presensi Palsu di Luar Kantor.
                                </div>
                                <h3 className="text-3xl font-bold text-[#0C212F] mb-6 tracking-tight">Presensi Wajah & Lokasi Terkunci</h3>
                                <p className="text-zinc-600 text-lg leading-relaxed mb-8">
                                    Data kehadiran seringkali dipertanyakan keabsahannya. Humana menerapkan aturan validasi wajah yang terintegrasi dengan koordinat GPS dan teknologi anti-fake GPS. Presensi hanya sah jika wajah teridentifikasi dan koordinat berada di dalam zonasi yang diizinkan.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Pemindaian wajah AI real-time",
                                        "Zonasi Geofencing radius perusahaan",
                                        "Deteksi penggunaan Fake GPS / Mock Location"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-900 font-bold text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-zinc-50 rounded-[3rem] p-12 border border-zinc-100 flex items-center justify-center">
                                <Image
                                    src="/home/dedsec/.gemini/antigravity/brain/50dbf179-48e0-4e9b-8184-72c39350e650/mobile_checkin_mockup_png_1768741487248.png"
                                    alt="Mobile face validation"
                                    width={320}
                                    height={640}
                                    className="rounded-[3rem] shadow-2xl scale-110"
                                />
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid lg:grid-cols-2 gap-32 items-center">
                            <div className="order-2 lg:order-1 bg-zinc-50 rounded-[3rem] p-12 border border-zinc-100 overflow-hidden relative aspect-video">
                                <Image
                                    src="/home/dedsec/.gemini/antigravity/brain/50dbf179-48e0-4e9b-8184-72c39350e650/hero_dashboard_mockup_png_1768741461555.png"
                                    alt="Leave and Overtime Dashboard"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold inline-block mb-6 italic">
                                    Masalah: Pengajuan Cuti dan Lembur yang Berantakan di Chat / Kertas.
                                </div>
                                <h3 className="text-3xl font-bold text-[#0C212F] mb-6 tracking-tight">Workflow Cuti & Lembur Digital</h3>
                                <p className="text-zinc-600 text-lg leading-relaxed mb-8">
                                    Birokrasi manual sering menyebabkan data hilang atau salah perhitungan. Humana menyediakan alur persetujuan bertingkat yang transparan. Setiap pengajuan cuti atau lembur terdokumentasi rapi dengan sisa kuota yang dihitung otomatis oleh sistem.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="p-5 border border-zinc-200 rounded-2xl bg-white">
                                        <History className="w-6 h-6 text-[#0C212F] mb-3" />
                                        <p className="font-bold text-sm">Riwayat Terpusat</p>
                                    </div>
                                    <div className="p-5 border border-zinc-200 rounded-2xl bg-white">
                                        <Lock className="w-6 h-6 text-[#0C212F] mb-3" />
                                        <p className="font-bold text-sm">Keamanan Multi-level</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="grid lg:grid-cols-2 gap-32 items-center">
                            <div>
                                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold inline-block mb-6 italic">
                                    Masalah: Perubahan Data Tanpa Jejak dan Manipulasi Admin.
                                </div>
                                <h3 className="text-3xl font-bold text-[#0C212F] mb-6 tracking-tight">Audit Log & Kendali Akses</h3>
                                <p className="text-zinc-600 text-lg leading-relaxed mb-8">
                                    Integritas data adalah prioritas utama. Di Humana, setiap perubahan data absensi atau sistem oleh admin akan dicatat dalam Audit Log permanen. Anda dapat melacak siapa, kapan, dan mengapa sebuah data diubah.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-[#0C212F]">Traceability</p>
                                            <p className="text-sm text-zinc-500">Rekaman jejak permanen untuk setiap tindakan administratif.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <Lock className="w-6 h-6 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-[#0C212F]">Role-Based Control</p>
                                            <p className="text-sm text-zinc-500">Izin akses yang disesuaikan dengan tanggung jawab jabatan.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#0C212F] rounded-[3rem] p-16 text-white text-center">
                                <FileText className="w-20 h-20 text-white/20 mx-auto mb-10" />
                                <h4 className="text-2xl font-bold mb-6 italic">"Laporan Siap Audit dengan Satu Klik"</h4>
                                <p className="text-white/40 mb-10 text-sm leading-relaxed">Ekspor data absensi ke format Excel/PDF yang akurat untuk kebutuhan payroll dan kepatuhan regulasi.</p>
                                <Badge variant="outline" className="border-white/20 text-white font-mono text-xs uppercase">Logs Protected</Badge>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Mitra Yang Telah Bekerja Sama */}
                <section id="partners" className="py-32 bg-white border-y border-zinc-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Dipercaya Oleh Perusahaan & Organisasi</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="text-2xl font-black tracking-tighter text-[#0C212F]">PT. TEKNOLOGI NEGERI</div>
                            <div className="text-2xl font-black tracking-tighter text-[#0C212F]">RA AR-RAHMAH</div>
                            <div className="text-2xl font-black tracking-tighter text-[#0C212F]">MANUFAKTUR MAJU</div>
                            <div className="text-2xl font-black tracking-tighter text-[#0C212F]">LOGISTIK CEMERLANG</div>
                        </div>
                    </div>
                </section>

                {/* 5. Hubungi Kami (WhatsApp CTA) */}
                <section className="py-48 bg-[#FAFAFA]">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl font-bold text-[#0C212F] mb-10 tracking-tight">Siap Terhubung dengan Profesional?</h2>
                        <p className="text-xl text-zinc-500 mb-16 leading-relaxed">
                            Diskusikan kebutuhan spesifik perusahaan Anda atau jadwalkan demonstrasi sistem secara lengkap bersama tim ahli kami.
                        </p>

                        <div className="inline-block group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#0C212F] to-[#0C212F]/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Button asChild size="lg" className="relative rounded-2xl px-16 h-20 bg-white border-2 border-[#0C212F] text-[#0C212F] hover:bg-[#0C212F] hover:text-white transition-all text-xl font-black flex items-center gap-4">
                                <Link href={whatsappLink} target="_blank">
                                    Diskusikan Lewat WhatsApp <MessageCircle className="w-7 h-7" />
                                </Link>
                            </Button>
                        </div>

                        <p className="mt-12 font-bold text-zinc-400 text-sm tracking-wide uppercase">Konsultasi Gratis • Demo Langsung • Implementasi Cepat</p>
                        <div className="mt-6 text-zinc-600 font-bold bg-white inline-block px-6 py-2 rounded-full border border-zinc-200 shadow-sm">
                            WhatsApp: +62 812-3456-7890
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white py-24 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-7 h-7 bg-[#0C212F] rounded-lg"></div>
                                <span className="font-bold text-xl tracking-tight text-[#0C212F]">Humana</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-medium">
                                Infrastruktur HR Enterprise yang mengedepankan integritas data and efisiensi operasional. Membantu lebih dari puluhan perusahaan membangun budaya kerja yang akuntabel.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#0C212F] mb-8">Sistem</h4>
                            <ul className="space-y-4 text-sm font-bold text-zinc-500">
                                <li><Link href="#workflow" className="hover:text-[#0C212F] transition-colors">Cara Kerja</Link></li>
                                <li><Link href="#features" className="hover:text-[#0C212F] transition-colors">Fitur Utama</Link></li>
                                <li><Link href="#partners" className="hover:text-[#0C212F] transition-colors">Klien Kami</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#0C212F] mb-8">Dukungan</h4>
                            <ul className="space-y-4 text-sm font-bold text-zinc-500">
                                <li><Link href={whatsappLink} className="hover:text-[#0C212F] transition-colors">Pusat Bantuan</Link></li>
                                <li><Link href="#" className="hover:text-[#0C212F] transition-colors">Privasi</Link></li>
                                <li><Link href="#" className="hover:text-[#0C212F] transition-colors">Syarat & Ketentuan</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-24 pt-10 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-zinc-400">
                        <p>© 2026 Humana Inc. Semua hak dilindungi undang-undang.</p>
                        {/* <div className="flex gap-10">
                <Link href="#" className="hover:text-[#0C212F]">LinkedIn</Link>
                <Link href="#" className="hover:text-[#0C212F]">Instagram</Link>
            </div> */}
                    </div>
                </div>
            </footer>
        </div>
    );
}
