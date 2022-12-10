import React from "react";

export const Modal = ({ children, title = "", display = false, onClose }) => {
    const handleClose = (event) => {
        onClose();
    };
    return (
        display && (
            <div className="modal-background" onClick={handleClose}>
                <div
                    className="modal-container"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <div className="modal-header">
                        <div className="modal-title">{title}</div>
                        <span
                            className="material-symbols-outlined comment icon outlined"
                            alt="Close"
                            onClick={handleClose}
                        >
                            close
                        </span>
                    </div>
                    <div className="modal-content">{children}</div>
                </div>
            </div>
        )
    );
};
