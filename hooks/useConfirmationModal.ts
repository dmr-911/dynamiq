// hooks/useConfirmationModal.ts
'use client';
import { useState, useCallback, ReactNode } from 'react';

type OnConfirmCallback = () => void;

export interface ConfirmationModalHook {
  showConfirmationModal: ({
    onConfirm,
    message
  }: {
    onConfirm: OnConfirmCallback;
    message: string;
  }) => void;
  confirmAction: () => void;
  closeModal: () => void;
  showModal: boolean;
  message: ReactNode | null | string;
}

const useConfirmationModal = (): ConfirmationModalHook => {
  const [showModal, setShowModal] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<OnConfirmCallback | null>(null);
  const [message, setMessage] = useState<ReactNode | null>(null);

  const showConfirmationModal = useCallback(
    ({ onConfirm, message }: { onConfirm: OnConfirmCallback; message: string }) => {
      setMessage(message);
      setOnConfirmCallback(() => onConfirm);
      setShowModal(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setOnConfirmCallback(null);
    setMessage(null);
  }, []);

  const confirmAction = useCallback(() => {
    if (onConfirmCallback && typeof onConfirmCallback === 'function') {
      onConfirmCallback();
    }
    closeModal();
  }, [onConfirmCallback, closeModal]);

  return {
    showConfirmationModal,
    confirmAction,
    closeModal,
    showModal,
    message
  };
};

export default useConfirmationModal;
