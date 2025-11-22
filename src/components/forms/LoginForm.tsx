'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { useAuth } from '../../lib/auth/auth-context';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      await login(data);
      // Esperar un momento para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error en login:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.data?.message ||
                          err.message || 
                          'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Iniciar Sesión
      </Button>
    </form>
  );
};


