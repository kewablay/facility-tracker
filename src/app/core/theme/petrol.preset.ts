import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const PetrolPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '4px',
      lg: '4px',
      xl: '4px',
    },
  },
  semantic: {
    primary: {
      50: '#f0f7f7',
      100: '#d7ebec',
      200: '#b0d7da',
      300: '#82bcc1',
      400: '#519da4',
      500: '#1f6f78',
      600: '#1b626a',
      700: '#175358',
      800: '#134347',
      900: '#103639',
      950: '#0a2224',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.500}',
      offset: '2px',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#e2e6ec',
          300: '#cfd5de',
          400: '#a8b1bf',
          500: '#5a6472',
          600: '#4a5361',
          700: '#3a424e',
          800: '#252b34',
          900: '#14181f',
          950: '#0c0f14',
        },
        text: {
          color: '#14181f',
          mutedColor: '#5a6472',
        },
        content: {
          borderColor: '#e2e6ec',
        },
      },
    },
  },
  components: {
    badge: {
      root: {
        borderRadius: 'var(--radius)',
        padding: '0 var(--space-1)',
        fontSize: '12px',
        fontWeight: '500',
        minWidth: 'auto',
        height: '21px',
      },
      success: {
        background: 'var(--signal-active)',
        color: 'var(--surface)',
      },
      warn: {
        background: 'var(--signal-maintenance)',
        color: 'var(--ink)',
      },
      secondary: {
        background: 'var(--signal-inactive)',
        color: 'var(--surface)',
      },
    },
  },
});
