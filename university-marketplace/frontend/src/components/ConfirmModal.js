// components/ConfirmModal.js
import React from 'react';

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <p>{message}</p>
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmModal;