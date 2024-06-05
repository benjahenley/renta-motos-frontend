'use-client'



const list = [
  {
    title: 'Weekly discount?',
    money: 117,
    type: 'discount',
  },
  {
    title: 'Cleaning fee',
    money: 52,
    type: 'cleanfee',
  },
  {
    title: 'Service fee',
    money: 65,
    type: 'servicefee',
  },
];


export default function Carrito() {
  return (
    <form className='rounded-xl border border-gray-lighter bg-white p-8 shadow-card'>
      <div className="grid grid-cols-1 gap-8 lg:gap-12">
  <ul className="mt-3 xl:mt-5">
    <li className="flex items-center justify-between py-1.5 text-base capitalize text-gray-dark first:pt-0">
      <span className="font-normal"> 500 Rent Time</span>
      <span className="font-bold">$600</span>
    </li> 
    {list.map((item) => (
      <li
        key={item.title}
        className="flex items-center justify-between py-1.5 text-base capitalize text-gray-dark first:pt-0 last:border-t last:border-gray-lighter last:pb-0"
      >
        <span className="font-normal">{item.title}</span>
        {item.type === 'discount' ? (
          <span className="font-bold text-red">-${item.money}</span>
        ) : (
          <span className="font-bold">${item.money}</span>
        )}
      </li>
    ))}
  </ul>
</div></form>
    
  );}