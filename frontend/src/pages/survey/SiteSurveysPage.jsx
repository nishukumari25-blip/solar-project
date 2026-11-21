import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Compass, MapPin, Eye, Camera, CheckCircle2, FileText } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function SiteSurveysPage() {
  const navigate = useNavigate();
  const { surveys } = useERP();

  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const columns = [
    {
      header: 'Survey Code',
      key: 'surveyCode',
      sortable: true,
      render: (val) => <span className="font-mono font-semibold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Customer',
      key: 'customerName',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-900">{val}</span>,
    },
    {
      header: 'Roof Type',
      key: 'roofType',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {val}
        </span>
      ),
    },
    {
      header: 'Shadow-Free Area',
      key: 'shadowFreeAreaSqFt',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val} sq ft</span>,
    },
    {
      header: 'Phase & Tilt',
      key: 'electricalPhase',
      render: (val, row) => (
        <span className="text-slate-600 text-xs">
          {val} | {row.tiltAngle}° Tilt
        </span>
      ),
    },
    {
      header: 'Surveyor',
      key: 'surveyorName',
      sortable: true,
      render: (val) => <span className="text-slate-700 text-xs">{val}</span>,
    },
    {
      header: 'Date',
      key: 'surveyDate',
      sortable: true,
      render: (val) => <span className="text-slate-500 font-mono text-xs">{val}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Site Survey Register</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical feasibility records, rooftop dimensions, shadow profiling, and grid phase verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/survey/new-survey')}
          >
            Conduct New Survey
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={surveys}
        searchPlaceholder="Search surveys by code, customer, roof type..."
        searchKeys={['surveyCode', 'customerName', 'roofType', 'surveyorName']}
        onRowClick={(row) => setSelectedSurvey(row)}
        showExport={true}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="xs"
              icon={Eye}
              onClick={() => setSelectedSurvey(row)}
            >
              Details
            </Button>
            <Button
              variant="teal"
              size="xs"
              icon={FileText}
              onClick={() => navigate(`/sales/new-quote?surveyId=${row.id}`)}
            >
              Create Quote
            </Button>
          </div>
        )}
      />

      {/* Survey Details Modal */}
      {selectedSurvey && (
        <Modal
          isOpen={!!selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          title={`Site Survey Report: ${selectedSurvey.surveyCode}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <p className="font-bold text-slate-800 text-sm">{selectedSurvey.customerName}</p>
                <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  GPS: {selectedSurvey.gpsCoordinates}
                </p>
              </div>
              <StatusBadge status={selectedSurvey.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Rooftop Type</span>
                <span className="font-semibold text-slate-800">{selectedSurvey.roofType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Shadow-Free Area</span>
                <span className="font-semibold text-slate-800">{selectedSurvey.shadowFreeAreaSqFt} sq ft</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tilt & Azimuth</span>
                <span className="font-semibold text-slate-800">{selectedSurvey.tiltAngle}° / {selectedSurvey.azimuth}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Electrical Phase</span>
                <span className="font-semibold text-slate-800">{selectedSurvey.electricalPhase}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Cable Run to Meter</span>
                <span className="font-semibold text-slate-800">{selectedSurvey.cableDistanceMeters} meters</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Surveyor</span>
                <span className="font-semibold text-slate-800">{selectedSurvey.surveyorName}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Obstacles & Shading Notes</span>
              <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-600">
                {selectedSurvey.obstacleNotes || 'No shading obstructions observed.'}
              </p>
            </div>

            {/* Photo verification tags */}
            <div>
              <span className="font-semibold text-slate-700 block mb-2">Mandatory Verification Photos (Attached)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center">
                  <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-medium text-slate-700">Rooftop Area</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Verified</span>
                </div>
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center">
                  <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-medium text-slate-700">Meter Box</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Verified</span>
                </div>
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center">
                  <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-medium text-slate-700">Inverter Space</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Verified</span>
                </div>
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center">
                  <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-medium text-slate-700">Obstacles</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Verified</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSurvey(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const s = selectedSurvey;
                  setSelectedSurvey(null);
                  navigate(`/sales/new-quote?surveyId=${s.id}`);
                }}
              >
                Proceed to Quotation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
