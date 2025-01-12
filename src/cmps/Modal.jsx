/* eslint-disable react/prop-types */

export function Modal({ show, onClose, children }) {
  if (!show) return null; // Don't render the modal if not visible

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}
