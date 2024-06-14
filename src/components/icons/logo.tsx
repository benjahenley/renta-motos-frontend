import React from 'react';
import clsx from 'clsx';

export const LogoIcon: React.FC<React.ImgHTMLAttributes<{}>> = (props) => {
  return (
    <img
      src="/images/logo.png"
      alt="Logo"
      {...props}
      className={clsx(props.className)} // Asegúrate de que las clases se pasen correctamente
    />
  );
};
