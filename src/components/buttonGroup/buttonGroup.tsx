import React from "react";

export interface ButtonInfo {
  id: string;
  name: string;
  value: string | number;
}

interface ButtonProps {
  buttonInfos: ButtonInfo[];
  onClick: (value: string | number) => void;
}

const ButtonGroup = ({ buttonInfos, onClick }: ButtonProps) => {
  return (
    <>
      {buttonInfos.map((item) => (
        <button id={item.id} onClick={() => onClick(item.value)}>
          {item.name}
        </button>
      ))}
    </>
  );
};

export default ButtonGroup;
