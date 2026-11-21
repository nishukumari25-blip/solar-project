import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Calculator, Zap, Sun, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatINR } from '../../utils/formatters';

export default function BOMTemplatesPage() {
  const navigate = useNavigate();
  const { bomTemplates } = useERP();

  // Calculator State
  const [monthlyUnits, setMonthlyUnits] = useState(600);
  const [electricityTariff, setElectricityTariff] = useState(8.5);

  // Calculations
  const recommendedKW = Math.max(1, Math.round((monthlyUnits / 120) * 2) / 2); // ~120 units per kW per month in Rajasthan
  const estimatedAnnualUnits = recommendedKW * 1450;
  const annualSavings = estimatedAnnualUnits * electricityTariff;
  const requiredAreaSqFt = recommendedKW * 100;
  
  // Central Subsidy calculation (PM Surya Ghar Muft Bijli Yojana)
  // Up to 2 kW: ₹30,000 / kW => ₹60,000
  // 3 kW: ₹78,000 (Max residential subsidy)
  let estimatedSubsidy = 0;
  if (recommendedKW <= 1) estimatedSubsidy = 30000;
  else if (recommendedKW <= 2) estimatedSubsidy = 60000;
  else estimatedSubsidy = 78000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Standard BOM Templates & Sizing Engine</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Standardized Bill of Materials blueprints for direct-to-site procurement and sizing calculations.
        </p>
      </div>

      {/* Sizing Calculator Tool */}
      <Card className="p-5 bg-gradient-to-br from-blue-50/50 to-slate-50 border-blue-200/60 space-y-4">
        <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
          <Calculator className="w-5 h-5 text-[#163A5F]" />
          <h2 className="font-bold text-slate-800 text-sm">Solar Rooftop Sizing & Subsidy Estimator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Monthly Units Consumed (kWh)
            </label>
            <input
              type="number"
              min={50}
              step={20}
              value={monthlyUnits}
              onChange={(e) => setMonthlyUnits(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              DISCOM Tariff (₹ / Unit)
            </label>
            <input
              type="number"
              step={0.5}
              value={electricityTariff}
              onChange={(e) => setElectricityTariff(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
            />
          </div>

          {/* Result 1: Recommended kW */}
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <span className="text-[11px] text-slate-500 font-medium block">Recommended System</span>
            <span className="text-lg font-bold text-[#163A5F]">{recommendedKW} kWp</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Needs ~{requiredAreaSqFt} sq ft shadow-free</span>
          </div>

          {/* Result 2: Est. Subsidy */}
          <div className="bg-white p-3 rounded-lg border border-emerald-200">
            <span className="text-[11px] text-slate-500 font-medium block">PM Surya Ghar Subsidy</span>
            <span className="text-lg font-bold text-emerald-600">{formatINR(estimatedSubsidy)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Credited to customer account</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2 border-t border-blue-100">
          <div>
            Est. Annual Generation: <strong className="text-slate-800">{estimatedAnnualUnits.toLocaleString()} kWh</strong> | 
            Annual Power Bill Savings: <strong className="text-emerald-700">{formatINR(annualSavings)}</strong>
          </div>
          <Button
            variant="teal"
            size="xs"
            icon={ArrowRight}
            onClick={() => navigate(`/sales/new-quote?capacity=${recommendedKW}`)}
          >
            Create Quote for {recommendedKW} kW
          </Button>
        </div>
      </Card>

      {/* BOM Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bomTemplates.map((template) => (
          <Card key={template.id} className="p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-semibold text-slate-400">
                  {template.templateCode}
                </span>
                <h3 className="text-base font-bold text-slate-900">{template.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-xs rounded border border-amber-200">
                  {template.capacityKW} kWp Capacity
                </span>
              </div>
              <Button
                variant="primary"
                size="xs"
                onClick={() => navigate(`/sales/new-quote?templateId=${template.id}`)}
              >
                Use Template
              </Button>
            </div>

            {/* Equipment Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-1.5">Component</th>
                    <th className="py-1.5">Spec / Model</th>
                    <th className="py-1.5 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {template.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 font-medium text-slate-800">{item.itemCategory}</td>
                      <td className="py-2 text-slate-500">{item.specification}</td>
                      <td className="py-2 text-right font-semibold text-slate-900">
                        {item.quantity} {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 flex items-center gap-1.5 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ALMM Approved Modules & DCR compliant for Government Rooftop Subsidy scheme.</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
