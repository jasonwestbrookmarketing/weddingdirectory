"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueId: string;
}

export default function LeadFormModal({
  isOpen,
  onClose,
}: LeadFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Get Pricing & Check Availability"
    >
      <p className="text-stone-500 mb-6">Lead form coming soon.</p>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
}
