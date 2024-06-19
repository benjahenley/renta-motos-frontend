'use client';

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import clsx from 'clsx';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';

interface HelpFormProps {
  className?: string;
}

export default function HelpForm({ className }: HelpFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          alert('Thank you. We will get back to you as soon as possible.');

          setForm({
            email: '',
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert('Ahh, something went wrong. Please try again.');
        }
      );
  };

  return (
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
          placeholder="Leave us your email address so we can reach you"
          className="mb-3 rounded-none border-none md:mb-0 lg:!rounded-xl"
          required
        />
        <Button
          type="submit"
          variant="solid"
          rounded="DEFAULT"
          className="right-[5px] block w-full py-4 text-sm tracking-wide md:absolute md:top-[5px] md:h-[46px] md:w-auto md:px-7 lg:!rounded-lg 3xl:h-[50px]"
        >
          {loading ? 'Sending...' : 'Contact us'}
        </Button>
      </div>
    </form>
  );
}
