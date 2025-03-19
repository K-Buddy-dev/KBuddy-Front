import { useState } from 'react';
import { CheckedIcon, ImageNonSelect } from '../icon';

interface AlbumItemProps {
  img: string;
}

export function AlbumItem(props: AlbumItemProps) {
  const { img } = props;
  const [isSelect, setIsSelect] = useState<boolean>();

  const handleClick = () => {
    setIsSelect((prev) => !prev);
  };

  return (
    <div className="relative aspect-square rounded-[4px] overflow-hidden cursor-pointer" onClick={handleClick}>
      <div className="absolute top-[1px] right-[1px]">{isSelect ? <CheckedIcon /> : <ImageNonSelect />}</div>
      <img src={img} alt={`album-${img}`} className="w-full h-full object-cover" />
    </div>
  );
}
