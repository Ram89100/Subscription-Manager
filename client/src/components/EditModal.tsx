import React, { useState, useEffect } from 'react';
import { type Subscription } from '../services/api';

interface EditModalProps {
  subscription: Subscription; 
  onClose: () => void; 
  onSave: (updatedSub: Subscription) => void; 
}

export const EditModal: React.FC<EditModalProps> = ({ subscription, onClose, onSave }) => {

  const [formData, setFormData] = useState(subscription);

 
  useEffect(() => {
    setFormData(subscription);
  }, [subscription]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      price: parseFloat(formData.price.toString()),
    };
    onSave(dataToSave);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Subscription: {formData.service.name}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <label> Renewal Date:
          <input
            type="date"
            name="renewal_date"
            value={new Date(formData.renewal_date).toISOString().split('T')[0]}
            onChange={handleChange}
          />
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn-edit">Save</button>
            <button type="button" onClick={onClose} className="btn-delete">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
