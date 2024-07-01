type OrderProps = {
  price: number;
  adults: number;
};

type Props = {
  order: OrderProps;
};

export default function Carrito({ order }: Props) {
  return (
    <form className="rounded-xl border border-gray-lighter bg-white p-8 shadow-card">
      <h1 className="cartitle">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:gap-12">
        <ul className="mt-3 xl:mt-5">
          <li className="flex items-center justify-between py-1.5 text-base capitalize text-gray-dark first:pt-0">
            <span className="font-normal">
              {order.adults} Reservation{order.adults > 1 && 's'}
            </span>
            <span className="font-bold">€ {order.price}</span>
          </li>
          <li className="flex items-center justify-between py-1.5 text-base capitalize text-gray-dark first:pt-0">
            <span className="font-normal"> 30% Reservation fee **</span>
            <span className="font-bold">€ {order.price * 0.3}</span>
          </li>

          <li className="flex items-center justify-between py-1.5 text-base capitalize text-gray-dark first:pt-0 last:border-t last:border-gray-lighter last:pb-0">
            <span className="font-normal">total</span>

            <span className="font-bold">€ {order.price * 0.3}</span>
          </li>
        </ul>
      </div>
    </form>
  );
}
