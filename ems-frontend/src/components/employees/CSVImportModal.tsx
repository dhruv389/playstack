import { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { parseCSV, downloadCSVTemplate, type CSVRow } from '../../utils/csv';
import { useEmployees } from '../../context/EmployeeContext';
import toast from 'react-hot-toast';

export function CSVImportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { bulkImport } = useEmployees();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      toast.error('Please upload a .csv file');
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const rows: CSVRow[] = await parseCSV(file);
      const mapped = rows.map((r) => ({
        name: r.name,
        email: r.email,
        phone: r.phone,
        department: r.department,
        designation: r.designation,
        salary: Number(r.salary) || 0,
        joiningDate: r.joiningDate,
        status: r.status === 'Inactive' ? ('Inactive' as const) : ('Active' as const),
      }));
      const { imported, skipped } = await bulkImport(mapped);
      setResult({ imported, skipped });
      if (imported > 0) toast.success(`Imported ${imported} employee${imported > 1 ? 's' : ''}`);
    } catch {
      toast.error('Could not parse that CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import employees from CSV" description="Bulk add employees using a spreadsheet">
      <div className="flex flex-col gap-4">
        <button
          onClick={downloadCSVTemplate}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-default py-2.5 text-xs font-medium text-secondary hover:bg-surface-2"
        >
          <Download size={14} /> Download CSV template
        </button>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? 'border-accent-500 bg-accent-500/5' : 'border-default hover:bg-surface-2'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <>
              <FileSpreadsheet size={28} className="text-accent-500" />
              <p className="text-sm font-medium text-primary">{file.name}</p>
              <p className="text-xs text-tertiary">{(file.size / 1024).toFixed(1)} KB — click to replace</p>
            </>
          ) : (
            <>
              <UploadCloud size={28} className="text-tertiary" />
              <p className="text-sm font-medium text-primary">Drop your CSV here, or click to browse</p>
              <p className="text-xs text-tertiary">Columns: name, email, phone, department, designation, salary, joiningDate, status</p>
            </>
          )}
        </div>

        {result && (
          <div className="flex flex-col gap-2 rounded-xl border border-subtle bg-surface-2 p-3.5">
            <div className="flex items-center gap-2 text-sm text-success-500">
              <CheckCircle2 size={16} /> {result.imported} imported successfully
            </div>
            {result.skipped > 0 && (
              <div className="flex items-center gap-2 text-sm text-warning-600">
                <AlertCircle size={16} /> {result.skipped} skipped (duplicate email or missing fields)
              </div>
            )}
          </div>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            {result ? 'Done' : 'Cancel'}
          </Button>
          {!result && (
            <Button onClick={handleImport} disabled={!file} isLoading={isProcessing}>
              Import employees
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
