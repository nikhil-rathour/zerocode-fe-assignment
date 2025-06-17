import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AuthForm type="register" />
    </div>
  );
}