import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Logo from '@/components/Logo';
import { useEdition } from '@/hooks/useEdition';
import { editionHref } from '@/lib/countries';
import { functionErrorText } from '@/lib/functionError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import FormNotice, { type FormNoticeStatus } from '@/components/marco/FormNotice';

/** Largo mínimo que pedimos al crear la cuenta (el mismo que cita functionError.ts). */
const MIN_PASSWORD = 8;

type Status = FormNoticeStatus;

const tabClass =
  'min-h-11 rounded-sm text-[15px] font-medium text-ink-2 data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-none';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user, role } = useAuth();
  const { key, label } = useEdition();
  const homeHref = editionHref(key);

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<'user' | 'hosting_provider'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<Status>(null);
  const [registerStatus, setRegisterStatus] = useState<Status>(null);

  // Get redirect parameter from URL
  const searchParams = new URLSearchParams(window.location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  if (user && role) {
    // Use redirect parameter if present, otherwise role-based redirect
    if (redirectPath && redirectPath !== '/') {
      navigate(redirectPath);
    } else {
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'hosting_provider') navigate('/provider/dashboard');
      else navigate('/');
    }
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginStatus(null);

    try {
      await signIn(loginEmail, loginPassword);
      toast({ title: 'Ingresaste a tu cuenta.' });
      // Wait for AuthProvider to update role, then navigate
      setTimeout(() => {
        navigate(redirectPath);
      }, 100);
    } catch (error) {
      setLoginStatus({ kind: 'error', text: await functionErrorText(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterStatus(null);

    try {
      await signUp(registerEmail, registerPassword, registerRole);
      setRegisterStatus({
        kind: 'success',
        text: `Creamos tu cuenta. Te enviamos un correo a ${registerEmail} para confirmarla: abre el enlace y luego ingresa.`,
      });
    } catch (error) {
      setRegisterStatus({ kind: 'error', text: await functionErrorText(error) });
    } finally {
      setIsLoading(false);
    }
  };

  // Salida siempre visible: volver a donde estaba la persona o a la portada de su edición.
  const backHref = redirectPath && redirectPath.startsWith('/') && redirectPath !== '/' ? redirectPath : homeHref;
  const backIsRoute = backHref.startsWith('/');
  const backClass = 'inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-ink-2 hover:text-ink';
  const isRegister = tab === 'register';

  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>Ingresar | EligeTuHosting</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <header className="border-b border-rule bg-white">
        <div className="container flex h-16 items-center justify-between gap-4">
          <a href={homeHref} className="rounded-sm" aria-label={`EligeTuHosting ${label}, portada`}>
            <Logo edition={label} />
          </a>
          {backIsRoute ? (
            <Link to={backHref} className={`-mr-2 ${backClass}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> Volver
            </Link>
          ) : (
            <a href={backHref} className={`-mr-2 ${backClass}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> Volver
            </a>
          )}
        </div>
      </header>
      {/* Destino de «Saltar al contenido»: esta página no monta Navbar. */}
      <main id="contenido" tabIndex={-1} className="container py-10 focus:outline-none md:py-16">
        <div className="max-w-md">
          {/* El título sigue a la pestaña elegida; al cargar dice «Ingresar». */}
          <h1 className="t-h1 text-ink">{isRegister ? 'Crear cuenta' : 'Ingresar'}</h1>
          <p className="t-lead mt-3">
            {isRegister
              ? 'Crea tu cuenta con tu email. Te enviaremos un enlace para confirmarla.'
              : 'Entra con tu email y tu contraseña, o crea una cuenta nueva.'}
          </p>

          <div className="mt-8 rounded-xl border border-rule bg-white p-5 md:p-6">
            <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'register')} className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 rounded-lg bg-paper p-1">
                <TabsTrigger value="login" className={tabClass}>
                  Ingresar
                </TabsTrigger>
                <TabsTrigger value="register" className={tabClass}>
                  Crear cuenta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  <p className="t-meta">Todos los campos son obligatorios.</p>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <FormNotice status={loginStatus} />
                  <Button type="submit" variant="brand" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" aria-hidden />
                        Ingresando…
                      </>
                    ) : (
                      'Ingresar'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form onSubmit={handleRegister} className="space-y-5">
                  <p className="t-meta">Todos los campos son obligatorios.</p>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={MIN_PASSWORD}
                      aria-describedby="register-password-ayuda"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p id="register-password-ayuda" className="t-meta">
                      Usa al menos {MIN_PASSWORD} caracteres.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Tipo de cuenta</Label>
                    <Select
                      value={registerRole}
                      onValueChange={(value: 'user' | 'hosting_provider') => setRegisterRole(value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="register-role" className="h-11 rounded-lg border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="hosting_provider">Proveedor de hosting (administra la ficha de tu empresa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormNotice status={registerStatus} />
                  <Button type="submit" variant="brand" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" aria-hidden />
                        Creando tu cuenta…
                      </>
                    ) : (
                      'Crear cuenta'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
