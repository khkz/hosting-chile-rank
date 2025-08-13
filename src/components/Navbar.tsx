import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown,
  Home,
  BarChart2,
  ShoppingCart,
  Globe,
  FileText,
  Star
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
import { Button } from "@/components/ui/button";

const navLinkClasses = "text-sm font-medium flex items-center text-[#2B2D42] hover:text-[#EF233C] transition-colors";
const activeNavLinkClasses = "text-[#EF233C]";
const mobileNavLinkClasses = "text-base font-medium py-3 flex items-center gap-2 text-[#2B2D42] hover:text-[#EF233C] transition-colors";

const Navbar = () => {
  const [isGuideMenuOpen, setIsGuideMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const CTA_URL = "https://clientes.hostingplus.cl/cart.php?gid=13&promocode=EXIT20";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <a href="https://eligetuhosting.cl" className="flex items-center">
          <Logo variant="option-a" className="h-12 w-auto mr-2" />
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <a 
            href="https://eligetuhosting.cl" 
            className={`${navLinkClasses} px-3 py-2`}
          >
            <Home className="h-4 w-4 mr-1" />
            Inicio
          </a>
          
          <NavLink 
            to="/ranking" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2`
            }
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Ranking
          </NavLink>
          
          <NavLink 
            to="/comparativa" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2`
            }
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Comparativa
          </NavLink>
          
          <NavLink 
            to="/cotiza-hosting" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2`
            }
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Cotiza hosting
          </NavLink>
          
          <NavLink 
            to="/ultimos-dominios" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2`
            }
          >
            <Globe className="h-4 w-4 mr-1" />
            Últimos dominios
          </NavLink>
          
          <NavLink 
            to="/asn" 
            className={({ isActive }) => 
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} px-3 py-2`
            }
          >
            <Globe className="h-4 w-4 mr-1" />
            Mapa ASN
          </NavLink>
          {/* Dropdown Menu for "Guías" */}
          <DropdownMenu open={isGuideMenuOpen} onOpenChange={setIsGuideMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className={`${navLinkClasses} px-3 py-2 flex items-center gap-1 ${
                  ['/guia-elegir-hosting', '/guia-elegir-vps', '/guia-elegir-servidor-dedicado', '/guia-elegir-ssl', '/guia-elegir-cdn', '/mejor-hosting-chile-2025', '/guia-migrar-hosting', '/guia-seguridad-web', '/guia-hosting-wordpress'].includes(location.pathname) 
                    ? activeNavLinkClasses 
                    : ''
                }`}
              >
                <FileText className="h-4 w-4 mr-1" />
                Guías
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white">
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
            className="bg-[#EF233C] hover:bg-[#EF233C]/90 text-white"
          >
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              Contratar ahora con el #1 del ranking
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
          <SheetContent side="left" className="w-[80%] sm:max-w-sm">
            <div className="flex flex-col h-full">
              <div className="flex flex-col space-y-4 py-4">
                <a href="https://eligetuhosting.cl" className="flex items-center mb-6">
                  <Logo variant="option-a" className="h-10 w-auto mr-2" />
                </a>
                
                <a 
                  href="https://eligetuhosting.cl" 
                  className={mobileNavLinkClasses}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Inicio
                </a>
                
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
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Comparativa
                </NavLink>
                
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
                
                <NavLink 
                  to="/asn" 
                  className={({ isActive }) => 
                    `${mobileNavLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                  }
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Mapa ASN
                </NavLink>
                <div className="pt-2 pb-2">
                  <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">Guías</h3>
                  <div className="pl-2 flex flex-col space-y-3">
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
                </div>
              </div>
              
              <div className="mt-auto pb-6">
                <Button 
                  asChild 
                  className="w-full bg-[#EF233C] hover:bg-[#EF233C]/90 text-white"
                >
                  <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
                    Contratar ahora con el #1
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
