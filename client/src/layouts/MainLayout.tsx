import Navbar from '@/components/Navbar';
import Container from '@/components/ui/container';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Container />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default MainLayout;
