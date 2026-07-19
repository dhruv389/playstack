import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  tone = 'danger',
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: 'danger' | 'primary';
  isLoading?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center text-center gap-3 -mt-2">
        <div
          className={
            tone === 'danger'
              ? 'flex h-12 w-12 items-center justify-center rounded-full bg-danger-500/10 text-danger-500'
              : 'flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 text-accent-500'
          }
        >
          <AlertTriangle size={22} />
        </div>
        <h3 className="font-display text-base font-semibold text-primary">{title}</h3>
        <p className="text-sm text-secondary">{description}</p>
        <div className="mt-3 flex w-full gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
