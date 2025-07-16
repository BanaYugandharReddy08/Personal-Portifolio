import React from 'react';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  contentClassName = '',
  closeButtonClassName = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${className}`.trim()} onClick={onClose}>
      <div
        className={`modal-content ${contentClassName}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={`close-button ${closeButtonClassName}`.trim()}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
