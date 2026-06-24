import { useMemo } from 'react';
import { Box, Text, Group, SimpleGrid, UnstyledButton } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import dayjs, { type Dayjs } from 'dayjs';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  currentMonth: Dayjs;
  onMonthChange: (month: Dayjs) => void;
  slotsData?: { date: string; hasSlots: boolean }[];
}

export function Calendar({ selectedDate, onDateSelect, currentMonth, onMonthChange, slotsData = [] }: CalendarProps) {

  const daysInMonth = useMemo(() => {
    const start = currentMonth.startOf('month');
    const end = currentMonth.endOf('month');
    const startDay = (start.day() + 6) % 7; // Mon-first grid
    const days: (dayjs.Dayjs | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    let day = start;
    while (day.isBefore(end) || day.isSame(end, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++) {
      days.push(null);
    }

    return days;
  }, [currentMonth]);

  const hasAvailableSlots = (date: dayjs.Dayjs) => {
    if (!slotsData.length) return true;
    return slotsData.some((s) => s.date === date.format('YYYY-MM-DD') && s.hasSlots);
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <UnstyledButton onClick={() => onMonthChange(currentMonth.subtract(1, 'month'))}>
          <ChevronLeft size={20} />
        </UnstyledButton>
        <Text fw={600}>{currentMonth.format('MMMM YYYY')}</Text>
        <UnstyledButton onClick={() => onMonthChange(currentMonth.add(1, 'month'))}>
          <ChevronRight size={20} />
        </UnstyledButton>
      </Group>

      <SimpleGrid cols={7} spacing={0}>
        {weekDays.map((day) => (
          <Box key={day} p="xs" style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed" fw={500}>
              {day}
            </Text>
          </Box>
        ))}

        {daysInMonth.map((day, idx) => {
          if (!day) {
            return <Box key={`empty-${idx}`} />;
          }

          const isSelected = selectedDate && day.isSame(selectedDate, 'day');
          const isToday = day.isSame(dayjs(), 'day');
          const isPast = day.isBefore(dayjs(), 'day');
          const hasSlots = hasAvailableSlots(day);

          return (
            <UnstyledButton
              key={day.format('YYYY-MM-DD')}
              onClick={() => !isPast && onDateSelect(day.toDate())}
              disabled={isPast}
              p="xs"
              style={{
                borderRadius: '8px',
                backgroundColor: isSelected ? '#F97316' : 'transparent',
                color: isSelected ? 'white' : isPast ? '#CBD5E1' : 'inherit',
                opacity: isPast ? 0.5 : 1,
                cursor: isPast ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Text
                size="sm"
                fw={isToday ? 700 : 400}
                style={{
                  color: isSelected ? 'white' : isPast ? '#CBD5E1' : 'inherit',
                }}
              >
                {day.format('D')}
              </Text>
              {!isPast && hasSlots && !isSelected && (
                <Box
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                    margin: '2px auto 0',
                  }}
                />
              )}
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}