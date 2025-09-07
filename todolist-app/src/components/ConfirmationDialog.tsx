import React from 'react';
import styled from 'styled-components';

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const DialogContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 300px;
`;

const Message = styled.p`
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease;

  &.confirm {
    background-color: #dc3545; /* Red for danger */
    color: white;
    &:hover {
      background-color: #c82333;
    }
  }

  &.cancel {
    background-color: #6c757d; /* Gray for secondary */
    color: white;
    &:hover {
      background-color: #5a6268;
    }
  }
`;

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <Overlay>
      <DialogContent>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button className="confirm" onClick={onConfirm}>Confirm</Button>
          <Button className="cancel" onClick={onCancel}>Cancel</Button>
        </ButtonGroup>
      </DialogContent>
    </Overlay>
  );
};

export default ConfirmationDialog;
