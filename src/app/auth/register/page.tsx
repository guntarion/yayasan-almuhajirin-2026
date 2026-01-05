// src/app/auth/register/page.tsx
// Register redirects to login since Google OAuth handles both sign-in and sign-up
import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/auth/login');
}
