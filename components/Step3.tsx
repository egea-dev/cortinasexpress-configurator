import React from 'react';
import { Ruler, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { CurtainType, Measurement } from '../types';

interface Step3Props {
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  currentMeasure: { width: string; height: string };
  setCurrentMeasure: React.Dispatch<React.SetStateAction<{ width: string; height: string }>>;
  heightError: boolean;
  setHeightError: React.Dispatch<React.SetStateAction<boolean>>;
  selectedType: CurtainType | null;
  totalPrice: number;
  hidePrice: boolean;
  maxHeight: number;
}

export const Step3: React.FC<Step3Props> = ({
  measurements,
  setMeasurements,
  currentMeasure,
  setCurrentMeasure,
  heightError,
  setHeightError,
  selectedType,
  totalPrice,
  hidePrice,
  maxHeight
}) => {
  const handleAdd = () => {
    const w = parseFloat(currentMeasure.width);
    const h = parseFloat(currentMeasure.height);

    if (!w || !h) return;
    if (h > maxHeight) {
      setHeightError(true);
      return;
    }

    setHeightError(false);
    const price = (w * h / 10000) * (selectedType?.pricePerM2 || 30); // cm² to m²

    setMeasurements([...measurements, {
      id: Date.now(),
      width: w,
      height: h,
      price: price,
      type: selectedType,
      quantity: 1
    }]);
    setCurrentMeasure({ width: '', height: '' });
  };

  const removeMeasurement = (id: number) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setMeasurements(measurements.map(m => {
      if (m.id === id) {
        const newQty = Math.max(1, m.quantity + change);
        return { ...m, quantity: newQty };
      }
      return m;
    }));
  };

  // Styles unified with Step 1
  const inputClass = "w-full p-3 pl-10 text-base border border-gray-200 rounded-lg outline-none bg-white text-gray-900 placeholder-gray-400 focus:border-orange-500 transition-colors duration-200";

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        ¿Qué medidas necesitas?
      </h2>

      {selectedType && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600 mb-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Tipo: <strong>{selectedType.label}</strong>
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ancho (cm)</label>
            <div className="relative">
              <input
                type="number"
                value={currentMeasure.width}
                onChange={(e) => setCurrentMeasure(prev => ({ ...prev, width: e.target.value }))}
                className={inputClass}
                placeholder="Ej. 150"
              />
              <Ruler className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alto (cm)</label>
            <div className="relative">
              <input
                type="number"
                value={currentMeasure.height}
                onChange={(e) => {
                  setHeightError(false);
                  setCurrentMeasure(prev => ({ ...prev, height: e.target.value }));
                }}
                className={`w-full p-3 pl-10 text-base border rounded-lg outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                  heightError 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-orange-500 bg-white'
                }`}
                placeholder="Ej. 250"
              />
              <Ruler className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            {heightError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex gap-2 items-start animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">¡Atención!</p>
                  <p>El alto no puede superar los {maxHeight}cm. <a href="#" className="underline font-medium">Contáctanos aquí</a> para medidas especiales.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!currentMeasure.width || !currentMeasure.height}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform"
        >
          <Plus size={20} /> Añadir Ventana
        </button>
      </div>

      {/* List of measurements */}
      {measurements.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center md:hidden pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tus Ventanas</h3>
            <span className="text-sm font-bold text-orange-600">
              {hidePrice ? 'Consultar' : `Total: ${totalPrice.toFixed(2)}€`}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider hidden md:block">Tus Ventanas</h3>

          {measurements.map((m, idx) => (
            <div key={m.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm gap-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.width}cm x {m.height}cm</p>
                  <p className="text-xs text-gray-500">{m.type?.label}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                {/* Quantity Control */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(m.id, -1)}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm font-bold text-gray-700 min-w-[30px] text-center">{m.quantity}</span>
                  <button
                    onClick={() => updateQuantity(m.id, 1)}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-800">
                    {hidePrice ? 'Consultar' : `${(m.price * m.quantity).toFixed(2)}€`}
                  </span>
                  <button onClick={() => removeMeasurement(m.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};