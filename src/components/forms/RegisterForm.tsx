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

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  age: z.number().min(1).max(150).optional(),
  city: z.string().optional(),
  career: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      await registerUser(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
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
        label="Nombre completo"
        {...register('name')}
        error={errors.name?.message}
      />

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

      <Input
        label="Edad (opcional)"
        type="number"
        {...register('age', { valueAsNumber: true })}
        error={errors.age?.message}
      />

      <Input
        label="Ciudad (opcional)"
        {...register('city')}
        error={errors.city?.message}
      />

      <Input
        label="Carrera (opcional)"
        {...register('career')}
        error={errors.career?.message}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Registrarse
      </Button>
    </form>
  );
};


