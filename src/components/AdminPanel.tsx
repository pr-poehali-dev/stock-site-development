import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const AdminPanel = () => {
  const { user, works, updateWork, deleteWork } = useStore();
  const [colors, setColors] = useState({
    primary: '#9b87f5',
    secondary: '#D946EF',
    accent: '#F97316',
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Icon name="Lock" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-heading font-bold text-2xl mb-2">Доступ запрещён</h2>
          <p className="text-muted-foreground">
            Эта страница доступна только администраторам
          </p>
        </Card>
      </div>
    );
  }

  const pendingWorks = works.filter(w => w.status === 'pending');
  const approvedWorks = works.filter(w => w.status === 'approved');
  const rejectedWorks = works.filter(w => w.status === 'rejected');

  const handleApprove = (workId: string) => {
    updateWork(workId, { status: 'approved' });
    toast.success('Работа одобрена!');
  };

  const handleReject = (workId: string) => {
    updateWork(workId, { status: 'rejected' });
    toast.error('Работа отклонена');
  };

  const handleDelete = (workId: string) => {
    deleteWork(workId);
    toast.success('Работа удалена');
  };

  const handleUpdateColors = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newColors = {
      primary: formData.get('primary') as string,
      secondary: formData.get('secondary') as string,
      accent: formData.get('accent') as string,
    };
    
    setColors(newColors);
    
    document.documentElement.style.setProperty('--primary', hexToHsl(newColors.primary));
    document.documentElement.style.setProperty('--secondary', hexToHsl(newColors.secondary));
    document.documentElement.style.setProperty('--accent', hexToHsl(newColors.accent));
    
    toast.success('Цвета обновлены!');
  };

  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 0%';
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">
            <Icon name="Shield" className="inline h-8 w-8 mr-2 text-accent" />
            Панель администратора
          </h1>
          <p className="text-muted-foreground">
            Управление контентом и дизайном сайта
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">На модерации</p>
                <p className="text-3xl font-bold">{pendingWorks.length}</p>
              </div>
              <Icon name="Clock" className="h-12 w-12 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Одобрено</p>
                <p className="text-3xl font-bold">{approvedWorks.length}</p>
              </div>
              <Icon name="CheckCircle" className="h-12 w-12 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Отклонено</p>
                <p className="text-3xl font-bold">{rejectedWorks.length}</p>
              </div>
              <Icon name="XCircle" className="h-12 w-12 text-red-500" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="moderation" className="w-full">
          <TabsList>
            <TabsTrigger value="moderation">
              <Icon name="FileCheck" className="h-4 w-4 mr-2" />
              Модерация
            </TabsTrigger>
            <TabsTrigger value="design">
              <Icon name="Palette" className="h-4 w-4 mr-2" />
              Дизайн
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart" className="h-4 w-4 mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Icon name="Globe" className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moderation" className="mt-6">
            <Card className="p-6">
              <h2 className="font-heading font-bold text-xl mb-4">
                Работы на модерации ({pendingWorks.length})
              </h2>
              
              {pendingWorks.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="CheckCircle" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Нет работ на модерации</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Превью</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Автор</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Лицензия</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingWorks.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell>
                          <img
                            src={work.image}
                            alt={work.title}
                            className="h-12 w-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{work.title}</TableCell>
                        <TableCell>{work.authorName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{work.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{work.license}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(work.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Icon name="Check" className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(work.id)}
                            >
                              <Icon name="X" className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(work.id)}
                            >
                              <Icon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="design" className="mt-6">
            <Card className="p-6">
              <h2 className="font-heading font-bold text-xl mb-4">
                Настройки дизайна
              </h2>
              
              <form onSubmit={handleUpdateColors} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Цветовая схема</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary">Основной цвет</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary"
                          name="primary"
                          type="color"
                          defaultValue={colors.primary}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          defaultValue={colors.primary}
                          className="flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary">Вторичный цвет</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary"
                          name="secondary"
                          type="color"
                          defaultValue={colors.secondary}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          defaultValue={colors.secondary}
                          className="flex-1"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accent">Акцентный цвет</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent"
                          name="accent"
                          type="color"
                          defaultValue={colors.accent}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          defaultValue={colors.accent}
                          className="flex-1"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Предпросмотр</h4>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        Кнопка
                      </Button>
                      <Badge>Badge Primary</Badge>
                      <Badge variant="secondary">Badge Secondary</Badge>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                  <Icon name="Save" className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="p-6 text-center">
              <Icon name="BarChart" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-heading font-semibold text-xl mb-2">Аналитика</h3>
              <p className="text-muted-foreground">
                Статистика посещений и популярных работ
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <Card className="p-6 text-center">
              <Icon name="Globe" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-heading font-semibold text-xl mb-2">SEO настройки</h3>
              <p className="text-muted-foreground">
                Управление метатегами и индексацией
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
