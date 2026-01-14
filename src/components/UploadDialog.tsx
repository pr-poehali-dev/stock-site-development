import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useStore, DesignWork } from '@/lib/store';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadDialog = ({ open, onOpenChange }: UploadDialogProps) => {
  const { user, addWork } = useStore();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const work = await api.works.create({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        license: formData.get('license') as string,
        tags,
        author_id: parseInt(user.id),
        author_role: user.role,
        image_base64: previewImage,
      });

      const newWork: DesignWork = {
        id: work.id.toString(),
        title: work.title,
        description: work.description,
        category: work.category as any,
        image: work.image_url,
        files: work.file_urls,
        license: work.license as any,
        tags: work.tags,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        likes: work.likes,
        downloads: work.downloads,
        createdAt: work.created_at,
        status: work.status as any,
      };

      addWork(newWork);
      toast.success(
        user.role === 'admin' 
          ? 'Работа опубликована!' 
          : 'Работа отправлена на модерацию!'
      );
      onOpenChange(false);
      setTags([]);
      setPreviewImage('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Загрузить работу</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Превью изображения</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded" />
                ) : (
                  <div className="space-y-2">
                    <Icon name="Upload" className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Нажмите для загрузки изображения
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Название работы</Label>
            <Input
              id="title"
              name="title"
              placeholder="Например: Абстрактный градиент"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Расскажите о вашей работе..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vectors">Векторы</SelectItem>
                  <SelectItem value="photos">Фото</SelectItem>
                  <SelectItem value="icons">Иконки</SelectItem>
                  <SelectItem value="psd">PSD</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="templates">Шаблоны</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Тип лицензии</Label>
              <RadioGroup name="license" defaultValue="free" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="font-normal">Бесплатная</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal" id="personal" />
                  <Label htmlFor="personal" className="font-normal">Личное использование</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial" className="font-normal">Коммерческая</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Теги</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Добавьте тег"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <Icon name="X" className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Icon name="Info" className="h-4 w-4" />
              Правила публикации
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
              <li>• Загружайте только оригинальные работы</li>
              <li>• Убедитесь, что у вас есть права на публикацию</li>
              <li>• Работы проходят модерацию перед публикацией</li>
              <li>• Запрещён плагиат и нарушение авторских прав</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary"
            disabled={isLoading || !previewImage}
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Загружаем...
              </>
            ) : (
              <>
                <Icon name="Upload" className="mr-2 h-4 w-4" />
                Опубликовать работу
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};