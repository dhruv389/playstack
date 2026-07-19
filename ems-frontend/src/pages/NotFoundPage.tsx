import { Link } from 'react-router-dom';
import { Orbit } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-500">
        <Orbit size={24} />
      </div>
      <h1 className="font-display text-5xl font-semibold text-primary">404</h1>
      <p className="max-w-sm text-sm text-secondary">
        This page has drifted out of orbit. Let's get you back on track.
      </p>
      <Link to="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
