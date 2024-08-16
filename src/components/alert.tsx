import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

interface AlertProps {
  show: boolean;
  data: string;
  onClose: () => void;
}

function CustomAlert({ show, onClose, data }: AlertProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <>
      {show && data !== "" && (
        <Alert
          key="warning"
          variant="warning"
          onClose={onClose}
          dismissible
          style={{ position: "fixed", right: "10px", top: "10px" }}
        >
          {data}
        </Alert>
      )}
    </>
  );
}

export default CustomAlert;
