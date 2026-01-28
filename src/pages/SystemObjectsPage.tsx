import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface SystemObject {
  id: number;
  name: string;
  type: string;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  lastModified: string;
  author: string;
}

const mockObjects: SystemObject[] = [
  {
    id: 1,
    name: 'UserAuthModule',
    type: 'Модуль',
    version: '3.2.0',
    status: 'active',
    lastModified: '2026-01-25',
    author: 'Иванов И.И.',
  },
  {
    id: 2,
    name: 'ReportGenerator',
    type: 'Компонент',
    version: '3.1.5',
    status: 'active',
    lastModified: '2026-01-20',
    author: 'Петров П.П.',
  },
  {
    id: 3,
    name: 'DataSyncService',
    type: 'Сервис',
    version: '3.2.0',
    status: 'beta',
    lastModified: '2026-01-24',
    author: 'Сидоров С.С.',
  },
  {
    id: 4,
    name: 'OldAPIHandler',
    type: 'API',
    version: '2.8.0',
    status: 'deprecated',
    lastModified: '2025-12-10',
    author: 'Иванов И.И.',
  },
  {
    id: 5,
    name: 'NotificationSystem',
    type: 'Модуль',
    version: '3.2.0',
    status: 'active',
    lastModified: '2026-01-25',
    author: 'Козлов К.К.',
  },
  {
    id: 6,
    name: 'AdminPanel',
    type: 'Интерфейс',
    version: '3.2.0',
    status: 'active',
    lastModified: '2026-01-25',
    author: 'Новиков Н.Н.',
  },
];

export default function SystemObjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredObjects = mockObjects.filter((obj) => {
    const matchesSearch =
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || obj.type === filterType;
    const matchesStatus = filterStatus === 'all' || obj.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: SystemObject['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 text-white">Активен</Badge>;
      case 'deprecated':
        return <Badge className="bg-red-600 text-white">Устарел</Badge>;
      case 'beta':
        return <Badge className="bg-blue-600 text-white">Бета</Badge>;
    }
  };

  const handleExport = () => {
    console.log('Экспорт данных');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">Объекты системы</h1>
            <p className="text-lg text-muted-foreground">
              Полная база данных компонентов и модулей
            </p>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Icon name="Download" size={18} />
            Экспортировать
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon
                name="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                placeholder="Поиск по названию или автору..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="Модуль">Модуль</SelectItem>
              <SelectItem value="Компонент">Компонент</SelectItem>
              <SelectItem value="Сервис">Сервис</SelectItem>
              <SelectItem value="API">API</SelectItem>
              <SelectItem value="Интерфейс">Интерфейс</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активен</SelectItem>
              <SelectItem value="beta">Бета</SelectItem>
              <SelectItem value="deprecated">Устарел</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="animate-scale-in">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-heading">ID</TableHead>
                <TableHead className="font-heading">Название</TableHead>
                <TableHead className="font-heading">Тип</TableHead>
                <TableHead className="font-heading">Версия</TableHead>
                <TableHead className="font-heading">Статус</TableHead>
                <TableHead className="font-heading">Изменено</TableHead>
                <TableHead className="font-heading">Автор</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObjects.length > 0 ? (
                filteredObjects.map((obj) => (
                  <TableRow key={obj.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-mono">{obj.id}</TableCell>
                    <TableCell className="font-semibold">{obj.name}</TableCell>
                    <TableCell>{obj.type}</TableCell>
                    <TableCell className="font-mono">{obj.version}</TableCell>
                    <TableCell>{getStatusBadge(obj.status)}</TableCell>
                    <TableCell>
                      {new Date(obj.lastModified).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>{obj.author}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Объекты не найдены</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="mt-6 text-sm text-muted-foreground">
        Показано объектов: {filteredObjects.length} из {mockObjects.length}
      </div>
    </div>
  );
}