import { Box, Title, Text, Card, Stack, Button, Group, ThemeIcon } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Home, Calendar } from 'tabler-icons-react';

export function Confirmation() {
  const navigate = useNavigate();

  return (
    <Box
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card shadow="lg" padding="xl" radius="lg" w={500} style={{ backgroundColor: 'white' }}>
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius="xl" color="green" variant="light">
            <Check size={40} />
          </ThemeIcon>

          <Stack align="center" gap="xs">
            <Title order={2} ta="center">
              Бронирование успешно!
            </Title>
            <Text c="dimmed" ta="center" maw={400}>
              Ваша запись подтверждена. Мы отправили детали на ваш email.
            </Text>
          </Stack>

          <Group>
            <Button
              component={Link}
              to="/"
              variant="light"
              color="gray"
              leftSection={<Home size={18} />}
            >
              На главную
            </Button>
            <Button
              color="orange"
              leftSection={<Calendar size={18} />}
              onClick={() => navigate('/book')}
            >
              Новая запись
            </Button>
          </Group>
        </Stack>
      </Card>
    </Box>
  );
}