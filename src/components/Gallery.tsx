import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api, Work } from '@/lib/api';
import { toast } from 'sonner';

interface GalleryItem {
  id: number;
  title: string;
  author: string;
  category: string;
  image: string;
  isPremium: boolean;
  likes: number;
  downloads: number;
}

const mockGalleryItems: GalleryItem[] = [
  { id: 1, title: 'Абстрактный градиент', author: 'Alex Design', category: 'Векторы', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400', isPremium: false, likes: 234, downloads: 1200 },
  { id: 2, title: 'Минимализм в искусстве', author: 'Maria Creative', category: 'Фото', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', isPremium: true, likes: 567, downloads: 2400 },
  { id: 3, title: 'Геометрия цвета', author: 'John Vector', category: 'Векторы', image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400', isPremium: false, likes: 189, downloads: 890 },
  { id: 4, title: 'Креативная палитра', author: 'Anna Arts', category: 'PSD', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', isPremium: true, likes: 423, downloads: 1890 },
  { id: 5, title: 'Яркие формы', author: 'Mike Designer', category: 'Иконки', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', isPremium: false, likes: 312, downloads: 1560 },
  { id: 6, title: 'Цифровое искусство', author: 'Sofia Digital', category: 'AI', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', isPremium: true, likes: 678, downloads: 3200 },
  { id: 7, title: 'Абстракция в дизайне', author: 'David Pro', category: 'Векторы', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400', isPremium: false, likes: 245, downloads: 1100 },
  { id: 8, title: 'Современный стиль', author: 'Emma Style', category: 'Шаблоны', image: 'https://images.unsplash.com/photo-1604076984203-587c92ab2e58?w=400', isPremium: true, likes: 890, downloads: 4100 },
];

export const Gallery = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Все', 'Векторы', 'Фото', 'Иконки', 'PSD', 'AI', 'Шаблоны'];
  const categoryMap: Record<string, string> = {
    'Векторы': 'vectors',
    'Фото': 'photos',
    'Иконки': 'icons',
    'PSD': 'psd',
    'AI': 'ai',
    'Шаблоны': 'templates'
  };

  useEffect(() => {
    loadWorks();
  }, [selectedCategory]);

  const loadWorks = async () => {
    setIsLoading(true);
    try {
      const category = selectedCategory === 'Все' ? undefined : categoryMap[selectedCategory];
      const fetchedWorks = await api.works.getAll({ status: 'approved', category });
      setWorks(fetchedWorks);
    } catch (error) {
      toast.error('Ошибка загрузки работ');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredItems = works;

  return (
    <section id="catalog" className="py-16 md:py-24">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-2">
              Популярные работы
            </h2>
            <p className="text-muted-foreground">
              Откройте для себя лучшие дизайнерские ресурсы
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-gradient-to-r from-primary to-secondary' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <Icon name="Loader2" className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Загрузка работ...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Icon name="Search" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Работы не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="group overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-xl animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    {item.license === 'commercial' && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Icon name="Crown" className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        <Icon 
                          name="Heart" 
                          className={`h-4 w-4 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Icon name="Download" className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Icon name="Eye" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{item.author_name}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Heart" className="h-3 w-3" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Download" className="h-3 w-3" />
                      <span>{item.downloads}</span>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        </div>

        <div className="flex justify-center mt-12">
          <Button size="lg" variant="outline" className="gap-2">
            Показать больше
            <Icon name="ChevronDown" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};