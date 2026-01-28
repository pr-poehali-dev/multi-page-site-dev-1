import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Поиск:', searchQuery);
    }
  };

  const features = [
    {
      icon: 'FileText',
      title: 'Документация',
      description: 'Актуальные версии и релизы',
      action: () => navigate('/documentation'),
    },
    {
      icon: 'Database',
      title: 'Объекты системы',
      description: 'База данных объектов',
      action: () => navigate('/objects'),
    },
    {
      icon: 'Bell',
      title: 'Уведомления',
      description: 'Следите за обновлениями',
      action: () => console.log('Уведомления'),
    },
    {
      icon: 'History',
      title: 'История изменений',
      description: 'Полный журнал версий',
      action: () => console.log('История'),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="text-center mb-12 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-4">
              Добро пожаловать в DocSystem
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Ваша система управления версиями и документацией программного продукта
            </p>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-3xl mb-16">
            <div className="relative group">
              <Icon
                name="Search"
                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={24}
              />
              <Input
                type="text"
                placeholder="Поиск по документации, версиям, объектам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 pl-16 pr-6 text-lg rounded-full border-2 border-border focus:border-primary shadow-lg hover:shadow-xl transition-all"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-8"
              >
                Найти
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover-scale cursor-pointer border-2 hover:border-primary transition-all hover:shadow-lg"
                onClick={feature.action}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                    <Icon name={feature.icon as any} size={32} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-accent/30 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-heading font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Выпущенных версий</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-primary mb-2">1200+</div>
              <div className="text-muted-foreground">Объектов системы</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Доступность документации</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}