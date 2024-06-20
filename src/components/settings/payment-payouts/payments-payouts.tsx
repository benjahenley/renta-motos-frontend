'use client';

import { useState } from 'react';
import { MasterCardIcon } from '@/components/icons/payment-methods/mastercard';
import { BizumIcon } from '@/components/icons/payment-methods/bizum';
import AdvancedCheckbox from '@/components/ui/form-fields/advanced-checkbox';
import { PaypalIcon } from '@/components/icons/payment-methods/paypal';
import { VisaIcon } from '@/components/icons/payment-methods/visa';
import Checkbox from '@/components/ui/form-fields/checkbox';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';

const paymentMethods = [
  // {
  //   cardType: 'visa',
  //   label: 'Visa',
  //   icon: <VisaIcon className="h-9 w-[60px] md:h-12 md:w-20" />,
  //   // default: true,
  // },
  // {
  //   cardType: 'bizum',
  //   label: 'Bizum',
  //   icon: <BizumIcon className="h-9 w-[60px] md:h-12 md:w-20" />,
  // },
  // {
  //   cardType: 'mastercard',
  //   label: 'Mastercard',
  //   icon: <MasterCardIcon className="h-9 w-[60px] md:h-12 md:w-20" />,
  // },
  // {
  //   cardType: 'paypal',
  //   label: 'PayPal',
  //   icon: <PaypalIcon className="h-9 w-[60px] md:h-12 md:w-20" />,
  // },
];

export default function PaymentsPayouts() {
  // const [state, setState] = useState(paymentMethods[0].cardType);
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        {/* {paymentMethods.map((item, index) => (
          <AdvancedCheckbox
            key={`payment-${index}`}
            name="payment-secondary"
            value="single"
            className="border-secondary-lighter card-gradient w-full rounded-xl border p-4 text-sm hover:cursor-pointer hover:border-gray-dark lg:p-6"
            inputClassName="[&:checked~span]:!border-gray-dark"
            checked={state === item.cardType ? true : false}
            onChange={() => setState(item.cardType)}
          >
            <div className="flex items-center justify-between gap-4 lg:gap-6">
              {item.icon}
              <div className="flex-grow">
                <Text tag="h6" className="mb-1">
                  {item.label}
                </Text>
                <Button
                  type="button"
                  variant="text"
                  className="!p-0 text-xs leading-5 text-gray focus:!ring-0 md:text-sm md:leading-6"
                ></Button>
              </div>
            </div>
          </AdvancedCheckbox> */}
        {/* ))} */}
      </div>
    </div>
  );
}
