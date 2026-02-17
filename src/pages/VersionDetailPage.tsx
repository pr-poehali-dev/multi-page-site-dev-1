import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { versionsData, getTypeColor, getTypeLabel, getFileIcon } from '@/data/versions';

export default function VersionDetailPage() {
  const { id } = useParams();
  const version = versionsData.find((v) => v.id === Number(id));

  if (!version) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Icon name="FileQuestion" size={64} className="mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-heading font-bold mb-2">Версия не найдена</h1>
        <p className="text-muted-foreground mb-6">Запрашиваемая версия не существует</p>
        <Link to="/documentation">
          <Button>
            <Icon name="ArrowLeft" size={18} />
            Вернуться к документации
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/documentation"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <Icon name="ArrowLeft" size={18} />
        Назад к документации
      </Link>

      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-heading font-bold text-primary">v{version.version}</div>
            <Badge className={getTypeColor(version.type)}>{getTypeLabel(version.type)}</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{new Date(version.date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold mb-3">{version.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{version.description}</p>

        {version.fullDescription && (
          <Card className="mb-6 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={20} />
                Подробное описание
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-line">{version.fullDescription}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="ListChecks" size={20} />
              Список изменений
            </CardTitle>
            <CardDescription>Все изменения в данной версии</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {version.changes.map((change, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Icon name="Check" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Paperclip" size={20} />
              Файлы документации
            </CardTitle>
            <CardDescription>Скачайте необходимые документы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {version.files.map((file, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="flex items-center gap-3 justify-start h-auto py-3 px-4 hover:bg-accent"
                  onClick={() => console.log('Скачать', file.name)}
                >
                  <Icon name={getFileIcon(file.type)} size={22} className="text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{file.size}</div>
                  </div>
                  <Icon name="Download" size={18} className="ml-auto" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}