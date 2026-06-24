import { Box, Title, Text, SimpleGrid, Stack, Skeleton, Card, Group, Avatar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useOwner } from '../hooks/useOwner';
import { useEventTypes } from '../hooks/useEventTypes';
import { EventTypeCard } from '../components/booking/EventTypeCard';

export function Catalog() {
  const navigate = useNavigate();
  const { data: owner, isLoading: isOwnerLoading } = useOwner();
  const { data: eventTypes, isLoading: isEventTypesLoading } = useEventTypes();

  return (
    <Box>
      <Card shadow="sm" padding="lg" radius="md" mb="xl" style={{ backgroundColor: 'white' }}>
        {isOwnerLoading ? (
          <Group>
            <Skeleton circle height={60} />
            <Stack gap="xs" style={{ flex: 1 }}>
              <Skeleton height={20} width={200} />
              <Skeleton height={16} width={300} />
            </Stack>
          </Group>
        ) : owner ? (
          <Group>
            <Avatar size={60} radius="md" color="orange">
              {owner.name.charAt(0)}
            </Avatar>
            <Stack gap={4}>
              <Title order={2}>{owner.name}</Title>
              <Text c="dimmed">{owner.title}</Text>
            </Stack>
          </Group>
        ) : null}
      </Card>

      <Title order={3} mb="md">
        Доступные услуги
      </Title>

      {isEventTypesLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={160} radius="md" />
          ))}
        </SimpleGrid>
      ) : eventTypes && eventTypes.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {eventTypes.map((eventType) => (
            <EventTypeCard
              key={eventType.id}
              eventType={eventType}
              onClick={() => navigate(`/book/${eventType.id}`)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Card shadow="sm" padding="xl" radius="md" style={{ backgroundColor: '#F8FAFC' }}>
          <Text c="dimmed" ta="center">
            Нет доступных услуг
          </Text>
        </Card>
      )}
    </Box>
  );
}