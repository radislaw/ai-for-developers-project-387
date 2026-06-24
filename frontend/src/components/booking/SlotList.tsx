import { ScrollArea, Stack, UnstyledButton, Text, Badge, Group } from '@mantine/core';
import { Clock } from 'tabler-icons-react';
import dayjs from 'dayjs';
import type { Slot } from '../../types';

interface SlotListProps {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSlotSelect: (slot: Slot) => void;
}

export function SlotList({ slots, selectedSlot, onSlotSelect }: SlotListProps) {
  if (slots.length === 0) {
    return (
      <Stack align="center" py="xl">
        <Text c="dimmed">Нет доступных слотов на этот день</Text>
      </Stack>
    );
  }

  return (
    <ScrollArea h={300}>
      <Stack gap="xs">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.startAt === slot.startAt;
          const startTime = dayjs(slot.startAt).format('HH:mm');
          const endTime = dayjs(slot.endAt).format('HH:mm');

          return (
            <UnstyledButton
              key={slot.startAt}
              onClick={() => slot.available && onSlotSelect(slot)}
              disabled={!slot.available}
              p="sm"
              style={{
                borderRadius: '8px',
                border: isSelected ? '2px solid #F97316' : '1px solid #E2E8F0',
                backgroundColor: isSelected ? '#FFF7ED' : slot.available ? 'white' : '#F1F5F9',
                opacity: slot.available ? 1 : 0.6,
                cursor: slot.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              <Group justify="space-between">
                <Group gap="xs">
                  <Clock size={16} color={slot.available ? '#F97316' : '#94A3B8'} />
                  <Text fw={500} style={{ textDecoration: slot.available ? 'none' : 'line-through' }}>
                    {startTime}
                  </Text>
                  <Text c="dimmed">—</Text>
                  <Text c="dimmed" style={{ textDecoration: slot.available ? 'none' : 'line-through' }}>
                    {endTime}
                  </Text>
                </Group>
                {slot.available ? (
                  <Badge variant="light" color="green" size="sm">
                    Свободно
                  </Badge>
                ) : (
                  <Badge variant="light" color="gray" size="sm">
                    Занято
                  </Badge>
                )}
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>
    </ScrollArea>
  );
}