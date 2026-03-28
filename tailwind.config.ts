import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { fontFamily: { heading: ['"Playfair Display"', 'serif'], body: ['"Inter"', 'sans-serif'] }, colors: { brand: { 50:'#ede9fe', 500:'#7c3aed', 600:'#7c3aed', 700:'#6d28d9' } } } },
  plugins: [],
};
export default config;
