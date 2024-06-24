'use client';

import Button from '@/components/ui/button';
import { getToken } from '@/helpers/getToken';
import { updateJetskiStatus } from '@/helpers/jetskis/updateJetski';
import { Jetski } from '@/interfaces/jetski';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Props = {
  jetski: Jetski;
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
    const token = getToken();
    const res = await updateJetskiStatus(jetski.id, token);
    setAvailable(!available);

    if (!res) {
      setErr(true);
      setErrMsg('No se pudo actualizar');
    }

    console.log(res);
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
