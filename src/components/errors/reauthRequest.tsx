import React from 'react';
import Button from '@/components/ui/button';
import { useModal } from '@/components/modals/context';
import useAuth from '@/hooks/use-auth';
import NotFoundError from './not-found-error';


const ReauthRequest = () => {
  const {  unauthorize } = useAuth();
  const { openModal } = useModal();

  const handleReauth = () => {
    unauthorize()
  };

  return (
    <>
      {/* <NotFoundError/> */}
    <div className="mt-40 z-50 flex flex-col items-center  justify-center h-full">
      <p>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>
      <Button onClick={handleReauth} className="mt-4">
        Volver a iniciar sesión
      </Button>
    </div></>
  );
};

export default ReauthRequest;
