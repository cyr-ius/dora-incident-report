import { createTheme } from "@mui/material";


export const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5'
      }
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'standard',
          fullWidth: true
        }
      },
      MuiSelect: {
        defaultProps: {
          variant: 'standard',
          fullWidth: true
        }
      },
      MuiFormControl: {
        defaultProps: {
          variant: 'standard',
          fullWidth: true
        }
      }
    },
    shape: {
      // borderRadius: 8
    }
  });
