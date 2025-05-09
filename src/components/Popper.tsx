import CloseIcon from '@mui/icons-material/Close';
import { Fade, IconButton, Paper, Popper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSchema } from '../context/SchemaContext';
import { GlobalErrors } from './GlobalErrors';
export const PopperErrors = () => {
  const { currenterrors } = useSchema();
  const [open, setOpen] = useState(true);
  const [position, setPosition] = useState({ top: 10, right: 10 }); // Position du popover
  const popperRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleClose = () => {
    setOpen(false); // Ferme le Popper lorsque la croix est cliquée
  };

  useEffect(() => {
    setOpen(currenterrors.length > 0);
  }, [currenterrors]);

  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - (window.innerWidth - position.right),
      y: e.clientY - position.top,
    };

    e.preventDefault();

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (draggingRef.current && popperRef.current) {
        const newRight =
          window.innerWidth - (moveEvent.clientX - offsetRef.current.x);
        setPosition({
          top: moveEvent.clientY - offsetRef.current.y,
          right: newRight,
        });
      }
    };

    const onMouseUp = () => {
      draggingRef.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <Popper open={open} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper
            ref={popperRef}
            elevation={4}
            sx={{
              p: 1,
              width: 400,
              position: 'fixed',
              zIndex: 10000,
              top: `${position.top}px`, // Appliquer la position dynamique
              right: `${position.right}px`, // Appliquer la position dynamique
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: draggingRef.current ? 'grabbing' : 'grab', // Changer le curseur pendant le déplacement
            }}
            onMouseDown={handleMouseDown}>
            {/* Croix de fermeture en haut à droite */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
              }}>
              <CloseIcon />
            </IconButton>

            <Typography variant="subtitle1">Errors</Typography>
            {/* <Typography variant="body2"> */}
            <GlobalErrors />
            {/* </Typography> */}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};
