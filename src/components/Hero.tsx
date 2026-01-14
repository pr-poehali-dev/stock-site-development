import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container px-4">
        <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Более 100,000+ дизайнов</span>
          </div>

          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Творческие ресурсы
            </span>
            <br />
            <span className="text-foreground">для дизайнеров</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Миллионы бесплатных и премиум графических ресурсов. Векторы, фото, PSD, иконки — всё что нужно для вашего проекта
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Искать векторы, фото, иконки..."
                className="pl-12 h-12 text-base"
              />
            </div>
            <Button size="lg" className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 h-12 px-8">
              <Icon name="Search" className="h-5 w-5 mr-2" />
              Искать
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="cursor-pointer hover:scale-105 transition-transform">
              Векторы
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:scale-105 transition-transform">
              Фото
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:scale-105 transition-transform">
              Иконки
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:scale-105 transition-transform">
              PSD
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:scale-105 transition-transform">
              AI
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:scale-105 transition-transform">
              Шаблоны
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};
