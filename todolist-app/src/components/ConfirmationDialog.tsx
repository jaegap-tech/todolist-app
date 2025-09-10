import React, { useEffect, useRef } from 'react';

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      } else if (event.key === 'Tab' || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        if (event.shiftKey || event.key === 'ArrowLeft') {
          if (document.activeElement === confirmButtonRef.current) {
            cancelButtonRef.current?.focus();
          } else {
            confirmButtonRef.current?.focus();
          }
        } else { // Tab or ArrowRight
          if (document.activeElement === cancelButtonRef.current) {
            confirmButtonRef.current?.focus();
          } else {
            cancelButtonRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center min-w-[300px] max-w-md mx-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-message"
      >
        <p id="dialog-message" className="mb-6 text-lg text-gray-800 dark:text-gray-100">
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            aria-label="Confirm deletion"
            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Confirm
          </button>
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            aria-label="Cancel deletion"
            className="px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
