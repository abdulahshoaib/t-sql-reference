module.exports = {
  content: ['./app/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: theme('colors.gray.800'),
            h1: { fontWeight: '700', fontSize: theme('fontSize.3xl') },
            h2: { fontWeight: '600', fontSize: theme('fontSize.2xl') },
            h3: { fontWeight: '600', fontSize: theme('fontSize.xl') },
            code: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.pink.600'),
              padding: '2px 4px',
              borderRadius: '4px',
            },
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.blue.800'),
              },
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.lg'),
              padding: theme('spacing.4'),
              overflowX: 'auto',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: { color: theme('colors.teal.400') },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.green.400'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
            },
          },
        },
      }),
    },
  },
}
