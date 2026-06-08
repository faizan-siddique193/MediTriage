import { Navigate } from "react-router-dom";

/** Settings UI removed — redirect to report history. */
export default function Settings() {
  return <Navigate to="/reports" replace />;
}
