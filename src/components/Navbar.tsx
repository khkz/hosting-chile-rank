import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  ChevronDown,
  Home,
  BarChart2,
  GitCompare,
  ShoppingCart,
  Globe,
  FileText,
  Star,
  BookOpen,
  Wrench,
  ArrowRight,
  User,
  LogOut,
  LayoutDashboard,
  Award,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Logo from './Logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const navLinkClasses = "text-sm font-medium flex items-center text-[#2B2D42] hover:text-[#EF233C] transition-all duration-300 hover:scale-105";
const activeNavLinkClasses = "text-[#EF233C]";
const mobileNavLinkClasses = "text-base font-medium py-3 flex items-center gap-2 text-[#2B2D42] hover:text-[#EF233C] transition-colors";
const iconClasses = "h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const mainNavItems: NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/ranking', label: 'Ranking', icon: BarChart2 },
  { to: '/comparativa', label: 'Comparativa', icon: GitCompare },
  { to: '/wiki', label: 'Wiki', icon: BookOpen },
  { to: '/certificaciones', label: 'Certificaciones', icon: Award },
  { to: '/directorio-hosting-chile', label: 'Directorio', icon: Award },
];

const toolsItems: NavItem[] = [
  { to: '/cotiza-hosting', label: 'Cotiza hosting', icon: ShoppingCart },
  { to: '/ultimos-dominios', label: 'Últimos dominios', icon: Globe },
];

const guidesItems: NavItem[] = [
  { to: '/mejor-hosting-chile-2026', label: 'Mejor Hosting Chile 2026', icon: Star },
  { to: '/guia-elegir-hosting', label: 'Cómo elegir Hosting', icon: FileText },
  { to: '/guia-elegir-vps', label: 'Cómo elegir VPS', icon: FileText },
  { to: '/guia-elegir-servidor-dedicado', label: 'Cómo elegir Servidor Dedicado', icon: FileText },
  { to: '/guia-elegir-ssl', label: 'Cómo elegir SSL', icon: FileText },
  { to: '/guia-elegir-cdn', label: 'Cómo elegir CDN', icon: FileText },
  { to: '/guia-migrar-hosting', label: 'Migrar Hosting Seguro', icon: FileText },
  { to: '/guia-seguridad-web', label: 'Seguridad Web', icon: FileText },
  { to: '/guia-hosting-wordpress', label: 'Hosting WordPress', icon: FileText },
];

const Navbar = () => {
  const [isGuideMenuOpen, setIsGuideMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'hosting_provider') return '/provider/dashboard';
    return '/';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <a href="https://eligetuhosting.cl" className="flex items-center">
          <Logo variant="option-a" className="h-10 md:h-12 w-auto mr-2" />
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.to}
                to={item.to} 
                className={({ isActive }) => 
                  `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2 group`
                }
              >
                <Icon className={iconClasses} />
                {item.label}
              </NavLink>
            );
          })}
          
          {/* Dropdown Menu for "Herramientas" */}
          <DropdownMenu open={isToolsMenuOpen} onOpenChange={setIsToolsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className={`${navLinkClasses} px-3 py-2 flex items-center gap-1 group ${
                  toolsItems.some(item => location.pathname === item.to)
                    ? activeNavLinkClasses 
                    : ''
                }`}
              >
                <Wrench className={iconClasses} />
                Herramientas
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white z-50 animate-scale-in">
              {toolsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link 
                      to={item.to} 
                      className={`w-full px-2 py-2 flex items-center gap-2 ${isActive(item.to) ? 'text-[#EF233C]' : ''}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Dropdown Menu for "Guías" */}
          <DropdownMenu open={isGuideMenuOpen} onOpenChange={setIsGuideMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className={`${navLinkClasses} px-3 py-2 flex items-center gap-1 group ${
                  guidesItems.some(item => location.pathname === item.to)
                    ? activeNavLinkClasses 
                    : ''
                }`}
              >
                <FileText className={iconClasses} />
                Guías
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white z-50 animate-scale-in">
              {guidesItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link 
                      to={item.to} 
                      className={`w-full px-2 py-2 flex items-center gap-2 ${isActive(item.to) ? 'text-[#EF233C]' : ''}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* CTA Button and User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 px-2 py-1.5">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role || 'user'}</p>
                </div>
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Mi Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost">
              <Link to="/auth">Iniciar Sesión</Link>
            </Button>
          )}
          
          <Button 
            asChild 
            className="cta-primary flex items-center gap-2"
          >
            <Link to="/ranking" className="flex items-center gap-2">
              Compara ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-[#2B2D42]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:max-w-sm animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex flex-col space-y-4 py-4">
                <a href="https://eligetuhosting.cl" className="flex items-center mb-6">
                  <Logo variant="option-a" className="h-8 w-auto mr-2" />
                </a>
                
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink 
                      key={item.to}
                      to={item.to} 
                      className={({ isActive }) => 
                        `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                      }
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </NavLink>
                  );
                })}
                
                {/* User Menu / Login Button */}
                {user ? (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <User className="h-5 w-5 text-[#2B2D42]" />
                      <div>
                        <p className="text-sm font-medium text-[#2B2D42]">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{role || 'user'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate(getDashboardLink())}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Mi Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4 mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/auth')}
                    >
                      Iniciar Sesión
                    </Button>
                  </div>
                )}
                
                {/* Accordion for Herramientas & Guías */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="herramientas" className="border-none">
                    <AccordionTrigger className="py-3 text-base font-medium text-[#2B2D42] hover:text-[#EF233C] hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Herramientas
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col space-y-3 pt-2">
                        {toolsItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink 
                              key={item.to}
                              to={item.to} 
                              className={({ isActive }) => 
                                `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                              }
                            >
                              <Icon className="h-5 w-5 mr-2" />
                              {item.label}
                            </NavLink>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="guias" className="border-none">
                    <AccordionTrigger className="py-3 text-base font-medium text-[#2B2D42] hover:text-[#EF233C] hover:no-underline">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Guías
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col space-y-3 pt-2">
                        {guidesItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink 
                              key={item.to}
                              to={item.to} 
                              className={({ isActive }) => 
                                `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                              }
                            >
                              <Icon className="h-5 w-5 mr-2" />
                              {item.label}
                            </NavLink>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="mt-auto pb-6">
                <Button 
                  asChild 
                  className="w-full bg-[#EF233C] hover:bg-[#EF233C]/90 text-white flex items-center justify-center gap-2"
                >
                  <Link to="/ranking" className="flex items-center gap-2">
                    Compara ahora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
