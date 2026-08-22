import { useEffect, useState } from "react";
import { Search, X, Filter } from "lucide-react";

export default function DeviceFilters({
  search,
  onSearchSubmit,
  compliance,
  setCompliance,
  onClear,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(localSearch);
  };

  const hasActiveFilters = Boolean(search || compliance);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        {/* Search Input Box */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or device..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-xs shrink-0"
        >
          Search
        </button>

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={compliance}
            onChange={(e) => setCompliance(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
          >
            <option value="">All Compliance Statuses</option>
            <option value="compliant">Compliant Only</option>
            <option value="non-compliant">Non-Compliant Only</option>
          </select>
          <Filter size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg transition shrink-0"
        >
          <X size={14} />
          Clear Filters
        </button>
      )}
    </form>
  );
}