import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Logo from '@/components/Logo';
import { useEdition } from '@/hooks/useEdition';
import { editionHref } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user, role } = useAuth();
  const { key, label } = useEdition();
  const homeHref = editionHref(key);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<'user' | 'hosting_provider'>('user');
  const [isLoading, setIsLoading] = useState(false);

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
    
    try {
      await signIn(loginEmail, loginPassword);
      toast.success('¡Bienvenido de vuelta!');
      // Wait for AuthProvider to update role, then navigate
      setTimeout(() => {
        navigate(redirectPath);
      }, 100);
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(registerEmail, registerPassword, registerRole);
      toast.success('Cuenta creada. Revisa tu email para confirmar.');
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  // Salida siempre visible: volver a donde estaba la persona o a la portada de su edición.
  const backHref = redirectPath && redirectPath.startsWith('/') && redirectPath !== '/' ? redirectPath : homeHref;
  const backIsRoute = backHref.startsWith('/');

  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>Ingresar | EligeTuHosting</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <header className="border-b border-rule bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <a href={homeHref} aria-label={`EligeTuHosting ${label}, portada`}>
            <Logo edition={label} />
          </a>
          {backIsRoute ? (
            <Link to={backHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Volver
            </Link>
          ) : (
            <a href={backHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Volver
            </a>
          )}
        </div>
      </header>
      <main className="flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-ink">Ingresar</h1>
          <CardDescription>Entra a tu cuenta o crea una nueva.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Ingresar</TabsTrigger>
              <TabsTrigger value="register">Crear cuenta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
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
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Ingresar'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
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
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Tipo de cuenta</Label>
                  <Select
                    value={registerRole}
                    onValueChange={(value: 'user' | 'hosting_provider') => setRegisterRole(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="register-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="hosting_provider">Proveedor de hosting (administra la ficha de tu empresa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </main>
    </div>
  );
}
