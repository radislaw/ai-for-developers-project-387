import { Box, Title, SimpleGrid, Stack, Skeleton, Text, Paper, Group, ThemeIcon, Divider } from '@mantine/core';
import { Calendar, List, Clock } from 'tabler-icons-react';
import { useUpcomingBookings } from '../hooks/useBookings';
import { useEventTypes } from '../hooks/useEventTypes';
import { UpcomingList } from '../components/admin/UpcomingList';
import { EventTypeForm } from '../components/admin/EventTypeForm';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Group>
        <ThemeIcon color={color} variant="light" size="lg" radius="md">
          {icon}
        </ThemeIcon>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
            {label}
          </Text>
          <Text size="xl" fw={700} lh={1.2}>
            {value}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

export function Admin() {
  const { data: bookings, isLoading: isBookingsLoading } = useUpcomingBookings();
  const { data: eventTypes, isLoading: isEventTypesLoading } = useEventTypes();

  const eventTypeMap = eventTypes
    ? eventTypes.reduce((acc, et) => {
        acc[et.id] = et.title;
        return acc;
      }, {} as Record<string, string>)
    : {};

  const upcomingCount = bookings?.length ?? 0;
  const servicesCount = eventTypes?.length ?? 0;

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>Панель администратора</Title>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <StatCard icon={<List size={18} />} label="Предстоящих записей" value={isBookingsLoading ? '—' : upcomingCount} color="orange" />
        <StatCard icon={<Calendar size={18} />} label="Услуг" value={isEventTypesLoading ? '—' : servicesCount} color="blue" />
        <StatCard icon={<Clock size={18} />} label="Статус" value="Активен" color="green" />
      </SimpleGrid>

      <div>
        <Title order={3} size="h4" mb="md">
          Предстоящие бронирования
        </Title>
        {isBookingsLoading ? (
          <Stack gap="sm">
            <Skeleton height={48} radius="md" />
            <Skeleton height={48} radius="md" />
            <Skeleton height={48} radius="md" />
          </Stack>
        ) : (
          <UpcomingList bookings={bookings} isLoading={isBookingsLoading} eventTypes={eventTypeMap} />
        )}
      </div>

      <Divider />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <div>
          <Title order={3} size="h4" mb="md">
            Добавить услугу
          </Title>
          <EventTypeForm />
        </div>

        <div>
          <Title order={3} size="h4" mb="md">
            Существующие услуги {servicesCount > 0 && <Text component="span" c="dimmed" fw={400}>({servicesCount})</Text>}
          </Title>
          {isEventTypesLoading ? (
            <Stack gap="sm">
              <Skeleton height={72} radius="md" />
              <Skeleton height={72} radius="md" />
            </Stack>
          ) : !eventTypes || eventTypes.length === 0 ? (
            <Paper p="lg" radius="md" withBorder>
              <Text c="dimmed" ta="center" size="sm">Нет услуг</Text>
            </Paper>
          ) : (
            <Stack gap="sm">
              {eventTypes.map((et) => (
                <Paper key={et.id} p="md" radius="md" withBorder>
                  <Group justify="space-between" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Text fw={600} size="sm">{et.title}</Text>
                      <Text c="dimmed" size="xs" mt={2}>{et.description}</Text>
                    </div>
                    <Box style={{ flexShrink: 0 }}>
                      <Text size="xs" c="dimmed" ta="right">{et.durationMinutes} мин</Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </div>
      </SimpleGrid>
    </Stack>
  );
}
