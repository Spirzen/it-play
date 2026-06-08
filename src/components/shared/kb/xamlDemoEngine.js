/** Генерация XAML и макет для демо WPF-подобного UI. */

export const XAML_PRESETS = [
  {
    id: 'hello',
    label: 'Привет, мир',
    title: 'Пример XAML',
    text: 'Привет, мир!',
    fontSize: 24,
    layout: 'center',
    showButton: false,
    buttonText: 'OK',
  },
  {
    id: 'form',
    label: 'Форма входа',
    title: 'Вход',
    text: 'Введите учётные данные',
    fontSize: 16,
    layout: 'stack',
    showButton: true,
    buttonText: 'Войти',
  },
  {
    id: 'dashboard',
    label: 'Панель',
    title: 'Дашборд',
    text: '3 активных сервиса',
    fontSize: 18,
    layout: 'grid',
    showButton: true,
    buttonText: 'Обновить',
  },
];

export function buildXaml(config) {
  const align =
    config.layout === 'center'
      ? 'HorizontalAlignment="Center" VerticalAlignment="Center"'
      : 'HorizontalAlignment="Stretch" VerticalAlignment="Top" Margin="12"';

  const children = [
    `        <TextBlock Text="${escapeAttr(config.text)}" FontSize="${config.fontSize}" ${align}/>`,
  ];
  if (config.showButton) {
    children.push(
      `        <Button Content="${escapeAttr(config.buttonText)}" Margin="0,12,0,0" Padding="12,6"/>`,
    );
  }

  const gridContent =
    config.layout === 'grid'
      ? `    <Grid Margin="16">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="*"/>
      </Grid.RowDefinitions>
      <TextBlock Grid.Row="0" Text="${escapeAttr(config.title)}" FontSize="20" FontWeight="Bold"/>
      <StackPanel Grid.Row="1" VerticalAlignment="Center">
${children.join('\n')}
      </StackPanel>
    </Grid>`
      : `    <Grid>
${children.join('\n')}
    </Grid>`;

  return `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="${escapeAttr(config.title)}" Height="300" Width="400">
${config.layout === 'stack' ? `    <StackPanel Margin="24">\n${children.join('\n')}\n    </StackPanel>` : gridContent}
</Window>`;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}
