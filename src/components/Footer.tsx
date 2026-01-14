import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">Z</span>
              </div>
              <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ZI DESIGN
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Платформа для творческих профессионалов. Миллионы ресурсов для ваших проектов.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Icon name="Facebook" className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Icon name="Twitter" className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Icon name="Instagram" className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Icon name="Linkedin" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Карьера
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Блог
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Пресс-кит
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4" id="licenses">Ресурсы</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Лицензии
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Поддержка
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Документация
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4" id="contacts">Подписка</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Получайте новые ресурсы и новости каждую неделю
            </p>
            <div className="flex gap-2">
              <Input placeholder="Ваш email" className="flex-1" />
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Icon name="Send" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 ZI DESIGN. Все права защищены.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Условия использования
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
