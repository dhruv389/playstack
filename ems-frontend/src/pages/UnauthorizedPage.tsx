import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-500/10 text-danger-500">
        <ShieldAlert size={24} />
      </div>
      <h1 className="font-display text-2xl font-semibold text-primary">Access restricted</h1>
      <p className="max-w-sm text-sm text-secondary">
        Your role doesn't have permission to view this page. Reach out to your Super Admin if you think this is a mistake.
      </p>
      <Link to="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
