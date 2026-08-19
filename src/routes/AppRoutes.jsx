import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import DevicesListPage from "../features/devices/DevicesListPage";
import DeviceDetailPage from "../features/devices/DeviceDetailPage";
import PendingApprovalsPage from "../features/pendingApprovals/PendingApprovalsPage";
import LiveMapPage from "../features/map/LiveMapPage";
import SettingsPage from "../features/settings/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
               <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
            path="/devices"
            element={
                <ProtectedRoute>
                <DashboardLayout>
                    <DevicesListPage />
                </DashboardLayout>
                </ProtectedRoute>
            }
            />
            <Route
            path="/devices/:id"
            element={
                <ProtectedRoute>
                <DashboardLayout>
                    <DeviceDetailPage />
                </DashboardLayout>
                </ProtectedRoute>
            }
            />
            <Route
            path="/pending-approvals"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PendingApprovalsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LiveMapPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
    </Routes>
  );
}