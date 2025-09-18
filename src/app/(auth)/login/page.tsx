import { LoginForm } from "@/src/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md card animate-fade-in">
        <div className="card-banner relative h-36 w-36 mx-auto mt-[-4.5rem] mb-2">
          <Image 
          src="/images/apptit-logo.svg" 
          alt="Apptit Logo" 
          fill 
          className="shadow-2xl p-5 bg-white border rounded-lg" />
        </div>
        <div className="card-content">
          <h1 className="text-2xl font-bold mb-2 text-center">Connexion</h1>
          <p className="caption mb-4 text-center">Accédez à votre espace Apptit.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}