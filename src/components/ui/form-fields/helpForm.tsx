'use client';

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import clsx from 'clsx';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';

interface HelpFormProps {
  className?: string;
}

//qaxmP9I6esebUF3s2

//template_rxf704v

//service_hk9s4rj
export default function HelpForm({ className }: HelpFormProps) {
  return (
    <form
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className={clsx('relative', className)}
    >
      <div className="relative">
        <Input
          inputClassName="!bg-white h-[54px] md:!h-[56px] 3xl:!h-[60px] !pr-[140px]"
          labelClassName="!mb-0"
          rounded="DEFAULT"
          placeholder="Leave us your email address so we can reach you"
          className="mb-3 rounded-none border-none md:mb-0 lg:!rounded-xl"
        />
        <Button
          type="submit"
          variant="solid"
          rounded="DEFAULT"
          className="right-[5px] block w-full py-4 text-sm tracking-wide md:absolute md:top-[5px] md:h-[46px] md:w-auto md:px-7 lg:!rounded-lg 3xl:h-[50px]"
        >
          Contact us
        </Button>
      </div>
    </form>
  );
}

