import CustomerAuthProvider from '@/components/auth/CustomerAuthProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerAuthProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </CustomerAuthProvider>
  );
}
