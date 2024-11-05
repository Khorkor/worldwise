import { FC, MouseEvent, ReactNode } from "react";
import styles from "../Button.module.css";

interface ButtonProps {
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: string;
}

const Button: FC<ButtonProps> = ({ children, onClick, type }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles[type ? type : ""]}`}
    >
      {children}
    </button>
  );
};

export default Button;
