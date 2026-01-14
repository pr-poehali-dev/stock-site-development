import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">Z</span>
            </div>
            <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ZI DESIGN
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Главная
            </a>
            <a href="#catalog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Каталог
            </a>
            <a href="#licenses" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Лицензии
            </a>
            <a href="#contacts" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Контакты
            </a>
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
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-xs">
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="icon">
            <Icon name="User" className="h-5 w-5" />
          </Button>

          <Button className="hidden md:flex bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90">
            <Icon name="Upload" className="h-4 w-4 mr-2" />
            Загрузить
          </Button>
        </div>
      </div>
    </header>
  );
};
