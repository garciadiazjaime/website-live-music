import React, { forwardRef, ReactNode, ForwardRefRenderFunction } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = forwardRef<HTMLDialogElement, ModalProps>(({ children, onClose }, ref) => {
  return (
    <dialog ref={ref} className=" relativeflex flex-col text-center p-10 w-2/3 lg:1/2 backdrop:backdrop-blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <button className="absolute top-0 right-0 text-xl w-10 h-10 bg-rose-600 hover:bg-sky-300 text-white" onClick={onClose}>&times;</button>
      {children}
    </dialog>
  );
});

Modal.displayName = 'Modal';

export default Modal;
