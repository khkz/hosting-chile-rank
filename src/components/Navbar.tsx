import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';
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

const Navbar = () => {
  const [isGuideMenuOpen, setIsGuideMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const CTA_URL = "https://clientes.hostingplus.cl/cart.php?gid=13&promocode=EXIT20";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <a href="https://eligetuhosting.cl" className="flex items-center">
          <Logo variant="option-a" className="h-10 md:h-12 w-auto mr-2" />
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2 group`
            }
          >
            <Home className={iconClasses} />
            Inicio
          </NavLink>
          
          <NavLink 
            to="/ranking" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2 group`
            }
          >
            <BarChart2 className={iconClasses} />
            Ranking
          </NavLink>
          
          <NavLink 
            to="/comparativa" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2 group`
            }
          >
            <GitCompare className={iconClasses} />
            Comparativa
          </NavLink>
          
          <NavLink 
            to="/wiki" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2 group`
            }
          >
            <BookOpen className={iconClasses} />
            Wiki
          </NavLink>
          
          {/* Dropdown Menu for "Herramientas" */}
          <DropdownMenu open={isToolsMenuOpen} onOpenChange={setIsToolsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className={`${navLinkClasses} px-3 py-2 flex items-center gap-1 group ${
                  ['/cotiza-hosting', '/ultimos-dominios'].includes(location.pathname) 
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
              <DropdownMenuItem asChild>
                <Link 
                  to="/cotiza-hosting" 
                  className={`w-full px-2 py-2 flex items-center gap-2 ${isActive('/cotiza-hosting') ? 'text-[#EF233C]' : ''}`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cotiza hosting
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/ultimos-dominios" 
                  className={`w-full px-2 py-2 flex items-center gap-2 ${isActive('/ultimos-dominios') ? 'text-[#EF233C]' : ''}`}
                >
                  <Globe className="h-4 w-4" />
                  Últimos dominios
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Dropdown Menu for "Guías" */}
          <DropdownMenu open={isGuideMenuOpen} onOpenChange={setIsGuideMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className={`${navLinkClasses} px-3 py-2 flex items-center gap-1 group ${
                  ['/guia-elegir-hosting', '/guia-elegir-vps', '/guia-elegir-servidor-dedicado', '/guia-elegir-ssl', '/guia-elegir-cdn', '/mejor-hosting-chile-2025', '/guia-migrar-hosting', '/guia-seguridad-web', '/guia-hosting-wordpress'].includes(location.pathname) 
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
              <DropdownMenuItem asChild>
                <Link 
                  to="/mejor-hosting-chile-2025" 
                  className={`w-full px-2 py-2 flex items-center gap-2 ${isActive('/mejor-hosting-chile-2025') ? 'text-[#EF233C]' : ''}`}
                >
                  <Star className="h-4 w-4" />
                  Mejor Hosting Chile 2025
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-elegir-hosting" 
                  className={`w-full px-2 py-2 ${isActive('/guia-elegir-hosting') ? 'text-[#EF233C]' : ''}`}
                >
                  Cómo elegir Hosting
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-elegir-vps" 
                  className={`w-full px-2 py-2 ${isActive('/guia-elegir-vps') ? 'text-[#EF233C]' : ''}`}
                >
                  Cómo elegir VPS
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-elegir-servidor-dedicado" 
                  className={`w-full px-2 py-2 ${isActive('/guia-elegir-servidor-dedicado') ? 'text-[#EF233C]' : ''}`}
                >
                  Cómo elegir Servidor Dedicado
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-elegir-ssl" 
                  className={`w-full px-2 py-2 ${isActive('/guia-elegir-ssl') ? 'text-[#EF233C]' : ''}`}
                >
                  Cómo elegir SSL
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-elegir-cdn" 
                  className={`w-full px-2 py-2 ${isActive('/guia-elegir-cdn') ? 'text-[#EF233C]' : ''}`}
                >
                  Cómo elegir CDN
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-migrar-hosting" 
                  className={`w-full px-2 py-2 ${isActive('/guia-migrar-hosting') ? 'text-[#EF233C]' : ''}`}
                >
                  Migrar Hosting Seguro
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-seguridad-web" 
                  className={`w-full px-2 py-2 ${isActive('/guia-seguridad-web') ? 'text-[#EF233C]' : ''}`}
                >
                  Seguridad Web
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/guia-hosting-wordpress" 
                  className={`w-full px-2 py-2 ${isActive('/guia-hosting-wordpress') ? 'text-[#EF233C]' : ''}`}
                >
                  Hosting WordPress
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* CTA Button */}
        <div className="hidden md:block">
          <Button 
            asChild 
            className="bg-[#EF233C] hover:bg-[#EF233C]/90 text-white hover:scale-105 transition-transform duration-300 flex items-center gap-2"
          >
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Contratar ahora
              <ArrowRight className="h-4 w-4" />
            </a>
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
                
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                  }
                >
                  <Home className="h-5 w-5 mr-2" />
                  Inicio
                </NavLink>
                
                <NavLink 
                  to="/ranking" 
                  className={({ isActive }) => 
                    `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                  }
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Ranking
                </NavLink>
                
                <NavLink 
                  to="/comparativa" 
                  className={({ isActive }) => 
                    `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                  }
                >
                  <GitCompare className="h-5 w-5 mr-2" />
                  Comparativa
                </NavLink>
                
                <NavLink 
                  to="/wiki" 
                  className={({ isActive }) => 
                    `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                  }
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Wiki
                </NavLink>
                
                {/* Accordion for Herramientas */}
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
                        <NavLink 
                          to="/cotiza-hosting" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Cotiza hosting
                        </NavLink>
                        
                        <NavLink 
                          to="/ultimos-dominios" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <Globe className="h-5 w-5 mr-2" />
                          Últimos dominios
                        </NavLink>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Accordion for Guías */}
                  <AccordionItem value="guias" className="border-none">
                    <AccordionTrigger className="py-3 text-base font-medium text-[#2B2D42] hover:text-[#EF233C] hover:no-underline">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Guías
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col space-y-3 pt-2">
                        <NavLink 
                          to="/mejor-hosting-chile-2025" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <Star className="h-5 w-5 mr-2" />
                          Mejor Hosting Chile 2025
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-elegir-hosting" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Cómo elegir Hosting
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-elegir-vps" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Cómo elegir VPS
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-elegir-servidor-dedicado" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Cómo elegir Servidor Dedicado
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-elegir-ssl" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Cómo elegir SSL
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-elegir-cdn" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Cómo elegir CDN
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-migrar-hosting" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Migrar Hosting Seguro
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-seguridad-web" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Seguridad Web
                        </NavLink>
                        
                        <NavLink 
                          to="/guia-hosting-wordpress" 
                          className={({ isActive }) => 
                            `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                          }
                        >
                          <FileText className="h-5 w-5 mr-2" />
                          Hosting WordPress
                        </NavLink>
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
                  <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Contratar
                    <ArrowRight className="h-4 w-4" />
                  </a>
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
