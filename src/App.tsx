import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DocumentationPage from "./pages/DocumentationPage";
import SystemObjectsPage from "./pages/SystemObjectsPage";
import ContactsPage from "./pages/ContactsPage";
import NotFound from "./pages/NotFound";
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const queryClient = new QueryClient();

function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Главная', icon: 'Home' },
    { path: '/documentation', label: 'Документация', icon: 'FileText' },
    { path: '/objects', label: 'Объекты системы', icon: 'Database' },
    { path: '/contacts', label: 'Контакты', icon: 'MapPin' },
  ];

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => mobile && setIsOpen(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            location.pathname === item.path
              ? 'bg-primary text-primary-foreground font-medium'
              : 'hover:bg-accent text-foreground'
          }`}
        >
          <Icon name={item.icon as any} size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <Icon name="Package" size={28} />
            <span>DocSystem</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/objects" element={<SystemObjectsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;