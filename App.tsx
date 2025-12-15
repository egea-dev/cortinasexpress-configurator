import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  PlayCircle,
  Ruler
} from 'lucide-react';

import { Welcome } from './components/Welcome';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { Step4 } from './components/Step4';

import { FormData, CurtainType, Measurement } from './types';
import { CURTAIN_TYPES, MINIMUM_UNITS, MAX_HEIGHT, HIDE_PRICE_THRESHOLD } from './constants';

export default function App() {
  const [step, setStep] = useState(0); // 0 = Welcome Screen
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    razonSocial: '', // Inicialización
    cif: '',         // Inicialización
    goal: 'simulation', 
  });
  
  const [selectedType, setSelectedType] = useState<CurtainType | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentMeasure, setCurrentMeasure] = useState({ width: '', height: '' });
  const [heightError, setHeightError] = useState(false);
  
  // Logic
  const calculateTotal = () => measurements.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const calculateUnits = () => measurements.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = calculateTotal();
  const totalUnits = calculateUnits();
  
  // LÓGICA DE NEGOCIO ACTUALIZADA:
  // Se oculta el precio si las unidades superan el umbral O si el precio total supera los 2500€
  const hidePrice = totalUnits > HIDE_PRICE_THRESHOLD || totalPrice > 2500;

  const calculateProgress = () => {
    let progress = 0;
    // Step 0: 0%
    if (step === 0) return 0;

    // Step 1: 25% (Actualizado para incluir Razón Social y CIF)
    if (step > 1) {
        progress += 25;
    } else {
        const fields = [
            formData.firstName, 
            formData.lastName, 
            formData.email, 
            formData.phone,
            formData.razonSocial,
            formData.cif
        ];
        const filled = fields.filter(f => f && f.trim() !== '').length;
        progress += (filled / 6) * 25; // Dividido por 6 campos totales
    }
    // Step 2: 25%
    if (step > 2) {
        progress += 25;
    } else if (step === 2) {
        if (selectedType) progress += 25;
    }
    // Step 3: 40%
    if (step > 3) {
        progress += 40;
    } else if (step === 3) {
        if (measurements.length > 0) {
            progress += 10;
            const unitProgress = Math.min(1, totalUnits / MINIMUM_UNITS);
            progress += unitProgress * 30;
        }
    }
    // Step 4: 10%
    if (step === 4) return 100;
    return Math.min(100, Math.round(progress));
  };

  const progressPercent = calculateProgress();
  
  // Validación estricta para profesionales
  const canProceedStep1 = 
    formData.firstName && 
    formData.lastName && 
    formData.email && 
    formData.phone &&
    formData.razonSocial && 
    formData.cif;

  const handleNext = () => {
    if (step === 0) {
        setStep(1);
    } else if (step === 1) {
        if (!canProceedStep1) return;
        if (formData.goal === 'info') {
            setStep(4);
        } else {
            setStep(2);
        }
    } else if (step === 3) {
        if (totalUnits < MINIMUM_UNITS) {
            setFormData(prev => ({ ...prev, goal: 'info' }));
        }
        setStep(4);
    } else if (step < 4) {
        setStep(step + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 1) {
        setStep(0);
    } else if (step === 4 && formData.goal === 'info' && measurements.length === 0) {
        setStep(1);
    } else if (step > 1) {
        setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF4F5] flex items-center justify-center p-2 md:p-6 font-sans">
      <div className="bg-white w-full max-w-6xl h-auto min-h-[580px] md:h-[650px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative transition-all duration-500 transform-gpu isolate ring-1 ring-black/5">
        
        {/* Barra de progreso horizontal superior */}
        {step > 0 && (
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
            <div 
              className="h-full bg-orange-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {step === 0 ? (
             <Welcome onStart={() => setStep(1)} />
        ) : (
            <>
                {/* Left Side: Form */}
                <div className="w-full md:w-[65%] p-6 md:p-8 flex flex-col relative z-10 bg-white/80 backdrop-blur-sm order-1 md:order-1 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <button onClick={handleBack} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm font-medium transition-colors p-2 -ml-2">
                            <ArrowLeft size={16} /> Volver
                        </button>
                        
                        {/* Indicador de Porcentaje Compacto en la Cabecera */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest hidden md:block">
                                Paso {step} de 4
                            </span>
                            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
                                <span className="text-xs font-bold text-orange-700">{progressPercent}%</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-2 md:pb-0">
                        {step === 1 && (
                        <Step1 
                            formData={formData} 
                            setFormData={setFormData} 
                        />
                        )}
                        {step === 2 && (
                        <Step2 
                            curtainTypes={CURTAIN_TYPES}
                            selectedType={selectedType} 
                            setSelectedType={setSelectedType} 
                        />
                        )}
                        {step === 3 && (
                        <Step3 
                            measurements={measurements} 
                            setMeasurements={setMeasurements}
                            currentMeasure={currentMeasure}
                            setCurrentMeasure={setCurrentMeasure}
                            heightError={heightError}
                            setHeightError={setHeightError}
                            selectedType={selectedType}
                            totalPrice={totalPrice}
                            hidePrice={hidePrice}
                            maxHeight={MAX_HEIGHT}
                        />
                        )}
                        {step === 4 && (
                        <Step4 
                            formData={formData} 
                            measurements={measurements} 
                            totalPrice={totalPrice} 
                            totalUnits={totalUnits} 
                            hidePrice={hidePrice}
                            selectedType={selectedType}
                        />
                        )}
                    </div>

                    {(step === 1 || step === 2 || step === 3) && (
                        <div className="mt-4 flex justify-end">
                        {step === 3 ? (
                            <button 
                            onClick={handleNext}
                            disabled={measurements.length === 0}
                            className={`w-full text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:shadow-none active:scale-95 transform ${
                                (totalUnits >= MINIMUM_UNITS && !hidePrice) 
                                    ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            }`}
                        >
                            {(totalUnits >= MINIMUM_UNITS && !hidePrice) 
                                ? 'Me interesa (Comprar)' 
                                : 'Más información'
                            }
                        </button>
                        ) : (
                            <button 
                                onClick={handleNext}
                                disabled={
                                    (step === 1 && !canProceedStep1) || 
                                    (step === 2 && !selectedType)
                                }
                                className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center md:justify-start gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:translate-y-0 hover:-translate-y-0.5 active:scale-95"
                            >
                                Continuar <ArrowRight size={18} />
                            </button>
                        )}
                        </div>
                    )}
                </div>

                {/* Right Side: Info Only (Clean layout without big percentage) */}
                <div className="w-full md:w-[35%] bg-white relative border-l border-gray-100 flex flex-col order-2 md:order-2 justify-between animate-fadeIn">
                    <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-gradient-to-br from-orange-100 to-yellow-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                    {/* TOP CONTENT: Info */}
                    <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-8 relative z-10 w-full">
                        <div className="text-center w-full max-w-xs">
                            {step === 1 && (
                                <div className="hidden md:block">
                                    <h3 className="font-bold text-gray-800 mb-2">Información Profesional</h3>
                                    <p className="text-sm text-gray-500">Tus datos están seguros. Solo los usaremos para gestionar tu presupuesto.</p>
                                    
                                    <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                        <p className="text-xs text-orange-800 font-medium">✨ Rellena todos los campos para continuar al seleccionador de tejidos.</p>
                                    </div>
                                </div>
                            )}
                            {step === 2 && (
                                <div>
                                    <div className="hidden md:block mb-6">
                                        <h3 className="font-bold text-gray-800 mb-2">Estilo y Tejido</h3>
                                        <p className="text-sm text-gray-500">Seleccionaste: <span className="font-bold text-orange-500">{selectedType?.label || '...'}</span></p>
                                    </div>
                                    <a href="#" className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors text-left justify-center">
                                        <PlayCircle size={20} className="shrink-0" />
                                        <span>Ver vídeo: Cómo medir</span>
                                    </a>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="w-full">
                                    <h3 className="font-bold text-gray-800 mb-2">Tu Presupuesto</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 mb-2">
                                        <span className={`text-3xl font-bold ${hidePrice ? 'text-orange-600' : 'text-gray-900'}`}>
                                            {hidePrice ? 'Consultar' : `${totalPrice.toFixed(2)}€`}
                                        </span>
                                        <span className="block text-xs text-gray-400">
                                            {hidePrice ? 'Volumen alto / Importe > 2.500€' : 'Total estimado'}
                                        </span>
                                    </div>
                                    
                                    {totalUnits > 0 && (
                                        <div className="mb-6">
                                            {totalUnits < MINIMUM_UNITS ? (
                                                <div className="bg-orange-50 text-orange-700 text-xs p-3 rounded-lg border border-orange-100 text-left">
                                                    <p className="font-bold mb-1">Unidades actuales: {totalUnits}</p>
                                                    <div className="w-full bg-orange-200 h-1.5 rounded-full overflow-hidden mb-1">
                                                        <div 
                                                            className="bg-orange-500 h-full transition-all duration-500" 
                                                            style={{width: `${(totalUnits / MINIMUM_UNITS) * 100}%`}}
                                                        ></div>
                                                    </div>
                                                    <p className="mt-1">Mínimo para compra directa: <strong>{MINIMUM_UNITS} uds</strong>.</p>
                                                </div>
                                            ) : (
                                                <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg border border-green-100 flex items-center gap-2 text-left">
                                                    <Check size={16} className="shrink-0" />
                                                    <span>Pedido directo habilitado.</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <a href="#" className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors text-left mb-4 justify-center">
                                        <Ruler size={20} className="shrink-0" />
                                        <span>Aprende cómo medir</span>
                                    </a>
                                </div>
                            )}
                            {step === 4 && (
                                <div className="w-full pb-8 md:pb-0">
                                    <h3 className="font-bold text-gray-800 mb-4">Enviando Datos</h3>
                                    <p className="text-sm text-gray-500">Estamos procesando tu solicitud.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BOTTOM: Steps Indicators */}
                    <div className="hidden md:flex justify-center pb-8 gap-4 relative z-10">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-1">
                                <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        step >= s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {step > s ? <Check size={14} /> : s}
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${step >= s ? 'text-orange-500' : 'text-gray-300'}`}>
                                    {['Datos', 'Tipo', 'Medidas', 'Fin'][s-1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}