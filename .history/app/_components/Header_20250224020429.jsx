import React from 'react';
import Image from 'next/image';

function Header() {
  return (
    <div className='flex justify-between p-3 shadow-md'>
      <Image src={'/Zora.png'} width={150} height={100} />
    </div>
  );
}

export default Header;