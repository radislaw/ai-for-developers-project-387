import { Table, Text, Badge, Group, Card, Stack, Skeleton } from '@mantine/core';
import { Mail, User, Clock } from 'tabler-icons-react';
import dayjs from 'dayjs';
import type { Booking } from '../../types';

interface UpcomingListProps {
  bookings: Booking[] | undefined;
  isLoading: boolean;
  eventTypes: { [key: string]: string };
}

export function UpcomingList({ bookings, isLoading, eventTypes }: UpcomingListProps) {
  if (isLoading) {
    return (
      <Stack gap="md">
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
      </Stack>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#F8FAFC' }}>
        <Text c="dimmed" ta="center">
          Нет предстоящих бронирований
        </Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Услуга</Table.Th>
            <Table.Th>Гость</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Дата и время</Table.Th>
            <Table.Th>Статус</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {bookings.map((booking) => {
            const startAt = dayjs(booking.startAt);
            const isPast = startAt.isBefore(dayjs());

            return (
              <Table.Tr key={booking.id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {eventTypes[booking.eventTypeId] || booking.eventTypeId}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <User size={16} color="#64748B" />
                    <Text size="sm">{booking.guestName}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Mail size={16} color="#64748B" />
                    <Text size="sm">{booking.guestEmail}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Clock size={16} color="#64748B" />
                    <Text size="sm">
                      {startAt.format('DD MMM YYYY, HH:mm')}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge color={isPast ? 'gray' : 'green'} variant="light">
                    {isPast ? 'Прошедшее' : 'Предстоящее'}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Card>
  );
}