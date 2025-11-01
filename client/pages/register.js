import Navbar from '../components/Navbar';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>
        <RegisterForm />
      </div>
    </>
  );
}
