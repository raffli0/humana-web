"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
    CheckCircle2,
    MapPin,
    UserCheck,
    ShieldCheck,
    Monitor,
    Smartphone,
    MessageCircle,
    History,
    Lock,
    FileText,
    Star,
    TrendingUp,
    Users,
    Building2,
    Clock
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Logo } from "@/app/components/ui/logo";

export default function LandingPage() {
    const whatsappNumber = "6281234567890"; // Placeholder
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo%20Humana,%20saya%20tertarik%20untuk%20diskusi%20lebih%20lanjut%20mengenai%20sistem%20HR.`;

    // Animation variants
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-[#0C212F] selection:text-white overflow-x-hidden">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 bg-white/80 border-zinc-200">
                <nav className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 max-w-7xl mx-auto">
                    {/* Logo */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Logo className="text-[#0C212F]" />
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1 text-sm font-semibold">
                        <Link href="#about" scroll={true} className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Tentang</Link>
                        <Link href="#workflow" scroll={true} className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Cara Kerja</Link>
                        <Link href="#features" scroll={true} className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Fitur</Link>
                        <Link href="#testimonials" scroll={true} className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">Testimoni</Link>
                        <Link href="#faq" scroll={true} className="h-10 px-5 rounded-full flex items-center justify-center transition-all cursor-pointer select-none text-zinc-500 hover:bg-zinc-100 hover:text-[#0C212F]">FAQ</Link>
                    </div>

                    <div className="flex justify-end">
                        <Button asChild className="rounded-full px-7 bg-[#0C212F] text-white hover:bg-[#0C212F]/90 shadow-lg shadow-[#0C212F]/20 font-bold text-sm transform hover:scale-105 transition-transform duration-200">
                            <Link href={whatsappLink} target="_blank">Konsultasi</Link>
                        </Button>
                    </div>
                </nav>
            </header>

            <main>
                {/* 1. Deskripsi Humana (Opening Section) */}
                <section id="about" className="pt-32 pb-32 max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeInUp}>
                                <Badge variant="outline" className="mb-6 px-4 py-1.5 border-[#0C212F]/20 text-[#0C212F] font-semibold text-xs tracking-wider uppercase bg-blue-50/50">
                                    Enterprise HR Control
                                </Badge>
                            </motion.div>
                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold tracking-tight text-[#0C212F] leading-[1.15] mb-8">
                                Sistem Manajemen HR yang Menitikberatkan pada <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0C212F] to-blue-600">Kontrol & Akurasi</span>.
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-xl">
                                Humana membantu perusahaan mengelola presensi, cuti, dan aktivitas karyawan melalui validasi berlapis. Kami memastikan setiap data yang masuk adalah fakta lapangan, bukan sekadar input manual tanpa bukti.
                            </motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="rounded-xl px-10 h-16 bg-[#0C212F] text-white hover:bg-[#0C212F]/90 text-lg font-bold shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 transition-all hover:-translate-y-1">
                                    <Link href={whatsappLink} target="_blank" className="flex items-center gap-3">
                                        Pelajari Sistem <MessageCircle className="w-5 h-5" />
                                    </Link>
                                </Button>
                            </motion.div>

                            {/* Mini Trust Signals */}
                            <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-zinc-100 flex items-center gap-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-200 overflow-hidden relative">
                                            {/* Placeholder avatars */}
                                            <div className="absolute inset-0 bg-[#0C212F]/10 flex items-center justify-center text-[10px] font-bold text-[#0C212F]">{i}</div>
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0C212F] flex items-center justify-center text-xs font-bold text-white z-10">
                                        50+
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-[#0C212F]">Dipercaya 50+ Perusahaan</p>
                                    <p className="text-zinc-500">Mulai dari UMKM hingga Enterprise</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(12,33,47,0.15)] border border-zinc-100 group"
                        >
                            <Image
                                src="/assets/dashboard.png"
                                alt="Humana Web Dashboard Interface"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-lg flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Akurasi Data</p>
                                    <p className="text-[#0C212F] font-bold text-lg">100% Valid</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 2. New Statistics Section */}
                <section className="py-20 bg-white border-y border-zinc-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { icon: <Building2 className="w-6 h-6" />, label: "Perusahaan Aktif", value: "50+" },
                                { icon: <Users className="w-6 h-6" />, label: "Karyawan Terdaftar", value: "10k+" },
                                { icon: <TrendingUp className="w-6 h-6" />, label: "Akurasi Presensi", value: "99.9%" },
                                { icon: <Clock className="w-6 h-6" />, label: "Sistem Uptime", value: "24/7" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-4">
                                    <div className="mb-4 text-[#0C212F]/40 bg-[#0C212F]/5 p-3 rounded-full">
                                        {stat.icon}
                                    </div>
                                    <h3 className="text-4xl font-bold text-[#0C212F] mb-2 tracking-tight">{stat.value}</h3>
                                    <p className="text-zinc-500 font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Cara Kerja Humana (Workflow) */}
                <section id="workflow" className="py-32 bg-[#0C212F] relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Alur Kerja Terverifikasi</h2>
                            <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
                                Dirancang untuk menghilangkan celah manipulasi data melalui proses verifikasi yang runtut dan otomatis.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
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
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="p-10 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all hover:scale-[1.02] duration-300"
                                >
                                    <div className="mb-8 w-16 h-16 rounded-2xl bg-[#0C212F] border border-white/20 flex items-center justify-center shadow-inner">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
                                    <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Fitur Humana (Berbasis Masalah) */}
                <section id="features" className="py-40 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32">
                        <Badge variant="outline" className="mb-6 px-4 py-1.5 border-[#0C212F]/20 text-[#0C212F] font-semibold text-xs tracking-wider uppercase">
                            Solusi Nyata
                        </Badge>
                        <h2 className="text-4xl font-bold text-[#0C212F] mb-6 tracking-tight">Solusi untuk Kendala HR Operasional</h2>
                        <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
                            Kami tidak menawarkan daftar fitur, kami menawarkan penyelesaian untuk masalah nyata di lapangan.
                        </p>
                    </div>

                    <div className="space-y-40">
                        {/* Feature 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className="grid lg:grid-cols-2 gap-32 items-center"
                        >
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
                            <div className="bg-zinc-50 rounded-[3rem] p-12 border border-zinc-100 flex items-center justify-center transform hover:rotate-1 transition-transform duration-500">
                                <Image
                                    src="/assets/mobile_checkin.png"
                                    alt="Mobile face validation"
                                    width={320}
                                    height={640}
                                    className="rounded-[3rem] shadow-2xl scale-110"
                                />
                            </div>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className="grid lg:grid-cols-2 gap-32 items-center"
                        >
                            <div className="order-2 lg:order-1 bg-zinc-50 rounded-[3rem] p-12 border border-zinc-100 overflow-hidden relative aspect-video group">
                                <Image
                                    src="/home/dedsec/.gemini/antigravity/brain/50dbf179-48e0-4e9b-8184-72c39350e650/hero_dashboard_mockup_png_1768741461555.png"
                                    alt="Leave and Overtime Dashboard"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
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
                                    <div className="p-5 border border-zinc-200 rounded-2xl bg-white hover:border-[#0C212F] transition-colors">
                                        <History className="w-6 h-6 text-[#0C212F] mb-3" />
                                        <p className="font-bold text-sm">Riwayat Terpusat</p>
                                    </div>
                                    <div className="p-5 border border-zinc-200 rounded-2xl bg-white hover:border-[#0C212F] transition-colors">
                                        <Lock className="w-6 h-6 text-[#0C212F] mb-3" />
                                        <p className="font-bold text-sm">Keamanan Multi-level</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className="grid lg:grid-cols-2 gap-32 items-center"
                        >
                            <div>
                                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold inline-block mb-6 italic">
                                    Masalah: Perubahan Data Tanpa Jejak dan Manipulasi Admin.
                                </div>
                                <h3 className="text-3xl font-bold text-[#0C212F] mb-6 tracking-tight">Audit Log & Kendali Akses</h3>
                                <p className="text-zinc-600 text-lg leading-relaxed mb-8">
                                    Integritas data adalah prioritas utama. Di Humana, setiap perubahan data absensi atau sistem oleh admin akan dicatat dalam Audit Log permanen. Anda dapat melacak siapa, kapan, dan mengapa sebuah data diubah.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start p-6 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-white hover:shadow-lg transition-all cursor-default">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-[#0C212F]">Traceability</p>
                                            <p className="text-sm text-zinc-500">Rekaman jejak permanen untuk setiap tindakan administratif.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start p-6 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-white hover:shadow-lg transition-all cursor-default">
                                        <Lock className="w-6 h-6 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-[#0C212F]">Role-Based Control</p>
                                            <p className="text-sm text-zinc-500">Izin akses yang disesuaikan dengan tanggung jawab jabatan.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#0C212F] rounded-[3rem] p-16 text-white text-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                <FileText className="w-20 h-20 text-white/20 mx-auto mb-10 group-hover:scale-110 transition-transform duration-300" />
                                <h4 className="text-2xl font-bold mb-6 italic relative z-10">"Laporan Siap Audit dengan Satu Klik"</h4>
                                <p className="text-white/40 mb-10 text-sm leading-relaxed relative z-10">Ekspor data absensi ke format Excel/PDF yang akurat untuk kebutuhan payroll dan kepatuhan regulasi.</p>
                                <Badge variant="outline" className="border-white/20 text-white font-mono text-xs uppercase relative z-10">Logs Protected</Badge>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 5. Testimonials Section (New) */}
                <section id="testimonials" className="py-32 bg-zinc-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#0C212F] mb-6">Apa Kata Mereka?</h2>
                            <p className="text-zinc-500 text-lg">Mendengar langsung dari partner yang telah melakukan transformasi HR.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    quote: "Sistem Humana sangat praktis. Dulu rekap absensi butuh 3 hari, sekarang cuma 5 menit langsung jadi laporan payroll.",
                                    author: "Budi Santoso",
                                    role: "HR Manager",
                                    company: "PT. Teknologi Negeri"
                                },
                                {
                                    quote: "Fitur Fake GPS detection-nya sangat akurat. Kami bisa memastikan tim sales benar-benar kunjungan ke klien.",
                                    author: "Sarah Wijaya",
                                    role: "Operational Director",
                                    company: "Logistik Cemerlang"
                                },
                                {
                                    quote: "Support tim Humana sangat fast response. Implementasi tidak sampai seharian sudah bisa dipakai seluruh karyawan.",
                                    author: "Rendra Pratama",
                                    role: "CEO",
                                    company: "Manufaktur Maju"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex gap-1 mb-6 text-amber-400">
                                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-zinc-600 italic mb-8 min-h-[80px]">"{item.quote}"</p>
                                    <div>
                                        <p className="font-bold text-[#0C212F]">{item.author}</p>
                                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wide">{item.role}, {item.company}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. FAQ Section (New) */}
                <section id="faq" className="py-32 bg-white">
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-[#0C212F] mb-4">Sering Ditanyakan</h2>
                            <p className="text-zinc-500">Jawaban untuk pertanyaan umum seputar Humana.</p>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            {[
                                {
                                    q: "Apakah data perusahaan saya aman?",
                                    a: "Sangat aman. Kami menggunakan enkripsi data standar industri (AES-256) dan server yang terlindungi firewall berlapis. Data Anda adalah milik Anda sepenuhnya."
                                },
                                {
                                    q: "Apakah aplikasi ini berbayar atau langganan?",
                                    a: "Humana menggunakan model berlangganan (SaaS) yang fleksibel sesuai jumlah karyawan. Hubungi tim sales kami untuk penawaran terbaik."
                                },
                                {
                                    q: "Berapa lama proses implementasi sistem?",
                                    a: "Sangat cepat. Untuk perusahaan dengan <100 karyawan, setup bisa selesai dalam hitungan jam. Kami juga menyediakan tim onboarding untuk membantu migrasi data."
                                },
                                {
                                    q: "Apakah bisa mendeteksi Fake GPS?",
                                    a: "Ya, Humana memiliki algoritma khusus untuk mendeteksi penggunaan aplikasi Fake GPS atau Mock Location pada smartphone karyawan."
                                }
                            ].map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`}>
                                    <AccordionTrigger className="text-left font-bold text-[#0C212F] text-lg hover:no-underline hover:text-blue-600 transition-colors">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-zinc-500 leading-relaxed text-base">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* 7. Call to Action */}
                <section className="py-48 bg-[#FAFAFA] relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold text-[#0C212F] mb-10 tracking-tight"
                        >
                            Siap Terhubung dengan Profesional?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-zinc-500 mb-16 leading-relaxed"
                        >
                            Diskusikan kebutuhan spesifik perusahaan Anda atau jadwalkan demonstrasi sistem secara lengkap bersama tim ahli kami.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#0C212F] to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Button asChild size="lg" className="relative rounded-2xl px-16 h-20 bg-white border-2 border-[#0C212F] text-[#0C212F] hover:bg-[#0C212F] hover:text-white transition-all text-xl font-black flex items-center gap-4">
                                <Link href={whatsappLink} target="_blank">
                                    Diskusikan Lewat WhatsApp <MessageCircle className="w-7 h-7" />
                                </Link>
                            </Button>
                        </motion.div>

                        <p className="mt-12 font-bold text-zinc-400 text-sm tracking-wide uppercase">Konsultasi Gratis • Demo Langsung • Implementasi Cepat</p>
                    </div>
                </section>
            </main>

            <footer className="bg-white py-24 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-7 h-7 bg-[#0C212F] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">H</span>
                                </div>
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
                                <li><Link href="#testimonials" className="hover:text-[#0C212F] transition-colors">Testimoni</Link></li>
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
                    </div>
                </div>
            </footer>
        </div>
    );
}
