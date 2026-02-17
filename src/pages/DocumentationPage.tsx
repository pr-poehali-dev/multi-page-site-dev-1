import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Version, fetchVersions, createVersion, updateVersion, deleteVersion, getTypeColor, getTypeLabel, getFileIcon } from '@/data/versions';
import { useAuthContext } from '@/contexts/AuthContext';
import VersionEditor from '@/components/VersionEditor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { isEditor, accessToken } = useAuthContext();
  const { toast } = useToast();

  const loadVersions = useCallback(async () => {
    try {
      const data = await fetchVersions();
      setVersions(data);
    } catch {
      toast({ title: 'Ошибка загрузки', description: 'Не удалось загрузить версии', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadVersions(); }, [loadVersions]);

  const filteredVersions = versions.filter((version) => {
    const matchesSearch =
      version.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.version.includes(searchQuery);
    const matchesType = filterType === 'all' || version.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSave = async (data: Partial<Version>) => {
    if (!accessToken) return;
    setIsSaving(true);
    try {
      if (editingVersion) {
        await updateVersion(editingVersion.id, data, accessToken);
        toast({ title: 'Версия обновлена' });
      } else {
        await createVersion(data, accessToken);
        toast({ title: 'Версия создана' });
      }
      setShowEditor(false);
      setEditingVersion(null);
      await loadVersions();
    } catch (err) {
      toast({ title: 'Ошибка', description: err instanceof Error ? err.message : 'Произошла ошибка', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !accessToken) return;
    try {
      await deleteVersion(deleteId, accessToken);
      toast({ title: 'Версия удалена' });
      setDeleteId(null);
      await loadVersions();
    } catch (err) {
      toast({ title: 'Ошибка удаления', description: err instanceof Error ? err.message : 'Произошла ошибка', variant: 'destructive' });
    }
  };

  const handleEdit = (e: React.MouseEvent, version: Version) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingVersion(version);
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">Документация</h1>
            <p className="text-lg text-muted-foreground">
              История версий и документация к каждому релизу
            </p>
          </div>
          {isEditor && !showEditor && (
            <Button onClick={() => { setEditingVersion(null); setShowEditor(true); }} className="shrink-0">
              <Icon name="Plus" size={18} />
              Добавить версию
            </Button>
          )}
        </div>
      </div>

      {showEditor && (
        <div className="mb-8">
          <VersionEditor
            version={editingVersion}
            onSave={handleSave}
            onCancel={() => { setShowEditor(false); setEditingVersion(null); }}
            isSaving={isSaving}
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
        <div className="flex-1">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
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

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Icon name="Loader2" size={32} className="animate-spin text-primary" />
        </div>
      ) : filteredVersions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="FileSearch" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Версии не найдены</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredVersions.map((version, index) => (
            <Link key={version.id} to={`/documentation/${version.id}`} className="block">
              <Card
                className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer animate-scale-in"
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
                    <div className="flex items-center gap-3">
                      {isEditor && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleEdit(e, version)}>
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => handleDeleteClick(e, version.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Calendar" size={16} />
                        <span>{new Date(version.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
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
                          onClick={(e) => { e.preventDefault(); }}
                        >
                          <Icon name={getFileIcon(file.type)} size={18} />
                          <span className="font-normal">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({file.size})</span>
                          <Icon name="Download" size={16} />
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить версию?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Версия будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
