import { useDevices } from "../../hooks/useDevices";
import DeviceFilters from "./components/DeviceFilters";
import DeviceTable from "./components/DeviceTable";
import { useSearchParams } from "react-router-dom";
import { SkeletonTable } from "../../components/ui/Skeleton";
import EmptyState from "../../components/shared/EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DevicesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const compliance = searchParams.get("compliance") || "";

  const { data, isLoading, isError } = useDevices({ page, limit: 10, search, compliance });

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleSearchSubmit = (searchTerm) => {
    updateFilters({ search: searchTerm, page: "1" });
  };

  const handleComplianceChange = (val) => {
    updateFilters({ compliance: val, page: "1" });
  };

  const handleClear = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    updateFilters({ page: String(newPage) });
  };

  if (isError) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
        Failed to load devices. Please check your backend connection.
      </div>
    );
  }

  const devices = data?.devices || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, totalCount: 0 };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Devices</h1>
        <p className="text-sm text-slate-500">Manage enrolled mobile hardware and policy statuses</p>
      </div>

      {/* Filter Toolbar */}
      <DeviceFilters
        search={search}
        onSearchSubmit={handleSearchSubmit}
        compliance={compliance}
        setCompliance={handleComplianceChange}
        onClear={handleClear}
      />

      {/* Main Table / Skeleton / Empty State Switcher */}
      {isLoading ? (
        <SkeletonTable rows={6} cols={4} />
      ) : devices.length === 0 ? (
        <EmptyState
          title="No devices found"
          description={search || compliance ? "No devices match your selected filters." : "No registered devices enrolled yet."}
          icon="📱"
        />
      ) : (
        <>
          <DeviceTable devices={devices} />

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>
              Showing Page <strong className="text-slate-800">{pagination.page}</strong> of{" "}
              <strong className="text-slate-800">{pagination.totalPages || 1}</strong> ({pagination.totalCount} total devices)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition shadow-2xs"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition shadow-2xs"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}