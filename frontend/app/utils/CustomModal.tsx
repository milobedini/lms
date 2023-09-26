import { Box, Modal } from '@mui/material';
import { FC } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  component: any;
  setRoute?: (route: string) => void;
};

const CustomModal: FC<Props> = ({
  open,
  setOpen,
  activeItem,
  component: Component,
  setRoute,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className="absolute top-[50%] left-[50%] -translate-x-1/2 - -translate-y-1/2 w-[450px] bg-background rounded-[8px] 
      shadow p-4 outline-none"
      >
        <Component setOpen={setOpen} setRoute={setRoute} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
