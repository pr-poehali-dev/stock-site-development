import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useStore } from '@/lib/store';
import { AuthDialog } from './AuthDialog';
import { UploadDialog } from './UploadDialog';

interface HeaderProps {
  onNavigate?: (page: 'home' | 'profile' | 'admin') => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const { user, favorites, logout } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleUploadClick = () => {
    if (!user) {
      setAuthOpen(true);
    } else {
      setUploadOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate?.('home')} className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">Z</span>
              </div>
              <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ZI DESIGN
              </span>
            </button>
            
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate?.('home')} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Главная
              </button>
              <a href="#catalog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Каталог
              </a>
              <a href="#licenses" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Лицензии
              </a>
              <a href="#contacts" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Контакты
              </a>
              {user?.role === 'admin' && (
                <button onClick={() => onNavigate?.('admin')} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
                  <Icon name="Shield" className="h-4 w-4" />
                  Админ
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex relative w-64">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск работ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Heart" className="h-5 w-5" />
              {favorites.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-xs">
                  {favorites.length}
                </Badge>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
                    <Icon name="User" className="h-4 w-4 mr-2" />
                    Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon name="Heart" className="h-4 w-4 mr-2" />
                    Избранное
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon name="Settings" className="h-4 w-4 mr-2" />
                    Настройки
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onNavigate?.('admin')}>
                        <Icon name="Shield" className="h-4 w-4 mr-2" />
                        Админ-панель
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <Icon name="LogOut" className="h-4 w-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setAuthOpen(true)}>
                <Icon name="User" className="h-5 w-5" />
              </Button>
            )}

            <Button 
              onClick={handleUploadClick}
              className="hidden md:flex bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
            >
              <Icon name="Upload" className="h-4 w-4 mr-2" />
              Загрузить
            </Button>
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
};
