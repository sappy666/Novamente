import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { specialties, coordinators } from "../data";
import { Appointment } from "../types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
  "07:00 PM",
];

export default function BookingModal({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedPractitioner, setSelectedPractitioner] = useState("Cualquier Especialista Disponible");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  // Patient Details Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  // Form Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validateDetails = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "El nombre completo es requerido.";
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Formato de correo inválido.";
    }
    if (!phone.trim()) {
      newErrors.phone = "El teléfono es requerido.";
    } else if (!/^[+0-9]{8,15}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Número de teléfono inválido (mínimo 8 dígitos).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedSpecialty) {
      alert("Por favor selecciona una especialidad.");
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      alert("Por favor selecciona una fecha y una hora.");
      return;
    }
    if (step === 3) {
      if (!validateDetails()) return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = () => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2, 11),
      patientName: name,
      patientEmail: email,
      patientPhone: phone,
      specialty: selectedSpecialty,
      practitioner: selectedPractitioner,
      date: selectedDate,
      time: selectedTime,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save to LocalStorage
    const existing = localStorage.getItem("novamente_appointments");
    const appointments = existing ? JSON.parse(existing) : [];
    appointments.push(newAppointment);
    localStorage.setItem("novamente_appointments", JSON.stringify(appointments));

    // Callback to parent
    onSuccess(newAppointment);
    setStep(5); // Success state step
  };

  const resetForm = () => {
    setStep(1);
    setSelectedSpecialty("");
    setSelectedPractitioner("Cualquier Especialista Disponible");
    setSelectedDate("");
    setSelectedTime("");
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-deep-indigo/40 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 flex flex-col max-h-[90vh]"
        id="booking-modal-container"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Agendar Hora Médica Online</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Completa los pasos en menos de 2 minutos</p>
          </div>
          {step < 5 && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {step < 5 && (
          <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 relative">
            <div 
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Content area */}
        <div className="p-8 overflow-y-auto flex-grow">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Paso 1: Selecciona la Especialidad Terapéutica</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">¿Qué tipo de atención profesional necesitas hoy?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "Psicología", desc: "Apoyo emocional, ansiedad, depresión y regulación mental" },
                  { id: "Fonoaudiología", desc: "Terapia del lenguaje, habla, deglución y audición" },
                  { id: "Terapia Ocupacional", desc: "Autonomía en actividades diarias e integración sensorial" },
                  { id: "Psicopedagogía", desc: "Apoyo escolar y dificultades del aprendizaje" }
                ].map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpecialty(spec.id)}
                    className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      selectedSpecialty === spec.id 
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
                        : "border-slate-100 dark:border-zinc-800 hover:border-slate-200 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20"
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-zinc-950 dark:text-white">{spec.id}</h5>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">{spec.desc}</p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                        selectedSpecialty === spec.id 
                          ? "bg-primary border-primary text-white" 
                          : "border-slate-300 dark:border-zinc-700 text-transparent"
                      }`}>
                        ✓
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                  Preferencia de Profesional (Opcional)
                </label>
                <select
                  value={selectedPractitioner}
                  onChange={(e) => setSelectedPractitioner(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Cualquier Especialista Disponible">Cualquier Especialista Disponible</option>
                  {coordinators.map((c) => (
                    <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                  ))}
                  <option value="Dra. Macarena González (Psicología)">Dra. Macarena González (Psicología)</option>
                  <option value="Dr. Felipe Castillo (Fonoaudiología)">Dr. Felipe Castillo (Fonoaudiología)</option>
                  <option value="Dra. Paulina Rojas (Terapia Ocupacional)">Dra. Paulina Rojas (Terapia Ocupacional)</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Paso 2: Elige Fecha y Hora</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Selecciona el día y horario que mejor te acomode</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-primary" /> Seleccionar Día
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" /> Horarios Disponibles
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                          selectedTime === time
                            ? "bg-primary border-primary text-primary-container font-bold"
                            : "bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 border-slate-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Paso 3: Datos de Contacto del Paciente</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Para enviarte la confirmación de la cita y el enlace de teleconsulta (si corresponde)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" /> Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Macarena González"
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-850 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.name ? "border-error" : "border-slate-200 dark:border-zinc-700"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" /> Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@correo.com"
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-850 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        errors.email ? "border-error" : "border-slate-200 dark:border-zinc-700"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" /> Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: +56912345678"
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-850 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        errors.phone ? "border-error" : "border-slate-200 dark:border-zinc-700"
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-400" /> Nota o Motivo de Consulta (Opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Cuéntanos brevemente qué te motiva a consultar para asignar al terapeuta ideal..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Paso 4: Confirma tu Solicitud de Hora</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Por favor, revisa detalladamente la información de tu reserva</p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/40 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm pb-4 border-b border-slate-250/50 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-xs">Especialidad</span>
                    <strong className="text-zinc-900 dark:text-white">{selectedSpecialty}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-xs">Profesional</span>
                    <strong className="text-zinc-900 dark:text-white">{selectedPractitioner}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pb-4 border-b border-slate-250/50 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-xs">Fecha</span>
                    <strong className="text-zinc-900 dark:text-white">{selectedDate}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-xs">Horario de Atención</span>
                    <strong className="text-zinc-950 dark:text-white">{selectedTime}</strong>
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-zinc-500 block text-xs">Paciente</span>
                    <strong className="text-zinc-900 dark:text-white">{name}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-zinc-500 block text-xs">Correo</span>
                      <span className="text-zinc-800 dark:text-zinc-300 font-medium">{email}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs">Teléfono</span>
                      <span className="text-zinc-800 dark:text-zinc-300 font-medium">{phone}</span>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div className="pt-2 text-sm border-t border-slate-200/50 dark:border-zinc-800">
                    <span className="text-zinc-500 block text-xs">Notas</span>
                    <p className="text-zinc-700 dark:text-zinc-350 italic mt-1 leading-relaxed">{notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 dark:bg-primary/15 rounded-2xl border border-primary/10">
                <span className="text-primary text-lg mt-0.5">ℹ</span>
                <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed">
                  Tu reserva quedará agendada en estado <strong>Pendiente de Confirmación</strong>. Cristi Carreño, nuestra Coordinadora Administrativa, te contactará por WhatsApp o correo en las próximas horas para confirmar oficialmente e indicarte el proceso de pago/reembolso Fonasa o Isapre.
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-12 space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-success-teal/10 flex items-center justify-center text-success-teal">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div className="space-y-2 max-w-md">
                <h4 className="text-2xl font-bold text-zinc-900 dark:text-white">¡Solicitud Registrada con Éxito!</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Hemos guardado tu cita. El equipo administrativo de Novamente revisará los detalles y te enviará la confirmación final muy pronto.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/40 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 text-left w-full max-w-md space-y-3">
                <p className="text-xs text-center font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-slate-200/50">Detalles de la Cita</p>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Paciente:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Especialidad:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{selectedSpecialty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Profesional:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{selectedPractitioner}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Fecha y Hora:</span>
                  <span className="font-bold text-primary">{selectedDate} a las {selectedTime}</span>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="bg-primary text-white font-semibold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-primary-container"
              >
                Volver al Sitio Web
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step < 5 && (
          <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 flex justify-between items-center">
            {step > 1 ? (
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-2 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100/50 dark:hover:bg-zinc-800/40"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-white py-2.5 px-6 rounded-xl hover:bg-primary-container transition-all shadow-md hover:shadow-lg"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                className="flex items-center gap-1.5 text-sm font-bold bg-success-teal text-white py-2.5 px-6 rounded-xl hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirmar Cita
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
