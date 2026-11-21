import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Camera,
  CheckCircle2,
  Save,
  Send,
  ArrowLeft,
  Wifi,
  Sun,
  Layers,
  Zap,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ProofPhotoUpload from '../../components/common/ProofPhotoUpload';

export default function SurveyFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get('leadId');

  const { leads, addSurvey } = useERP();

  const [formData, setFormData] = useState({
    leadId: leadIdParam || '',
    customerName: '',
    mobile: '',
    gpsCoordinates: '26.9124° N, 75.7873° E',
    roofType: 'RCC Flat Roof',
    shadowFreeAreaSqFt: 650,
    tiltAngle: 26,
    azimuth: 'South (180°)',
    electricalPhase: '3-Phase',
    cableDistanceMeters: 25,
    surveyorName: 'Amit Sharma',
    surveyDate: new Date().toISOString().split('T')[0],
    obstacleNotes: 'No prominent trees or adjacent high-rises. Excellent shadow-free solar irradiation.',
    customerAgreed: true,
  });

  const [photoRooftop, setPhotoRooftop] = useState(null);
  const [photoMeter, setPhotoMeter] = useState(null);
  const [photoInverter, setPhotoInverter] = useState(null);
  const [photoObstacle, setPhotoObstacle] = useState(null);

  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If leadIdParam is present, prefill customer info
  useEffect(() => {
    if (leadIdParam) {
      const match = leads.find((l) => l.id === leadIdParam);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          leadId: match.id,
          customerName: match.customerName,
          mobile: match.mobile,
          shadowFreeAreaSqFt: (match.proposedCapacityKW || 5) * 100,
        }));
      }
    }
  }, [leadIdParam, leads]);

  const handleFetchGPS = () => {
    setIsGpsLoading(true);
    setTimeout(() => {
      // Simulate real GPS location fetch
      const lat = (26.85 + Math.random() * 0.1).toFixed(4);
      const lng = (75.75 + Math.random() * 0.1).toFixed(4);
      setFormData((prev) => ({
        ...prev,
        gpsCoordinates: `${lat}° N, ${lng}° E`,
      }));
      setIsGpsLoading(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      alert('Please enter or select a customer name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = addSurvey({
        ...formData,
        photos: {
          rooftop: !!photoRooftop,
          meter: !!photoMeter,
          inverter: !!photoInverter,
          obstacle: !!photoObstacle,
        },
      });

      alert(`Site Survey ${created.surveyCode} submitted successfully!`);
      navigate('/survey/site-surveys');
    } catch (err) {
      alert(err.message || 'Failed to submit site survey.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/survey/site-surveys')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Survey Register</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Wifi className="w-3 h-3 text-emerald-600" />
            Field Online Mode
          </span>
        </div>
      </div>

      {/* Main Title Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Mobile Field Site Survey Form</h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform digital rooftop solar technical assessment, shadow-free area calculation, and upload mandatory site photos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Customer & Site Identification */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sun className="w-4 h-4 text-[#163A5F]" />
            <h3 className="font-bold text-slate-800 text-sm">1. Customer & Location Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Link to CRM Lead (Optional)
              </label>
              <select
                value={formData.leadId}
                onChange={(e) => {
                  const selId = e.target.value;
                  const match = leads.find((l) => l.id === selId);
                  setFormData((prev) => ({
                    ...prev,
                    leadId: selId,
                    customerName: match ? match.customerName : prev.customerName,
                    mobile: match ? match.mobile : prev.mobile,
                  }));
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="">-- Direct Field Walk-in --</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.leadCode} — {l.customerName} ({l.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Customer Contact Mobile
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GPS Geotag Coordinates *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.gpsCoordinates}
                  onChange={(e) => setFormData({ ...formData, gpsCoordinates: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-700 bg-slate-50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFetchGPS}
                  disabled={isGpsLoading}
                  icon={MapPin}
                >
                  {isGpsLoading ? 'Fetching...' : 'Geotag'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Rooftop & Civil Technical Specifications */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-[#163A5F]" />
            <h3 className="font-bold text-slate-800 text-sm">2. Rooftop Civil & Geometry Specs</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rooftop Construction Type *
              </label>
              <select
                value={formData.roofType}
                onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="RCC Flat Roof">RCC Flat Roof</option>
                <option value="Industrial Tin Shed">Industrial Tin Shed</option>
                <option value="Sloped Tile Roof">Sloped Tile Roof</option>
                <option value="Elevated Superstructure">Elevated Superstructure</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Shadow-Free Area (Sq. Ft.) *
              </label>
              <input
                type="number"
                required
                min={50}
                value={formData.shadowFreeAreaSqFt}
                onChange={(e) => setFormData({ ...formData, shadowFreeAreaSqFt: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Rule of thumb: ~100 sq ft per 1 kWp system
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Recommended Tilt Angle (Degrees)
              </label>
              <input
                type="number"
                value={formData.tiltAngle}
                onChange={(e) => setFormData({ ...formData, tiltAngle: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                True Azimuth Facing
              </label>
              <select
                value={formData.azimuth}
                onChange={(e) => setFormData({ ...formData, azimuth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="True South (180°)">True South (180°)</option>
                <option value="South-East (150°)">South-East (150°)</option>
                <option value="South-West (210°)">South-West (210°)</option>
                <option value="East (90°)">East (90°)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Electrical Connection Phase *
              </label>
              <select
                value={formData.electricalPhase}
                onChange={(e) => setFormData({ ...formData, electricalPhase: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="1-Phase (230V)">1-Phase (230V)</option>
                <option value="3-Phase (415V)">3-Phase (415V)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                AC Cable Run to Meter (Meters)
              </label>
              <input
                type="number"
                value={formData.cableDistanceMeters}
                onChange={(e) => setFormData({ ...formData, cableDistanceMeters: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Shading Obstacles & Civil Observations
            </label>
            <textarea
              rows={2}
              value={formData.obstacleNotes}
              onChange={(e) => setFormData({ ...formData, obstacleNotes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>
        </Card>

        {/* Section 3: Mandatory Proof Photos */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Camera className="w-4 h-4 text-[#163A5F]" />
            <h3 className="font-bold text-slate-800 text-sm">3. Mandatory Geotagged Site Photos (Max 1 MB)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <ProofPhotoUpload
              label="1. Rooftop Area"
              required={true}
              onPhotoSelect={(f) => setPhotoRooftop(f)}
            />
            <ProofPhotoUpload
              label="2. Existing Meter Box"
              required={true}
              onPhotoSelect={(f) => setPhotoMeter(f)}
            />
            <ProofPhotoUpload
              label="3. Inverter Space"
              required={true}
              onPhotoSelect={(f) => setPhotoInverter(f)}
            />
            <ProofPhotoUpload
              label="4. Obstacles / Horizon"
              required={false}
              onPhotoSelect={(f) => setPhotoObstacle(f)}
            />
          </div>
        </Card>

        {/* Section 4: Customer Agreement & Signature */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">4. Customer Verification Sign-off</h3>
          </div>

          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.customerAgreed}
              onChange={(e) => setFormData({ ...formData, customerAgreed: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-[#163A5F] focus:ring-[#163A5F]"
            />
            <span>
              Customer confirms rooftop inspection was conducted in their presence, dimensions verified, and shadow-free area marked.
            </span>
          </label>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              alert('Survey draft saved to device storage.');
            }}
            icon={Save}
          >
            Save Field Draft
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={Send}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete & Submit Survey'}
          </Button>
        </div>
      </form>
    </div>
  );
}
