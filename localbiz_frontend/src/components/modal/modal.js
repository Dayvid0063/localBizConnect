// Modal.js
import React from "react";

const Modal = ({ onClose, content }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Modal;
