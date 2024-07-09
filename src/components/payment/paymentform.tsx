'use client';

import { useVendor } from '@/components/vendorContext';
import React, { useState, useContext } from 'react';

import PaymentsPayouts from '@/components/settings/payment-payouts/payments-payouts';
import AddnewPaymentMethod from '@/components/settings/form/add-new-payment-method';

const PaymentForm: React.FC = () => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para manejar el pago, por ejemplo, llamar a una API de pago
    alert(`Payment of $${amount} submitted!`);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:gap-12">
      <PaymentsPayouts />
      <AddnewPaymentMethod />
    </div>
  );
};

export default PaymentForm;
