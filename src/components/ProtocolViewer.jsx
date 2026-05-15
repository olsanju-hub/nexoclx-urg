import React, { useState } from 'react';
import {
  ChevronLeft,
  AlertCircle,
  Heart,
  Zap,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  Calculator,
} from 'lucide-react';
import { getCalculator } from '../data/calculators';

export function ProtocolViewer({ protocolId, onBack, onCalculatorOpen }) {
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadProtocol = async () => {
      try {
        const module = await import('../data/protocolsIndex');
        const proto = module.getProtocol(protocolId);
        setProtocol(proto);
      } catch (error) {
        console.error('Error loading protocol:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProtocol();
  }, [protocolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Stethoscope className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Cargando protocolo...</p>
        </div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Protocolo no encontrado</p>
        </div>
      </div>
    );
  }

  const Section = ({ icon: Icon, title, items, color }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="text-sm text-gray-700">
              <span className="font-medium text-blue-600">• </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{protocol.title}</h1>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {protocol.specialty}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              protocol.category === 'Emergencia'
                ? 'bg-red-100 text-red-700'
                : protocol.category === 'Urgencia'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {protocol.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Definition */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <h2 className="font-semibold text-blue-900 mb-2">Definición</h2>
          <p className="text-gray-700">{protocol.definition}</p>
        </div>

        {/* Diagnostic Orders */}
        <Section
          icon={BookOpen}
          title="Órdenes diagnósticas"
          items={protocol.diagnosticOrders}
          color="text-purple-600"
        />

        {/* Expected Findings */}
        <Section
          icon={Heart}
          title="Hallazgos esperados"
          items={protocol.expectedFindings}
          color="text-pink-600"
        />

        {/* Treatment */}
        <Section
          icon={Zap}
          title="Tratamiento"
          items={protocol.treatment}
          color="text-green-600"
        />

        {protocol.calculatorIds && protocol.calculatorIds.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Escalas y cálculos</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {protocol.calculatorIds.map((calculatorId) => {
                const calculator = getCalculator(calculatorId);
                return (
                  <button
                    key={calculatorId}
                    type="button"
                    onClick={() => onCalculatorOpen?.(calculatorId)}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-blue-300"
                  >
                    <p className="text-sm font-semibold text-gray-900">{calculator.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{calculator.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Follow-up */}
        <Section
          icon={Stethoscope}
          title="Seguimiento"
          items={protocol.followUp}
          color="text-blue-600"
        />

        {/* Red Flags */}
        {protocol.redFlags && protocol.redFlags.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Señales de alerta</h3>
            </div>
            <div className="space-y-1">
              {protocol.redFlags.map((flag, idx) => (
                <div key={idx} className="text-sm text-red-700">
                  <span className="font-medium">⚠ </span>
                  {flag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {protocol.notes && (
          <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-gray-400">
            <p className="text-sm text-gray-700 italic">{protocol.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
