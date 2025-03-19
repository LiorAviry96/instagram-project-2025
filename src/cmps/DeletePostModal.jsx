/* eslint-disable react/prop-types */

export function DeletePostModal({ onClose, onRemoveStory }) {
  return (
    <div className="" onClick={(e) => e.stopPropagation()}>
      <div className="">
        <button className="modal-option remove" onClick={onRemoveStory}>
          Remove Image
        </button>
        <button className="modal-option cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
