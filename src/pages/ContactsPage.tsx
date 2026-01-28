import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function ContactsPage() {
  const contacts = [
    {
      icon: 'Mail',
      title: 'Email',
      value: 'support@docsystem.ru',
      action: () => window.open('mailto:support@docsystem.ru'),
    },
    {
      icon: 'Phone',
      title: 'Телефон',
      value: '+7 (495) 123-45-67',
      action: () => window.open('tel:+74951234567'),
    },
    {
      icon: 'MessageCircle',
      title: 'Telegram',
      value: '@docsystem_support',
      action: () => window.open('https://t.me/docsystem_support'),
    },
    {
      icon: 'Clock',
      title: 'Часы работы',
      value: 'Пн-Пт: 9:00 - 18:00',
      action: null,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-heading font-bold text-primary mb-2">Контакты</h1>
        <p className="text-lg text-muted-foreground">Свяжитесь с нами любым удобным способом</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MapPin" size={24} className="text-primary" />
                Наш офис
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">ул. Пушкина, 15</p>
              <p className="text-muted-foreground mb-6">
                Приходите к нам в офис для личной консультации или демонстрации системы
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(
                    'https://yandex.ru/maps/?text=ул.+Пушкина,+15',
                    '_blank'
                  )
                }
              >
                <Icon name="Navigation" size={18} className="mr-2" />
                Построить маршрут
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
                      <Icon name={contact.icon as any} size={24} className="text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{contact.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{contact.value}</p>
                    {contact.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={contact.action}
                        className="text-primary hover:text-primary"
                      >
                        Связаться
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="animate-scale-in">
          <Card className="h-full">
            <CardContent className="p-0 h-full min-h-[500px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.620393,55.753215&z=15&l=map&pt=37.620393,55.753215,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                className="rounded-lg"
                title="Карта"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8 bg-accent/30 border-primary/20 animate-fade-in">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-heading font-bold mb-4">Остались вопросы?</h2>
            <p className="text-muted-foreground mb-6">
              Наша служба поддержки готова помочь вам с любыми вопросами по использованию системы,
              документации и интеграции
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.open('mailto:support@docsystem.ru')}>
                <Icon name="Mail" size={20} className="mr-2" />
                Написать в поддержку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://t.me/docsystem_support')}
              >
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Telegram чат
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}