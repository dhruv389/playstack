import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navigate to={`/employees/${user.employeeRecordId}`} replace />;
}
