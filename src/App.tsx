import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/sections/Navbar';
import Hero from '@/sections/Hero';
import Optimizer from '@/sections/Optimizer';
import Rules from '@/sections/Rules';
import Examples from '@/sections/Examples';
import Footer from '@/sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#212121]">
      <Navbar />
      <main>
        <Hero />
        <Optimizer />
        <Rules />
        <Examples />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2a2a2a',
            color: '#fff',
            border: '1px solid #3a3a3a'
          }
        }}
      />
    </div>
  );
}

export default App;
