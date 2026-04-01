import { useState, useEffect } from 'react';
import { getSubscriptions, deleteSubscription, updateSubscription, type Subscription } from '../services/api';
import { SubscriptionForm } from '../components/SubscriptionForm';
import { SubscriptionList } from '../components/SubscriptionList';
import { EditModal } from '../components/EditModal';
import { Dashboard } from '../components/Dashboard';
import '../App.css';

function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null); 

  const fetchSubscriptions = async () => {
    try {
      const subs = await getSubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

 
  useEffect(() => {
    fetchSubscriptions();
  }, []);


  const handleDelete = async (id: number) => {
    try {
      await deleteSubscription(id);
    
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };


  const handleSaveEdit = async (updatedSub: Subscription) => {
    try {
      await updateSubscription(updatedSub.id, { ...updatedSub, price: String(updatedSub.price) });
      setEditingSubscription(null); 
      fetchSubscriptions(); 
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  return (
    <>
      <h1>Subscription Manager</h1>
      <div className="card">
        <SubscriptionForm onSubscriptionAdded={fetchSubscriptions} />
      </div>
      <div className="card">
        <SubscriptionList
          subscriptions={subscriptions}
          onDelete={handleDelete}
          onEdit={setEditingSubscription}
        />
      </div>

    
      <div className="card dashboard-card">
        <Dashboard subscriptions={subscriptions} />
      </div>

      {editingSubscription && (
        <EditModal
          subscription={editingSubscription}
          onClose={() => setEditingSubscription(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}

export default DashboardPage;
