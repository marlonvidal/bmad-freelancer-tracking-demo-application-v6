import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddColumnDialog({ open, onOpenChange }: AddColumnDialogProps) {
  const { addColumn, columns } = useApp();
  const [columnName, setColumnName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setError('');
    
    if (!columnName.trim()) {
      setError('Column name is required');
      return;
    }

    if (columnName.trim().length > 255) {
      setError('Column name must be 255 characters or less');
      return;
    }

    try {
      setIsLoading(true);
      const order = Math.max(...columns.map(c => c.order || 0), -1) + 1;
      await addColumn({
        name: columnName.trim(),
        order,
      });
      setColumnName('');
      onOpenChange(false);
    } catch (err: any) {
      console.error('Failed to add column:', err);
      setError(err.message || 'Failed to add column');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Input
            placeholder="Column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                handleAdd();
              }
              if (e.key === 'Escape') {
                onOpenChange(false);
              }
            }}
            maxLength={255}
            aria-label="Column name"
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setColumnName('');
              setError('');
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isLoading || !columnName.trim()}>
            {isLoading ? 'Adding...' : 'Add Column'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
