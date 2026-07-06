import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Wind, 
  Cloud, 
  Brain, 
  Zap, 
  Activity, 
  Heart, 
  Smile, 
  Utensils, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ClipboardList, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  Check, 
  Sparkles, 
  FileText, 
  CreditCard,
  ShieldCheck,
  User,
  X
} from "lucide-react";
import { specialties, coordinators, testimonials } from "./data";
import { Appointment, SpecialtyInfo } from "./types";
import BookingModal from "./components/BookingModal";
import SpecialistChatDrawer from "./components/SpecialistChatDrawer";
import Logo from "./components/Logo";
// @ts-expect-error - Import generated JPG asset directly
import therapistHeroImage from "./assets/images/therapist_session_1783354510667.jpg";

// Map string icons to Lucide components
const ICON_MAP: { [key: string]: React.ComponentType<any> } = {
  ShieldAlert,
  Wind,
  Cloud,
  Brain,
  Zap,
  Activity,
  Heart,
  Smile,
  Utensils,
  Users,
};

export default function App() {
  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Interaction states
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyInfo | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [pricingCategory, setPricingCategory] = useState<"online" | "presencial" | "especiales">("presencial");

  // Load appointments on mount
  useEffect(() => {
    const existing = localStorage.getItem("novamente_appointments");
    if (existing) {
      setAppointments(JSON.parse(existing));
    }
  }, [isBookingOpen]);

  const handleBookingSuccess = (newAppt: Appointment) => {
    setAppointments((prev) => [...prev, newAppt]);
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const cancelAppointment = (id: string) => {
    if (confirm("¿Estás seguro/a de que deseas cancelar la solicitud de esta hora?")) {
      const updated = appointments.map((appt) => 
        appt.id === id ? { ...appt, status: "cancelled" as const } : appt
      );
      setAppointments(updated);
      localStorage.setItem("novamente_appointments", JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] text-[#191c1f] font-sans antialiased selection:bg-primary/20">
      
      {/* Top Banner for Active Appointments */}
      {appointments.filter(a => a.status === "pending").length > 0 && (
        <div className="bg-primary text-white py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-inner z-55 relative">
          <Calendar className="w-4 h-4 text-primary-fixed" />
          <span>Tienes {appointments.filter(a => a.status === "pending").length} solicitud(es) de hora pendiente de confirmación.</span>
          <a href="#mis-horas" className="underline hover:text-primary-fixed ml-1">Ver detalles</a>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100/80 shadow-xs transition-all duration-300">
        <nav className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-7xl mx-auto">
          {/* Official Logo */}
          <a href="#" className="hover:opacity-95 transition-opacity flex items-center">
            <Logo />
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7 text-[13.5px]">
            <a href="#motivos" className="text-zinc-600 hover:text-primary transition-colors font-medium relative py-1 group">
              Motivos de Consulta
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#nosotros" className="text-zinc-600 hover:text-primary transition-colors font-medium relative py-1 group">
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#especialidades" className="text-zinc-600 hover:text-primary transition-colors font-medium relative py-1 group">
              Especialidades
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#valores" className="text-zinc-600 hover:text-primary transition-colors font-medium relative py-1 group">
              Convenios y Aranceles
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#testimonios" className="text-zinc-600 hover:text-primary transition-colors font-medium relative py-1 group">
              Testimonios
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a 
              href="https://novamente.site.agendapro.com/cl/sucursal/180212"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-full font-bold text-xs transition-all duration-300 shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer items-center justify-center text-center"
            >
              Agendar hora
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 hover:bg-purple-50 hover:text-primary transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-50 bg-white shadow-xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-6 space-y-4 text-sm font-medium">
              <a 
                href="#motivos" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-700 hover:text-primary py-2 border-b border-zinc-50 transition-colors"
              >
                Motivos de Consulta
              </a>
              <a 
                href="#nosotros" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-700 hover:text-primary py-2 border-b border-zinc-50 transition-colors"
              >
                Nosotros
              </a>
              <a 
                href="#especialidades" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-700 hover:text-primary py-2 border-b border-zinc-50 transition-colors"
              >
                Especialidades
              </a>
              <a 
                href="#valores" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-700 hover:text-primary py-2 border-b border-zinc-50 transition-colors"
              >
                Convenios y Aranceles
              </a>
              <a 
                href="#testimonios" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-700 hover:text-primary py-2 border-b border-zinc-50 transition-colors"
              >
                Testimonios
              </a>
              <a 
                href="https://novamente.site.agendapro.com/cl/sucursal/180212"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-primary hover:bg-primary-container text-white py-3 rounded-full font-bold text-xs shadow-md transition-all mt-2 cursor-pointer block"
              >
                Agendar hora
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Soft atmospheric background shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-[100px] -z-10 translate-x-20 hidden lg:block"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#E0D7FF]/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-fixed text-primary rounded-full text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Centro Terapéutico Profesional
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#191c1f] leading-tight">
              Recupera tu <span className="text-primary italic font-semibold">bienestar emocional</span> con expertos que te entienden
            </h1>
            
            <p className="text-base md:text-lg text-zinc-600 max-w-xl leading-relaxed">
              Te ayudamos a superar tus miedos, sanar heridas y fortalecer tu salud mental mediante terapias personalizadas, brindándote un espacio seguro de crecimiento, empatía y sanación.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="https://novamente.site.agendapro.com/cl/sucursal/180212"
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 group cursor-pointer text-center"
              >
                Agendar hora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="https://wa.me/+56988212458"
                target="_blank"
                rel="noreferrer"
                className="border-2 border-secondary text-secondary font-bold py-4 px-8 rounded-full hover:bg-secondary/5 transition-all flex items-center justify-center text-center cursor-pointer bg-white"
              >
                Habla con uno de nuestros asesores
              </a>
            </div>

            {/* Micro value badges with softer, modern dividers */}
            <div className="grid grid-cols-3 gap-1 sm:gap-4 pt-6 max-w-md border-t border-purple-100/50 text-center">
              <div className="flex flex-col items-center justify-start px-1">
                <span className="block text-sm sm:text-xl md:text-2xl font-extrabold text-primary leading-tight">100%</span>
                <span className="text-[8.5px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mt-1 leading-tight">Confidencial</span>
              </div>
              <div className="border-x border-purple-100/50 flex flex-col items-center justify-start px-1">
                <span className="block text-[10px] min-[375px]:text-[11.5px] sm:text-base md:text-lg font-extrabold text-secondary leading-tight tracking-tight">Acreditados</span>
                <span className="text-[7.5px] min-[375px]:text-[8.5px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mt-1 leading-tight">Superintendencia</span>
              </div>
              <div className="flex flex-col items-center justify-start px-1">
                <span className="block text-[10px] min-[375px]:text-[11.5px] sm:text-base md:text-lg font-extrabold text-zinc-800 leading-tight tracking-tight">Multidisciplinario</span>
                <span className="text-[8.5px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mt-1 leading-tight">Apoyo Integral</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            {/* Elegant image container framed by custom border radius */}
            <div className="relative p-3 bg-white/70 backdrop-blur-md rounded-[40px] shadow-2xl border border-white/50 w-full max-w-[420px] overflow-hidden">
              <img 
                className="w-full aspect-[4/5] object-cover rounded-[32px] shadow-inner" 
                alt="Especialistas de Novamente en consulta clínica y orientación terapéutica"
                referrerPolicy="no-referrer"
                src={therapistHeroImage}
              />
              {/* Absolutes for visual accent */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl -z-5"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Appointments Local Persistence Manager */}
      {appointments.length > 0 && (
        <section className="py-12 bg-white border-y border-slate-100 scroll-mt-24" id="mis-horas">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Mis Solicitudes de Hora</h3>
                <p className="text-xs text-zinc-500">Historial de citas registradas localmente en este navegador</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appt) => (
                <div 
                  key={appt.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    appt.status === "cancelled" 
                      ? "bg-slate-50 border-slate-200 opacity-65"
                      : "bg-[#f8f9fe] border-slate-150/80 shadow-xs hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-zinc-400">ID: {appt.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      appt.status === "pending" 
                        ? "bg-amber-100 text-amber-800"
                        : appt.status === "confirmed"
                        ? "bg-success-teal/10 text-success-teal"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {appt.status === "pending" ? "Pendiente" : appt.status === "confirmed" ? "Confirmada" : "Cancelada"}
                    </span>
                  </div>

                  <h4 className="font-bold text-zinc-900 text-sm">{appt.specialty}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Profesional: {appt.practitioner}</p>

                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex flex-col gap-1.5 text-xs text-zinc-650">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{appt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Paciente: {appt.patientName}</span>
                    </div>
                  </div>

                  {appt.status === "pending" && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => cancelAppointment(appt.id)}
                        className="text-[11px] font-semibold text-error-rose hover:underline"
                      >
                        Cancelar solicitud
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nosotros Section */}
      <section className="py-20 bg-white scroll-mt-24" id="nosotros">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          
          <div className="grid lg:grid-cols-12 gap-16 items-center mb-16">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Quiénes Somos</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">Nosotros</h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Novamente nace como un espacio clínico de cobijo y superación, diseñado para acompañar el desarrollo de las personas en cada etapa de su vida mediante un enfoque interdisciplinario.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/30 p-8 rounded-[32px] border border-purple-100/80 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">Misión</h3>
                  <p className="text-[10px] text-primary font-bold tracking-wider uppercase mb-3">Crecimiento e Impacto Humano</p>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Creemos en el poder transformador del esfuerzo y la dedicación. Con espacios de apoyo integral a personas de todas las edades, promovemos su bienestar físico, emocional y cognitivo. A través de especialistas en psicología, fonoaudiología, psicopedagogía y terapia ocupacional, proporcionamos atención de calidad con empatía, respeto y profesionalismo.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-violet-50/70 to-fuchsia-50/30 p-8 rounded-[32px] border border-violet-100/80 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-5">
                    <Activity className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">Visión</h3>
                  <p className="text-[10px] text-secondary font-bold tracking-wider uppercase mb-3">Excelencia y Transformación Social</p>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Somos un centro terapéutico privado de referencia a nivel nacional, reconocido por la excelencia de nuestros servicios y aporte profesional a una sociedad más inclusiva y saludable. Nos mueve la tarea de contribuir con intervenciones efectivas, innovadoras y humanas, mejorando la calidad de vida de nuestros pacientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl p-2 bg-white border border-slate-100">
                <img 
                  alt="Equipo clínico multidisciplinario de Novamente" 
                  className="w-full h-full object-cover rounded-[32px] aspect-video sm:aspect-square" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcCv9AXqXnMH-TC1IfuloPB0IWxRkVHRaAMYTPlNmsL0u385Jqa8DmV0rKVq8YZeIMB_FS_EHPzxdQy0ICLYNkOx_6TkBv1b7vxhD-KrAcuEKToM68sdBbYXrpv7990zEzj12GcAMtk-6WsnGZ_8Q0TLkoAylKo4W5lFv3P0IMRWiXVCR0O_wd2fPOSbnEys8KgfF34eA84JrMIFzf7RR2cSka2S-fiEff1DSGWTGaP-u2H5LP_QmYlvNMHVAe35oIGbqvAtcq-G0"
                />
              </div>
            </div>

          </div>

          {/* Coordinators Section */}
          <div className="space-y-10 pt-10 border-t border-purple-100/55">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Los pilares de nuestro centro</span>
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-900">Equipo de Coordinación</h3>
              <p className="text-xs text-zinc-500 max-w-lg mx-auto">
                Especialistas a cargo de dirigir la calidad del servicio, la admisión empática y el plan clínico personalizado.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {coordinators.map((c) => (
                <div 
                  key={c.id} 
                  className="bg-[#f8f9fe] p-8 rounded-[32px] text-center border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md relative bg-white">
                      {c.avatarUrl ? (
                        <img alt={c.name} className="w-full h-full object-cover" src={c.avatarUrl} />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-xl font-bold ${
                          c.id === "joselyn" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        }`}>
                          {c.initials}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-base font-bold text-zinc-900">{c.name}</h4>
                      <p className="text-xs text-primary font-semibold mt-0.5">{c.role}</p>
                    </div>

                    <p className="text-xs text-zinc-500 italic leading-relaxed pt-2">
                      {c.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Motivos de Consulta Section */}
      <section className="py-20 bg-[#eceef3] scroll-mt-24" id="motivos">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Te acompañamos en tu proceso</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900">Motivos de consulta</h2>
            <p className="text-sm text-zinc-600">
              Principales razones por las que las personas buscan apoyo profesional en Novamente. Haz clic en cualquiera para conocer cómo lo tratamos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {specialties.map((spec) => {
              const IconComponent = ICON_MAP[spec.icon] || ShieldAlert;
              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialty(spec)}
                  className="bg-white p-4 sm:p-6 rounded-[32px] border border-white/40 shadow-xs hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer overflow-hidden w-full"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/10 text-secondary mb-4 flex items-center justify-center group-hover:bg-primary/15 group-hover:text-primary transition-colors shrink-0">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xs font-bold text-zinc-900 group-hover:text-primary transition-colors break-words whitespace-normal px-1 w-full">{spec.name}</h3>
                  <span className="text-[10px] text-primary font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">Ver detalles →</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Specialty Detail Expanded Modal */}
      {selectedSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-indigo/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-[32px] p-8 shadow-2xl relative border border-slate-100 space-y-6">
            <button 
              onClick={() => setSelectedSpecialty(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Cerrar detalles"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                {React.createElement(ICON_MAP[selectedSpecialty.icon] || ShieldAlert, { className: "w-7 h-7" })}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Abordaje Clínico Novamente</span>
                <h3 className="text-xl font-bold text-zinc-900">{selectedSpecialty.name}</h3>
              </div>
            </div>

            <div className="space-y-4 text-sm text-zinc-700">
              <div>
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider text-zinc-500 mb-1">Descripción</h4>
                <p className="leading-relaxed text-zinc-650">{selectedSpecialty.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider text-zinc-500 mb-1">Áreas comunes de foco</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedSpecialty.focusAreas.map((area, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-md text-[11px] text-zinc-650 font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider text-zinc-500 mb-1">¿Cómo lo tratamos en Novamente?</h4>
                <p className="leading-relaxed text-zinc-650 italic bg-primary/5 p-4 rounded-2xl border border-primary/5">
                  "{selectedSpecialty.fullDetails}"
                </p>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <a
                href="https://novamente.site.agendapro.com/cl/sucursal/180212"
                target="_blank"
                rel="noreferrer"
                onClick={() => setSelectedSpecialty(null)}
                className="flex-grow bg-primary text-white py-3 px-6 rounded-full font-bold text-xs text-center hover:bg-primary-container transition-all flex items-center justify-center cursor-pointer"
              >
                Agendar hora
              </a>
              <button
                onClick={() => setSelectedSpecialty(null)}
                className="px-5 py-3 rounded-full font-semibold text-xs border border-slate-200 text-zinc-600 hover:bg-slate-50 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specialties Overview Area */}
      <section className="py-20 bg-white scroll-mt-24" id="especialidades">
        <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Nuestras áreas clínicas</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900">Especialidades Disponibles</h2>
            <p className="text-sm text-zinc-500 max-w-lg mx-auto">
              Contamos con un equipo multidisciplinario experto para entregarte una evaluación integral y personalizada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Psicología",
                desc: "Acompañamiento psicoterapéutico para niños, adolescentes y adultos. Especialistas en regulación emocional, crisis, duelos, autoestima y trastornos psiquiátricos complejos.",
                list: ["Psicoterapia Adultos", "Psicología Infantil", "Terapia Familiar/Pareja", "Terapia Dialéctica DBT"],
                color: "border-primary"
              },
              {
                title: "Fonoaudiología",
                desc: "Abordaje integral del lenguaje, la voz, el habla y la audición. Diagnóstico y rehabilitación de dificultades del habla o deglución en niños y adultos mayor.",
                list: ["Dificultades del Habla", "Rehabilitación de Voz", "Trastornos del Lenguaje", "Evaluación de Deglución"],
                color: "border-secondary"
              },
              {
                title: "Terapia Ocupacional",
                desc: "Facilitamos la independencia en actividades diarias, integración sensorial y desarrollo motriz para optimizar la participación escolar, laboral y social.",
                list: ["Integración Sensorial", "Autonomía de Vida Diaria", "Estimulación Temprana", "Ergonomía Adaptada"],
                color: "border-primary"
              },
              {
                title: "Psicopedagogía",
                desc: "Evaluación e intervención de las dificultades del aprendizaje. Potenciamos procesos cognitivos, hábitos de estudio y habilidades de lectoescritura.",
                list: ["Refuerzo de Aprendizaje", "Estrategias de Estudio", "Déficit de Atención", "Terapia Cognitiva"],
                color: "border-secondary"
              }
            ].map((spec, idx) => (
              <div 
                key={idx} 
                className={`bg-[#f8f9fe] p-8 rounded-[32px] border-t-4 ${spec.color} border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-zinc-900">{spec.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{spec.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/50">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Servicios comunes</h4>
                  <ul className="space-y-1.5">
                    {spec.list.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-zinc-700">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing, Billing and Reimbursment Section */}
      <section className="py-20 bg-[#f5f2fe] scroll-mt-24" id="valores">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Acceso Transparente</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900">Aranceles y Convenios de Reembolso</h2>
              <p className="text-sm text-zinc-650 leading-relaxed">
                En Novamente nos preocupamos por tu tranquilidad económica tanto como por tu bienestar emocional. Entregamos boletas de atención médica con todos los códigos requeridos por la Superintendencia de Salud para que puedas solicitar tu reembolso con total facilidad en tu Isapre o seguro complementario.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Reembolso Isapre y Seguros Complementarios</h4>
                    <p className="text-xs text-zinc-500 mt-1">Todas nuestras especialidades (Psicología, Fonoaudiología, Terapia Ocupacional y Psicopedagogía) califican para el reembolso regular de tus prestaciones de salud.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary shrink-0 mt-0.5">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Medios de Pago Flexibles</h4>
                    <p className="text-xs text-zinc-500 mt-1">Aceptamos transferencias electrónicas directas, tarjetas de débito/crédito y opciones de pago simplificado de forma segura.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white p-8 rounded-[32px] border border-purple-100/60 shadow-xl space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-zinc-900 text-lg mb-4">Aranceles de Consultas</h3>
                  
                  {/* Modern Purple Pill Switcher with Videoconsulta at the end */}
                  <div className="flex bg-purple-50/70 p-1 rounded-xl gap-0.5 sm:gap-1">
                    <button
                      onClick={() => setPricingCategory("presencial")}
                      className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pricingCategory === "presencial"
                          ? "bg-primary text-white shadow-sm"
                          : "text-zinc-600 hover:text-primary"
                      }`}
                    >
                      <span className="sm:hidden">Presencial</span>
                      <span className="hidden sm:inline">Atención Presencial</span>
                    </button>
                    <button
                      onClick={() => setPricingCategory("especiales")}
                      className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pricingCategory === "especiales"
                          ? "bg-primary text-white shadow-sm"
                          : "text-zinc-600 hover:text-primary"
                      }`}
                    >
                      <span className="sm:hidden">Especiales</span>
                      <span className="hidden sm:inline">Psiquiatría y Test</span>
                    </button>
                    <button
                      onClick={() => setPricingCategory("online")}
                      className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pricingCategory === "online"
                          ? "bg-primary text-white shadow-sm"
                          : "text-zinc-600 hover:text-primary"
                      }`}
                    >
                      <span className="sm:hidden">Online</span>
                      <span className="hidden sm:inline">Videoconsulta (Online)</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4 min-h-[260px] flex flex-col justify-between">
                  <div className="space-y-4">
                    {pricingCategory === "online" && (
                      <>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta de Terapia Ocupacional Online</h4>
                            <span className="text-[10px] text-zinc-400 block">Videoconsulta / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta Fonoaudiológica Online</h4>
                            <span className="text-[10px] text-zinc-400 block">Videoconsulta / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta Psicológica Online</h4>
                            <span className="text-[10px] text-zinc-400 block">Videoconsulta / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta Psicopedagógica Online</h4>
                            <span className="text-[10px] text-zinc-400 block">Videoconsulta / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                      </>
                    )}

                    {pricingCategory === "presencial" && (
                      <>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta de Terapia Ocupacional Presencial</h4>
                            <span className="text-[10px] text-zinc-400 block">Sede Providencia / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta Fonoaudiológica Presencial</h4>
                            <span className="text-[10px] text-zinc-400 block">Sede Providencia / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta Psicológica Presencial</h4>
                            <span className="text-[10px] text-zinc-400 block">Sede Providencia / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Consulta Psicopedagógica Presencial</h4>
                            <span className="text-[10px] text-zinc-400 block">Sede Providencia / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$30.000</span>
                        </div>
                      </>
                    )}

                    {pricingCategory === "especiales" && (
                      <>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Sesión de psiquiatría</h4>
                              <span className="px-1.5 py-0.5 bg-purple-100 text-primary rounded text-[9px] font-bold">30 min</span>
                            </div>
                            <span className="text-[10px] text-zinc-400 block">Evaluación y Control / Reembolsable</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$70.000</span>
                        </div>
                        <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-zinc-850 text-xs sm:text-sm">Test ADOS-2</h4>
                              <span className="px-1.5 py-0.5 bg-purple-100 text-primary rounded text-[9px] font-bold">3 Sesiones</span>
                            </div>
                            <span className="text-[10px] text-zinc-400 block">45 min por sesión / Evaluación de Autismo</span>
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">$89.000</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center mt-4">
                    <p className="text-[11px] text-zinc-650 leading-relaxed">
                      ¿Tienes dudas sobre los códigos y reembolsos de Isapre? <a href="https://wa.me/+56988212458" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold cursor-pointer">Escríbenos directamente a nuestro WhatsApp</a> para orientarte de inmediato.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-20 bg-white scroll-mt-24" id="testimonios">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Voces Reales</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900">Nuestros pacientes</h2>
              <p className="text-sm text-zinc-600">Historias y comentarios reales de personas que confiaron en Novamente para dar el primer paso hacia su salud emocional.</p>
            </div>
            
            {/* Carousel Buttons */}
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={handlePrevTestimonial}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-90 cursor-pointer text-zinc-500 hover:border-primary"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextTestimonial}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-90 cursor-pointer text-zinc-500 hover:border-primary"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Testimonials Showcase Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f8f9fe] p-8 md:p-12 rounded-[40px] border border-slate-100/80 shadow-xs">
            
            <div className="lg:col-span-8 space-y-6">
              {/* Quote marks */}
              <span className="text-5xl font-serif text-primary/30 block leading-none select-none">“</span>
              <p className="text-lg md:text-xl text-zinc-850 italic font-medium leading-relaxed">
                {testimonials[testimonialIndex].quote}
              </p>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/10">
                  {testimonials[testimonialIndex].initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">{testimonials[testimonialIndex].author}</h4>
                  <p className="text-xs text-zinc-500">{testimonials[testimonialIndex].specialty}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 border-l border-slate-200/50 pl-0 lg:pl-8 pt-8 lg:pt-0 space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pacientes de Novamente</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Todas nuestras opiniones han sido validadas administrativamente. Nos enorgullece recibir valoraciones destacadas por la calidez en Providencia.
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-amber-450 text-base">★</span>
                ))}
              </div>
              <p className="text-[11px] font-bold text-primary">Promedio: 4.9/5 Estrellas</p>
            </div>

          </div>

          {/* Staggered mini cards for other testimonials (scannable) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setTestimonialIndex(idx)}
                className={`p-6 rounded-3xl border text-left transition-all cursor-pointer ${
                  testimonialIndex === idx 
                    ? "bg-white border-primary shadow-md"
                    : "bg-transparent border-purple-200/80 hover:bg-purple-50/30 hover:border-purple-300"
                }`}
              >
                <p className="text-xs text-zinc-650 line-clamp-2 italic mb-3">"{t.quote}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary/15 text-secondary text-[10px] font-bold flex items-center justify-center">
                    {t.initials}
                  </div>
                  <div>
                    <h5 className="font-bold text-[11px] text-zinc-900 leading-none">{t.author}</h5>
                    <span className="text-[9px] text-zinc-500 mt-1 block">{t.specialty}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Floating CTA Help Trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Helper pop tooltip */}
        <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-100 text-xs text-zinc-800 font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          ¿Tienes dudas? Escríbenos
        </div>
        <a
          href="https://wa.me/+56988212458"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 rounded-full bg-[#10B981] hover:bg-[#0e9f6e] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center scale-100 hover:scale-110 cursor-pointer"
          aria-label="Abrir WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.9.53 3.68 1.46 5.2L2.01 22l5.03-1.43c1.47.88 3.19 1.43 4.96 1.43 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.56c-.24.67-1.19 1.25-1.95 1.33-.53.05-1.22.08-3.52-.87-2.93-1.21-4.83-4.19-4.98-4.39-.14-.19-1.16-1.54-1.16-2.93 0-1.39.73-2.07 1-2.36.22-.24.59-.36.94-.36.1 0 .21 0 .3.01.28.01.42.03.6.47.23.56.78 1.9.85 2.05.07.15.12.33.02.53-.1.2-.15.3-.3.48-.15.18-.31.41-.44.55-.15.15-.31.32-.13.63.18.3.8 1.31 1.71 2.12.7.63 1.31.83 1.63.98.32.15.51.13.71-.09.2-.23.86-.99.98-1.22.12-.23.24-.19.4-.13.16.06 1.04.49 1.22.58.18.09.3.13.34.21.05.08.05.47-.19 1.14z"/>
          </svg>
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-[#f5f2fe] border-t border-purple-100/65">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5 space-y-6">
            <Logo />
            
            <p className="text-xs text-zinc-600 leading-relaxed max-w-sm">
              Dedicados a transformar vidas a través de la salud mental y física. Brindamos un espacio de absoluta confianza, empatía y profesionalismo para tu crecimiento y sanación personal.
            </p>

            <div className="space-y-2.5 text-xs text-zinc-650">
              <a href="tel:+56222457657" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-zinc-500" />
                <span>+562 22457657</span>
              </a>
              <a href="mailto:atencionpacientes@novamente.cl" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span>atencionpacientes@novamente.cl</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span>Av. Pedro de Valdivia # 291, oficina 101, Providencia. Santiago 2026.</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button 
                onClick={handleShareClick}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-zinc-700 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-200/80 shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-primary" />
                {copiedUrl ? "¡Copiado al portapapeles!" : "Compartir Sitio"}
              </button>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Explorar</h5>
              <ul className="space-y-2 text-xs text-zinc-650">
                <li><a href="#motivos" className="hover:text-primary transition-colors">Motivos de Consulta</a></li>
                <li><a href="#nosotros" className="hover:text-primary transition-colors">Nosotros</a></li>
                <li><a href="#valores" className="hover:text-primary transition-colors">Convenios y Aranceles</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Especialidades</h5>
              <ul className="space-y-2 text-xs text-zinc-650">
                <li><a href="#especialidades" className="hover:text-primary transition-colors">Psicología</a></li>
                <li><a href="#especialidades" className="hover:text-primary transition-colors">Fonoaudiología</a></li>
                <li><a href="#especialidades" className="hover:text-primary transition-colors">Terapia Ocupacional</a></li>
                <li><a href="#especialidades" className="hover:text-primary transition-colors">Psicopedagogía</a></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h5 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Ayuda y Contacto</h5>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                ¿Necesitas soporte técnico con el agendamiento? Escríbenos a soporte o agenda por llamada telefónica directa.
              </p>
              <a 
                href="https://wa.me/+56988212458" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-[#10B981] text-white py-1.5 px-3.5 rounded-lg text-xs font-semibold hover:bg-opacity-95 shadow-sm"
              >
                WhatsApp Directo
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200/50 py-6 text-center text-xs text-zinc-500">
          <p>© 2026 Novamente • Centro Terapéutico Profesional. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Booking Wizard Modal Portal */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />

      {/* AI Specialist Chat Drawer Portal */}
      <SpecialistChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

    </div>
  );
}
