import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Version {
  id: number;
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  title: string;
  description: string;
  changes: string[];
  files: { name: string; type: 'pdf' | 'xls' | 'doc'; size: string }[];
}

const mockVersions: Version[] = [
  {
    id: 1,
    version: '3.2.0',
    date: '2026-01-25',
    type: 'major',
    title: 'Крупное обновление: новый интерфейс администрирования',
    description: 'Полностью переработанный интерфейс с улучшенной производительностью',
    changes: [
      'Новая панель администрирования',
      'Улучшенная система уведомлений',
      'Оптимизация работы с большими таблицами',
      'Добавлен экспорт в Excel',
    ],
    files: [
      { name: 'Руководство_v3.2.0.pdf', type: 'pdf', size: '2.4 MB' },
      { name: 'Технические_спецификации.doc', type: 'doc', size: '856 KB' },
    ],
  },
  {
    id: 2,
    version: '3.1.5',
    date: '2026-01-15',
    type: 'patch',
    title: 'Исправление критических ошибок',
    description: 'Устранены проблемы с синхронизацией данных',
    changes: [
      'Исправлена ошибка в модуле отчетов',
      'Улучшена стабильность системы',
      'Обновлены зависимости безопасности',
    ],
    files: [
      { name: 'Список_исправлений_v3.1.5.pdf', type: 'pdf', size: '450 KB' },
    ],
  },
  {
    id: 3,
    version: '3.1.0',
    date: '2026-01-01',
    type: 'minor',
    title: 'Новые возможности фильтрации',
    description: 'Расширенные инструменты для работы с данными',
    changes: [
      'Добавлены продвинутые фильтры',
      'Новые виды экспорта данных',
      'Улучшена производительность поиска',
    ],
    files: [
      { name: 'Руководство_фильтры.pdf', type: 'pdf', size: '1.2 MB' },
      { name: 'Примеры_использования.xls', type: 'xls', size: '340 KB' },
    ],
  },
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredVersions = mockVersions.filter((version) => {
    const matchesSearch =
      version.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.version.includes(searchQuery);
    const matchesType = filterType === 'all' || version.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: Version['type']) => {
    switch (type) {
      case 'major':
        return 'bg-warm-brown text-white';
      case 'minor':
        return 'bg-warm-terracotta text-white';
      case 'patch':
        return 'bg-warm-sand text-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getTypeLabel = (type: Version['type']) => {
    switch (type) {
      case 'major':
        return 'Крупное';
      case 'minor':
        return 'Среднее';
      case 'patch':
        return 'Исправление';
    }
  };

  const getFileIcon = (type: 'pdf' | 'xls' | 'doc') => {
    switch (type) {
      case 'pdf':
        return 'FileText';
      case 'xls':
        return 'FileSpreadsheet';
      case 'doc':
        return 'FileText';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-heading font-bold text-primary mb-2">Документация</h1>
        <p className="text-lg text-muted-foreground">
          История версий и документация к каждому релизу
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
        <div className="flex-1">
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="Поиск по версиям и названиям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Тип обновления" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="major">Крупные</SelectItem>
            <SelectItem value="minor">Средние</SelectItem>
            <SelectItem value="patch">Исправления</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredVersions.map((version, index) => (
          <Card
            key={version.id}
            className="hover:shadow-lg transition-shadow animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-heading font-bold text-primary">
                    v{version.version}
                  </div>
                  <Badge className={getTypeColor(version.type)}>{getTypeLabel(version.type)}</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span>{new Date(version.date).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
              <CardTitle className="text-xl">{version.title}</CardTitle>
              <CardDescription>{version.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="ListChecks" size={18} />
                  Изменения:
                </h4>
                <ul className="space-y-2">
                  {version.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-1 flex-shrink-0" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Paperclip" size={18} />
                  Файлы документации:
                </h4>
                <div className="flex flex-wrap gap-3">
                  {version.files.map((file, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-accent"
                      onClick={() => console.log('Скачать', file.name)}
                    >
                      <Icon name={getFileIcon(file.type) as any} size={18} />
                      <span className="font-normal">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({file.size})</span>
                      <Icon name="Download" size={16} />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}