export const metadata = { title: 'KempenDesk', description: 'Redactietool voor factcheck en journalistieke vragen' };
import './style.css';
export default function RootLayout({ children }) {
  return <html lang="nl"><body>{children}</body></html>;
}
