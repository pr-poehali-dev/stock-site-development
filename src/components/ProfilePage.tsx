import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { user, works, setUser, logout } = useStore();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user) return null;

  const userWorks = works.filter(work => work.authorId === user.id);
  const stats = {
    works: userWorks.length,
    likes: userWorks.reduce((acc, work) => acc + work.likes, 0),
    downloads: userWorks.reduce((acc, work) => acc + work.downloads, 0),
  };

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setUser({
      ...user,
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      avatar: formData.get('avatar') as string || user.avatar,
    });
    
    toast.success('Профиль обновлён!');
    setIsEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-heading bg-gradient-to-br from-primary to-secondary text-white">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-heading font-bold text-2xl md:text-3xl">{user.name}</h1>
                {user.role === 'admin' && (
                  <Badge className="bg-accent">
                    <Icon name="Crown" className="h-3 w-3 mr-1" />
                    Администратор
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-4">{user.email}</p>
              
              {user.bio && (
                <p className="text-sm mb-4">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Folder" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{stats.works}</strong> работ
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Heart" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{stats.likes}</strong> лайков
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Download" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{stats.downloads}</strong> загрузок
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsEditOpen(true)}>
                  <Icon name="Settings" className="h-4 w-4 mr-2" />
                  Редактировать профиль
                </Button>
                <Button variant="outline" onClick={logout}>
                  <Icon name="LogOut" className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="works" className="w-full">
          <TabsList>
            <TabsTrigger value="works">Мои работы</TabsTrigger>
            <TabsTrigger value="favorites">Избранное</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
          </TabsList>

          <TabsContent value="works" className="mt-6">
            {userWorks.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="FolderOpen" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-heading font-semibold text-xl mb-2">Пока нет работ</h3>
                <p className="text-muted-foreground mb-4">
                  Загрузите свою первую работу и поделитесь с сообществом
                </p>
                <Button>
                  <Icon name="Upload" className="h-4 w-4 mr-2" />
                  Загрузить работу
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userWorks.map((work) => (
                  <Card key={work.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">
                        {work.status === 'approved' && 'Одобрено'}
                        {work.status === 'pending' && 'На модерации'}
                        {work.status === 'rejected' && 'Отклонено'}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{work.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Heart" className="h-3 w-3" />
                          {work.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Download" className="h-3 w-3" />
                          {work.downloads}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="p-12 text-center">
              <Icon name="Heart" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Избранные работы появятся здесь</p>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <Icon name="TrendingUp" className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold mb-1">{stats.works}</p>
                <p className="text-sm text-muted-foreground">Всего работ</p>
              </Card>
              <Card className="p-6">
                <Icon name="Heart" className="h-8 w-8 text-secondary mb-2" />
                <p className="text-2xl font-bold mb-1">{stats.likes}</p>
                <p className="text-sm text-muted-foreground">Получено лайков</p>
              </Card>
              <Card className="p-6">
                <Icon name="Download" className="h-8 w-8 text-accent mb-2" />
                <p className="text-2xl font-bold mb-1">{stats.downloads}</p>
                <p className="text-sm text-muted-foreground">Скачиваний</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">О себе</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={user.bio}
                placeholder="Расскажите о себе..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">URL аватара</Label>
              <Input
                id="avatar"
                name="avatar"
                type="url"
                defaultValue={user.avatar}
                placeholder="https://..."
              />
            </div>
            <Button type="submit" className="w-full">
              Сохранить изменения
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
