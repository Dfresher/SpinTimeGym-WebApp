import React, { useState } from "react";
import "../App.css";

interface ModalProps {
  closeModal: () => void;
}

function Modal({ closeModal }: ModalProps) {
  const [name, setName] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log({ name, paymentDate, expirationDate, status });
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">Add New Member</h5>
          <button className="close-button" onClick={closeModal}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="paymentDate">Payment Date</label>
              <input
                type="date"
                id="paymentDate"
                className="form-control"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expirationDate">Expiration Date</label>
              <input
                type="date"
                id="expirationDate"
                className="form-control"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
