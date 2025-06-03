'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { FBIcon } from '@/components/icons/fb-icon';
import { InstaIcon } from '@/components/icons/instagram-icon';
import { WhatsappIcon } from '@/components/icons/whatsapp-icon';
import { TelegramIcon } from '@/components/icons/telegram-icon';
import { TwitterOutlineIcon } from '@/components/icons/twitter-outline-icon';
import { EmailIcon } from '@/components/icons/email-icon';

const list = [
  {
    icon: <FBIcon className="h-6 w-6" />,
    path: 'https://www.facebook.com/ibijetrent?mibextid=LQQJ4d',
    color: '#2DA3DE',
    name: 'Facebook',
  },
  {
    icon: <InstaIcon className="h-6 w-6" />,
    path: 'https://www.instagram.com/ibijetrent/',
    color: '#6A0AB5',
    name: 'Instagram',
  },
  {
    icon: <WhatsappIcon className="h-6 w-6" />,
    path: 'https://wa.me/34642973276',
    color: '#03B603',
    name: 'Whatsapp',
  },
//   {
//     icon: <TelegramIcon className="h-6 w-6" />,
//     path: 'https://wa.me/34612498228',
//     color: '#2DA3DE',
//     name: 'Telegram',
//   },
//   {
//     icon: <TwitterOutlineIcon className="h-6 w-6" />,
//     path: 'https://twitter.com',
//     color: '#1DA1F2',
//     name: 'Twitter',
//   },
  // {
  //   icon: <EmailIcon className="h-6 w-6" />,
  //   path: 'mailto:Ibijetren2024@gmail.com',
  //   color: '#B9422A',
  //   name: 'Email',
  // },
];

export default function ControlledOpenSpeedDial() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box className='hidden xl:block' sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 32, 
          '& .MuiFab-primary': {
            backgroundColor: '#03B603',
            color: 'white',
            '&:hover': {
              backgroundColor: '#03B603',
            },
          },
        }}
        icon={<WhatsappIcon className="h-8 w-8" />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {list.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={
              <Box
                component="a"
                href={action.path}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}
              >
                {action.icon}
              </Box>
            }
            tooltipTitle={action.name}
            onClick={handleClose}
            sx={{
              backgroundColor: action.color,
              color: 'white',
              '&:hover': {
                backgroundColor: action.color,
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
