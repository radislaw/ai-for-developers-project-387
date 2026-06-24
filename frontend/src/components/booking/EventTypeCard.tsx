import { Card, Text, Badge, Group, Stack } from '@mantine/core';
import { Clock } from 'tabler-icons-react';
import type { EventType } from '../../types';

interface EventTypeCardProps {
  eventType: EventType;
  onClick: () => void;
}

export function EventTypeCard({ eventType, onClick }: EventTypeCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
      }}
    >
      <Stack gap="sm">
        <Text fw={600} size="lg">
          {eventType.title}
        </Text>
        <Text c="dimmed" size="sm">
          {eventType.description}
        </Text>
        <Group gap="xs" mt="xs">
          <Badge
            variant="light"
            color="orange"
            leftSection={<Clock size={14} />}
          >
            {eventType.durationMinutes} мин
          </Badge>
        </Group>
      </Stack>
    </Card>
  );
}