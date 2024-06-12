import React from 'react';

export const LogoIcon: React.FC<React.ImgHTMLAttributes<{}>> = (props) => {
  return (
    <img
      src="/images/logo.png"
      alt="Logo"
      {...props}
      style={{

        ...props.style, // Si quieres permitir el estilo personalizado
      }}
    />
  );
};
