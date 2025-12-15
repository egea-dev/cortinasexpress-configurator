import React from 'react';
import { Scissors, ArrowRight } from 'lucide-react';
import { CurtainType } from '../types';

interface Step2Props {
  curtainTypes: CurtainType[];
  selectedType: CurtainType | null;
  setSelectedType: React.Dispatch<React.SetStateAction<CurtainType | null>>;
}

export const Step2: React.FC<Step2Props> = ({ curtainTypes, selectedType, setSelectedType }) => {
  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        Selecciona el tipo de cortina
      </h2>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Elige el estilo que mejor se adapte a tu espacio.
      </p>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Options List */}
        <div className="space-y-3 order-2 md:order-1">
          {curtainTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type)}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all text-left group active:scale-[0.98] ${
                selectedType?.id === type.id 
                  ? 'border-orange-500 bg-orange-50 shadow-sm' 
                  : 'border-gray-200 hover:border-orange-200 bg-white'
              }`}
            >
              <span className="font-medium text-gray-800">{type.label}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedType?.id === type.id ? 'border-orange-500' : 'border-gray-300'
              }`}>
                {selectedType?.id === type.id && (
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="order-1 md:order-2 bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col shadow-sm mb-4 md:mb-0 h-fit">
          <div className="h-40 bg-gray-50 relative overflow-hidden border-b border-gray-100">
            <div className="w-full h-full flex items-center justify-center bg-[#f0f0f0]">
               {/* Technical Drawing SVG */}
               <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
                  <defs>
                    <pattern id="curtain-pleats" x="0" y="0" width="40" height="200" patternUnits="userSpaceOnUse">
                       <rect x="0" y="0" width="40" height="200" fill="#f5f5f5" />
                       
                       {/* Top Tape Area */}
                       <rect x="0" y="0" width="40" height="60" fill="none" />
                       
                       {/* Top loops/ruffle pattern */}
                       <path d="M0,5 Q5,0 10,5 T20,5 T30,5 T40,5" stroke="#1f2937" strokeWidth="1.5" fill="none"/>
                       
                       {/* Vertical Pleat Lines */}
                       {/* Main fold line 1 */}
                       <path d="M5,5 L8,200" stroke="#1f2937" strokeWidth="1.5" fill="none"/>
                       {/* Inner detail line 1 */}
                       <path d="M12,10 L12,140" stroke="#1f2937" strokeWidth="1" fill="none" opacity="0.7"/>
                       {/* Main fold line 2 */}
                       <path d="M25,5 L22,200" stroke="#1f2937" strokeWidth="1.5" fill="none"/>
                       {/* Inner detail line 2 */}
                       <path d="M32,10 L32,150" stroke="#1f2937" strokeWidth="1" fill="none" opacity="0.7"/>
                       
                       {/* Horizontal Stitching Line */}
                       <path d="M0,45 L40,45" stroke="#1f2937" strokeWidth="1" strokeDasharray="3 2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#curtain-pleats)" />
               </svg>
            </div>
            {selectedType && (
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm border border-gray-200">
                    Estilo {selectedType.label}
                </div>
            )}
          </div>
          <div className="p-4 md:p-6 bg-orange-50/50 flex-1">
            <h3 className="text-base md:text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
              <Scissors size={20} /> Tipo de Confección
            </h3>
            {selectedType ? (
              <div className="animate-fadeIn">
                <p className="font-medium text-gray-800 mb-2">{selectedType.label}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {selectedType.description}
                </p>
                <div className="pt-4 border-t border-orange-200">
                  <p className="text-sm font-bold text-orange-800 flex items-center gap-2">
                    <ArrowRight size={16} /> Revisa las medidas en el siguiente paso
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Selecciona una opción para ver los detalles.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};