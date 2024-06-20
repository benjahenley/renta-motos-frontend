'use client';

import Button from '@/components/ui/button';
import { updateJetskiStatus } from '@/helpers/get-jetskis/patchJetski';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Jetski = {
  id: string;
  name: string;
  available: boolean;
};

type Props = {
  jetski: any;
};

export const JetskiItem = ({ jetski }: Props) => {
  const [available, setAvailable] = useState<boolean>(jetski.available);
  const router = useRouter();
  const [errMsg, setErrMsg] = useState('');
  const [err, setErr] = useState(false);

  useEffect(() => {
    setAvailable(jetski.available);
  }, [jetski.available]);

  const handleClick = async () => {
    // const res = await updateJetskiStatus(jetski.id);

    // if (!res) {
    //   setErr(true);
    //   setErrMsg('No se pudo actualizar');
    // }

    // console.log(res);
    // return router.refresh();
    router.push('/');
    window.location.reload();
  };

  return (
    <tr className="tr2">
      {/* {err && <p>{errMsg}</p>} */}
      <td className="td2 px-4 py-2">{jetski.name}</td>
      <td className="td2 px-4 py-2">
        {available ? 'available' : 'maintenance'}
      </td>
      <td className="td2 px-4 py-2">
        <Button onClick={handleClick}>
          {available ? 'Disable for Maintenance' : 'Enable for Rental'}
        </Button>
      </td>
    </tr>
  );
};
