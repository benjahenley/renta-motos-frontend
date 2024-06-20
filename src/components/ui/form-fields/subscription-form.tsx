'use client';

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import clsx from 'clsx';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';
import ActionAlerts from '@/components/ui/alerts/alerts'; // Ajusta la ruta según sea necesario

interface SubscriptionFormProps {
  className?: string;
}

export default function SubscriptionForm({ className }: SubscriptionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    if (!form.email) {
      setAlert({ type: 'error', message: 'Email is required.' });
      return;
    }

    if (!validateEmail(form.email)) {
      setAlert({ type: 'error', message: 'Invalid email format.' });
      return;
    }

    setLoading(true);

    emailjs
      .send(
        'service_8tn864h', // Tu ID de servicio de EmailJS
        'template_rxf704v', // Tu ID de template de EmailJS
        {
          email: form.email,
        },
        'qaxmP9I6esebUF3s2' // Tu clave pública de EmailJS
      )
      .then(
        () => {
          setLoading(false);
          setAlert({ type: 'success', message: 'Thank you. We will get back to you as soon as possible.' });
          setForm({
            email: '',
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setAlert({ type: 'error', message: 'Ahh, something went wrong. Please try again.' });
        }
      );
  };

  return (
    <>
      {alert && (
        <div style={{ position: 'fixed', top: '7rem', left: '50%', transform: 'translateX(-50%)', width: '20rem', zIndex: 1000 }}>
          <ActionAlerts
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className={clsx('relative', className)}
      >
        <div className="relative">
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            inputClassName="!bg-white h-[54px] md:!h-[56px] 3xl:!h-[60px] !pr-[140px]"
            labelClassName="!mb-0"
            rounded="DEFAULT"
            placeholder="Your email"
            className="mb-3 rounded-none border-none md:mb-0 lg:!rounded-xl"
            required
          />
          <Button
            type="submit"
            variant="solid"
            rounded="DEFAULT"
            className="right-[5px] block w-full py-4 text-sm tracking-wide md:absolute md:top-[5px] md:h-[46px] md:w-auto md:px-7 lg:!rounded-lg 3xl:h-[50px]"
          >
            {loading ? 'Sending...' : 'Subscribe'}
          </Button>
        </div>
      </form>
    </>
  );
}
