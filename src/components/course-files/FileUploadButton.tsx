import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { FileUploadModal } from './FileUploadModal';

interface FileUploadButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  variant = 'default',
  size = 'default',
  className,
  children
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowModal(true)}
      >
        <Upload className="h-4 w-4 ml-2" />
        {children || 'رفع ملف'}
      </Button>

      <FileUploadModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};