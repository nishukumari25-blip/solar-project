import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Filter, Download } from 'lucide-react';
import Button from './Button';

export default function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  itemsPerPage = 10,
  rowKey = 'id',
  onRowClick,
  actions,
  filterComponent,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your search or filters.',
  showExport = false,
  onExport,
  extraHeaderActions,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = item[k];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
        });
      }
      // Default: search all string/number fields
      return Object.values(item).some(
        (val) => val !== undefined && val !== null && String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Paginate data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163A5F]/20 focus:border-[#163A5F] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {filterComponent}
          {showExport && (
            <Button
              variant="ghost"
              size="sm"
              icon={Download}
              onClick={() => {
                if (onExport) {
                  onExport(sortedData);
                } else {
                  alert(`Exporting ${sortedData.length} records to CSV (Simulated).`);
                }
              }}
            >
              Export
            </Button>
          )}
          {extraHeaderActions}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs tracking-wider uppercase">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3.5 px-4 select-none ${col.className || ''} ${
                    col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                  }`}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const key = row[rowKey] || idx;
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${
                      onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    {columns.map((col) => (
                      <td key={col.key || col.header} className={`py-3.5 px-4 ${col.className || ''}`}>
                        {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                    {actions && (
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Filter className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-slate-600 font-medium">{emptyMessage}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{emptySubtext}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Row count */}
      <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {sortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * itemsPerPage, sortedData.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{sortedData.length}</span> records
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 text-slate-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
