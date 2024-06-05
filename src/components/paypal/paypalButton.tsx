import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface PaypalButtonInterface {
    totalValue: string
    invoice: string
}

const PaypalButton : React.FC<PaypalButtonInterface> = (props) => {
    return (
    
          <PayPalButtons
          createOrder={(data, actions) => {
              return actions.order.create({
                  intent: "CAPTURE", // Asegúrate de incluir 'intent' aquí
                  purchase_units: [
                      {
                          description: props.invoice,
                          amount: {
                              currency_code: 'USD', // Ajusta la moneda según sea necesario
                              value: props.totalValue
                          }
                          
                      },
                  ],
              });
          }}
          onApprove={async (data, actions)=>{
              const order = await actions.order?.capture()
              console.log('order', order)
          }}/>


       
    )
}

export default PaypalButton;