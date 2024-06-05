'use client'
import { useVendor } from '@/components/vendorContext';
import React, { useState, useContext } from 'react';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';
import Carrito from '@/components/payment/carrito';
import { vendorData } from 'public/data/listing-details';
import PaymentsPayouts from '@/components/settings/payment-payouts/payments-payouts';
import AddnewPaymentMethod from '@/components/settings/form/add-new-payment-method';


const PaymentForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const { selectedVendor } = useVendor();

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
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <PaymentsPayouts />
    //   <AddnewPaymentMethod />
      
    //   <Carrito/>
    //   <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-8 rounded shadow">
    //     <h2 className="text-xl font-semibold mb-6">Enter your payment details</h2>
    //     <Input
    //       label="Card Number"
    //       type="text"
    //       value={cardNumber}
    //       onChange={(e) => setCardNumber(e.target.value)}
    //       required
    //     />
    //     <Input
    //       label="Expiry Date (MM/YY)"
    //       type="text"
    //       value={expiryDate}
    //       onChange={(e) => setExpiryDate(e.target.value)}
    //       required
    //     />
    //     <Input
    //       label="CVV"
    //       type="text"
    //       value={cvv}
    //       onChange={(e) => setCvv(e.target.value)}
    //       required
    //     />
    //     <Input
    //       label="Name on Card"
    //       type="text"
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //       required
    //     />
    //     <Input
    //       label="Amount"
    //       type="number"
    //       value={amount}
    //       onChange={(e) => setAmount(e.target.value)}
    //       required
    //     />
    //     <Button type="submit" className="w-full mt-4">Pay Now</Button>
    //   </form>
    // </div>
  );
};

export default PaymentForm;
