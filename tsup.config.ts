import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: './DynamicForm.tsx',
    types: './types.ts',
    ui: './ui/form/index.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  external: [
    'react',
    'react-dom',
    'formik',
    'yup',
    'next',
    'next/dynamic',
    'next/image',
    'next/navigation',
    '@headlessui/react',
    '@vis.gl/react-google-maps',
    'geojson',
    'supercluster',
    'react-dropzone',
    'recharts',
    './Map',
    '../Map',
  ],
  ignoreWatch: ['Map'],
  clean: true,
});
