import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Version, VersionFile } from '@/data/versions';

interface VersionEditorProps {
  version?: Version | null;
  onSave: (data: Partial<Version>) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function VersionEditor({ version, onSave, onCancel, isSaving }: VersionEditorProps) {
  const [formVersion, setFormVersion] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'major' | 'minor' | 'patch'>('minor');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [changes, setChanges] = useState<string[]>(['']);
  const [files, setFiles] = useState<VersionFile[]>([]);

  useEffect(() => {
    if (version) {
      setFormVersion(version.version);
      setDate(version.date);
      setType(version.type);
      setTitle(version.title);
      setDescription(version.description);
      setFullDescription(version.fullDescription || '');
      setChanges(version.changes.length > 0 ? version.changes : ['']);
      setFiles(version.files || []);
    } else {
      setFormVersion('');
      setDate(new Date().toISOString().split('T')[0]);
      setType('minor');
      setTitle('');
      setDescription('');
      setFullDescription('');
      setChanges(['']);
      setFiles([]);
    }
  }, [version]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      version: formVersion,
      date,
      type,
      title,
      description,
      fullDescription: fullDescription || undefined,
      changes: changes.filter(c => c.trim()),
      files,
    });
  };

  const addChange = () => setChanges([...changes, '']);
  const removeChange = (idx: number) => setChanges(changes.filter((_, i) => i !== idx));
  const updateChange = (idx: number, val: string) => {
    const updated = [...changes];
    updated[idx] = val;
    setChanges(updated);
  };

  const addFile = () => setFiles([...files, { name: '', type: 'pdf', size: '' }]);
  const removeFile = (idx: number) => setFiles(files.filter((_, i) => i !== idx));
  const updateFile = (idx: number, field: keyof VersionFile, val: string) => {
    const updated = [...files];
    updated[idx] = { ...updated[idx], [field]: val };
    setFiles(updated);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name={version ? 'Pencil' : 'Plus'} size={20} />
          {version ? 'Редактирование версии' : 'Новая версия'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Номер версии *</Label>
              <Input value={formVersion} onChange={e => setFormVersion(e.target.value)} placeholder="3.2.1" required />
            </div>
            <div>
              <Label>Дата *</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div>
              <Label>Тип обновления *</Label>
              <Select value={type} onValueChange={v => setType(v as 'major' | 'minor' | 'patch')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">Крупное</SelectItem>
                  <SelectItem value="minor">Среднее</SelectItem>
                  <SelectItem value="patch">Исправление</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Заголовок *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название обновления" required />
          </div>

          <div>
            <Label>Краткое описание *</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Краткое описание для списка" required />
          </div>

          <div>
            <Label>Подробное описание</Label>
            <Textarea value={fullDescription} onChange={e => setFullDescription(e.target.value)} placeholder="Подробное описание обновления..." rows={5} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Список изменений</Label>
              <Button type="button" variant="outline" size="sm" onClick={addChange}>
                <Icon name="Plus" size={14} />
                Добавить
              </Button>
            </div>
            <div className="space-y-2">
              {changes.map((change, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={change}
                    onChange={e => updateChange(idx, e.target.value)}
                    placeholder="Описание изменения"
                  />
                  {changes.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeChange(idx)}>
                      <Icon name="X" size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Файлы документации</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFile}>
                <Icon name="Plus" size={14} />
                Добавить файл
              </Button>
            </div>
            <div className="space-y-3">
              {files.map((file, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input value={file.name} onChange={e => updateFile(idx, 'name', e.target.value)} placeholder="Название файла" />
                  </div>
                  <div className="w-28">
                    <Select value={file.type} onValueChange={v => updateFile(idx, 'type', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="xls">XLS</SelectItem>
                        <SelectItem value="doc">DOC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28">
                    <Input value={file.size} onChange={e => updateFile(idx, 'size', e.target.value)} placeholder="Размер" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(idx)}>
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Save" size={16} />}
              {version ? 'Сохранить' : 'Создать'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
