import { getAllReservations } from "@/api/reservations/getAllReservations";

export async function reservationData(){
  const reservations =  await getAllReservations();
  return reservations
} 


    // {
    //   id: '1045',
    //   // key: '1045',
    //   date: 'Sun Mar 24 2023',
    //   status: 'Received',
    //   customer: {
    //     name: 'Lian Travis',
    //     avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    //   },
    //   jetskiId: 'Wireframing kit for Figma',
    //   startTime: "10:00",
    //   endTime: "12:00",
    //   checked: false,
    // },
  


export const recentActivityData = [
    {
      key: '1045',
      date: new Date().toDateString(),
      status: 'Received',
      customer: {
        name: 'Molly Sanders',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      purchased: 'Wireframing kit for Figma',
      revenue: '$248.99',
    },
    {
      key: '1046',
      date: new Date().toDateString(),
      status: 'Received',
      customer: {
        name: 'Evan You',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      purchased: 'Matering the Grid',
      revenue: '$158.99',
    },
    {
      key: '1047',
      date: new Date().toDateString(),
      status: 'Refund',
      customer: {
        name: 'Lee Robinson',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      purchased: 'Wireframing kit for Figma',
      revenue: '$99.99',
    },
    {
      key: '1048',
      date: new Date().toDateString(),
      status: 'Received',
      customer: {
        name: 'Guest Look',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      purchased: 'Wireframing kit for Figma',
      revenue: '$102.99',
    },
    {
      key: '1049',
      date: new Date().toDateString(),
      status: 'Refund',
      customer: {
        name: 'Aydan Axel',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      purchased: 'Matering the Grid',
      revenue: '$248.99',
    },
    {
      key: '1050',
      date: new Date().toDateString(),
      status: 'Pending',
      customer: {
        name: 'Tel Alea',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      purchased: 'Wireframing kit for Figma',
      revenue: '$248.99',
    },
    {
      key: '1051',
      date: new Date().toDateString(),
      status: 'Received',
      customer: {
        name: 'Huge Jacklyn',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      purchased: 'Matering the Grid',
      revenue: '$116.99',
    },
    {
      key: '1052',
      date: new Date().toDateString(),
      status: 'Pending',
      customer: {
        name: 'Tom Shelby',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
      purchased: 'Wireframing kit for Figma',
      revenue: '$58.99',
    },
    {
      key: '1053',
      date: new Date().toDateString(),
      status: 'Received',
      customer: {
        name: 'Michael Jackson',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
      purchased: 'Matering the Grid',
      revenue: '$157.99',
    },
    {
      key: '1054',
      date: new Date().toDateString(),
      status: 'Received',
      customer: {
        name: 'Big Show',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
      },
      purchased: 'Wireframing kit for Figma',
      revenue: '$229.99',
    },
  ];