'use client';

import Image from 'next/image';
import HelpForm from '@/components/ui/form-fields/helpForm';
import Text from '@/components/ui/typography/text';
import React, { useRef, useState } from "react";


export default function ComingSoon() {

  // const formRef = useRef();
  // const [form, setForm] = useState({
  //   name: "",
  //   email: "",
  //   message: "",
  // });

  // const [loading, setLoading] = useState(false);

  // const handleChange = (e) => {
  //   const { target } = e;
  //   const { name, value } = target;

  //   setForm({
  //     ...form,
  //     [name]: value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   emailjs
  //     .send(
  //       import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
  //       import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
  //       {
  //         from_name: form.name,
  //         to_name: "JavaScript Mastery",
  //         from_email: form.email,
  //         to_email: "sujata@jsmastery.pro",
  //         message: form.message,
  //       },
  //       import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
  //     )
  //     .then(
  //       () => {
  //         setLoading(false);
  //         alert("Thank you. I will get back to you as soon as possible.");

  //         setForm({
  //           name: "",
  //           email: "",
  //           message: "",
  //         });
  //       },
  //       (error) => {
  //         setLoading(false);
  //         console.error(error);

  //         alert("Ahh, something went wrong. Please try again.");
  //       }
  //     );
  // };



  return (
    <div className="fixed inset-0 grid grid-cols-1 items-center justify-center md:grid-cols-2">
      <div className="px-4 sm:px-6 2xl:px-7 3xl:px-8 4xl:px-16">
        <Text tag="h2" className="text-xl">
          If you have any question, contact us.
        </Text>
        <Text className="mt-4 md:mt-6">
          In the meantime. Stay with us
        </Text>
        <div className="mt-10 md:mt-16">
          <HelpForm className="w-full max-w-lg" />
        </div>
      </div>
      <div className="relative hidden h-full w-full md:block">
        <Image
          src="/images/coming-soon.png"
          alt="coming soon"
          fill
          className="bg-gray-lighter object-cover"
        />
      </div>
    </div>
  );
}
