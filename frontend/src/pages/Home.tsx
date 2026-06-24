import { Box, Title, Text, Button, Card, SimpleGrid, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'tabler-icons-react';

export function Home() {
  return (
    <Box
      style={{
        minHeight: 'calc(100vh - 120px)',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #FFF7ED 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack align="center" gap="xl" maw={800} py={80}>
        <Stack align="center" gap="md">
          <Title order={1} ta="center" size="3rem" fw={800} lh={1.2}>
            Онлайн-запись к специалисту
          </Title>
          <Text c="dimmed" size="xl" ta="center" maw={600}>
            Простой и удобный способ забронировать время консультации
          </Text>
        </Stack>

        <Button
          component={Link}
          to="/book"
          size="xl"
          color="orange"
          radius="lg"
          styles={{
            root: {
              paddingLeft: '2.5rem',
              paddingRight: '2.5rem',
              height: '3.5rem',
              fontSize: '1.1rem',
            },
          }}
        >
          Записаться
        </Button>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="xl" w="100%">
          <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }}>
            <Stack align="center" gap="sm">
              <Calendar size={40} color="#F97316" />
              <Text fw={600}>Удобное расписание</Text>
              <Text c="dimmed" size="sm" ta="center">
                Выберите удобную дату и время из доступных слотов
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }}>
            <Stack align="center" gap="sm">
              <Clock size={40} color="#F97316" />
              <Text fw={600}>Мгновенное подтверждение</Text>
              <Text c="dimmed" size="sm" ta="center">
                Получите подтверждение бронирования сразу после записи
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }}>
            <Stack align="center" gap="sm">
              <User size={40} color="#F97316" />
              <Text fw={600}>Персональный подход</Text>
              <Text c="dimmed" size="sm" ta="center">
                Опишите ваши вопросы в заметках для лучшей подготовки
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}