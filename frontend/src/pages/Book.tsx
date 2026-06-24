import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Title, Text, Card, Stack, Grid, Skeleton, Group, Badge, Divider } from '@mantine/core';
import { Clock, Calendar as CalendarIcon } from 'tabler-icons-react';
import dayjs, { type Dayjs } from 'dayjs';
import { useEventType } from '../hooks/useEventTypes';
import { useSlots } from '../hooks/useSlots';
import { useCreateBooking } from '../hooks/useBookings';
import { Calendar } from '../components/booking/Calendar';
import { SlotList } from '../components/booking/SlotList';
import { BookingForm } from '../components/booking/BookingForm';
import type { Slot } from '../types';

type Step = 'select-date' | 'select-slot' | 'fill-form';

export function Book() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState<Step>('select-date');

  const { data: eventType, isLoading: isEventTypeLoading } = useEventType(eventTypeId || '');
  const createBooking = useCreateBooking();

  const monthStart = useMemo(() => currentMonth.startOf('month').toDate(), [currentMonth]);
  const monthEnd = useMemo(() => currentMonth.endOf('month').toDate(), [currentMonth]);

  const { data: slots, isLoading: isSlotsLoading } = useSlots(
    eventTypeId || '',
    monthStart.toISOString(),
    monthEnd.toISOString()
  );

  const filteredSlots = useMemo(() => {
    if (!selectedDate || !slots) return [];
    return slots.filter((slot) =>
      dayjs(slot.startAt).isSame(selectedDate, 'day')
    );
  }, [selectedDate, slots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('select-date');
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setStep('fill-form');
  };

  const handleBookingSubmit = (data: { guestName: string; guestEmail: string; guestNotes?: string }) => {
    if (!selectedSlot || !eventTypeId) return;

    createBooking.mutate(
      {
        eventTypeId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestNotes: data.guestNotes,
        slotStartAt: selectedSlot.startAt,
      },
      {
        onSuccess: () => {
          navigate(`/book/${eventTypeId}/confirm`);
        },
      }
    );
  };

  const slotsData = useMemo(() => {
    if (!slots) return [];
    const dateMap = new Map<string, boolean>();
    slots.forEach((slot) => {
      const date = dayjs(slot.startAt).format('YYYY-MM-DD');
      if (slot.available) {
        dateMap.set(date, true);
      }
    });
    return Array.from(dateMap.entries()).map(([date, hasSlots]) => ({ date, hasSlots }));
  }, [slots]);

  if (isEventTypeLoading) {
    return (
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Skeleton height={300} radius="md" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Skeleton height={300} radius="md" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Skeleton height={300} radius="md" />
        </Grid.Col>
      </Grid>
    );
  }

  if (!eventType) {
    return (
      <Card shadow="sm" padding="xl" radius="md">
        <Text c="dimmed" ta="center">Услуга не найдена</Text>
      </Card>
    );
  }

  return (
    <Grid gap="lg">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }} h="100%">
          <Stack gap="md">
            <Title order={3}>{eventType.title}</Title>
            <Text c="dimmed">{eventType.description}</Text>
            <Divider />
            <Group gap="xs">
              <Clock size={20} color="#F97316" />
              <Text size="sm">{eventType.durationMinutes} минут</Text>
            </Group>
            {selectedDate && (
              <>
                <Divider />
                <Group gap="xs">
                  <CalendarIcon size={20} color="#F97316" />
                  <Text size="sm" fw={500}>
                    {dayjs(selectedDate).format('DD MMMM YYYY')}
                  </Text>
                </Group>
              </>
            )}
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }}>
          <Title order={4} mb="md">
            Выберите дату
          </Title>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            slotsData={slotsData}
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }}>
          <Group justify="space-between" mb="md">
            <Title order={4}>Выберите время</Title>
            {selectedDate && (
              <Badge variant="light" color="orange">
                {dayjs(selectedDate).format('DD MMM')}
              </Badge>
            )}
          </Group>

          {!selectedDate ? (
            <Text c="dimmed" ta="center" py="xl">
              Сначала выберите дату
            </Text>
          ) : isSlotsLoading ? (
            <Stack gap="xs">
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
            </Stack>
          ) : step === 'fill-form' && selectedSlot ? (
            <BookingForm
              slot={selectedSlot}
              eventTypeTitle={eventType.title}
              onSubmit={handleBookingSubmit}
              isLoading={createBooking.isPending}
            />
          ) : (
            <SlotList
              slots={filteredSlots}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
            />
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
}