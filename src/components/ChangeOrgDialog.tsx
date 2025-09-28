import React, { useState } from 'react';
import { useOrg } from '@/contexts/OrgContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';

type Props = {
  asLink?: boolean;
};

export const ChangeOrgDialog: React.FC<Props> = ({ asLink }) => {
  const { organizationName, setOrganizationName } = useOrg();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(organizationName);

  const onSave = () => {
    setOrganizationName(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {asLink ? (
          <Button variant="link" className="px-0 h-auto text-xs opacity-60 hover:opacity-100">Change organisation name</Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Change organisation name"
            className="opacity-50 hover:opacity-100 transition-opacity ml-1"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Change organisation name</DialogTitle>
          <DialogDescription>Set the name shown across the workspace.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Organisation name" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeOrgDialog;


