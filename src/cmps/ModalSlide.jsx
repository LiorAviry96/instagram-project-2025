/* eslint-disable react/prop-types */

export function ModalSlide({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="" onClick={onClose}>
      <div className="" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
