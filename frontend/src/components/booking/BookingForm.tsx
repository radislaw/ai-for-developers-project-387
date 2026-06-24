import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, TextInput, Textarea, Button, Text } from '@mantine/core';
import type { Slot } from '../../types';
import dayjs from 'dayjs';

const bookingSchema = z.object({
  guestName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  guestEmail: z.string().email('Введите корректный email'),
  guestNotes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  slot: Slot;
  eventTypeTitle: string;
  onSubmit: (data: BookingFormData) => void;
  isLoading: boolean;
}

export function BookingForm({ slot, eventTypeTitle, onSubmit, isLoading }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const startTime = dayjs(slot.startAt).format('DD MMMM YYYY, HH:mm');

  return (
    <Stack gap="md">
      <Text fw={600} size="lg">
        Бронирование
      </Text>

      <Text c="dimmed" size="sm">
        Услуга: <Text span fw={500} c="dark">{eventTypeTitle}</Text>
      </Text>
      <Text c="dimmed" size="sm">
        Время: <Text span fw={500} c="dark">{startTime}</Text>
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Ваше имя"
            placeholder="Иван Иванов"
            {...register('guestName')}
            error={errors.guestName?.message}
            required
          />

          <TextInput
            label="Email"
            placeholder="ivan@example.com"
            type="email"
            {...register('guestEmail')}
            error={errors.guestEmail?.message}
            required
          />

          <Textarea
            label="Заметки (необязательно)"
            placeholder="Дополнительная информация"
            {...register('guestNotes')}
            rows={3}
          />

          <Button type="submit" color="orange" loading={isLoading} fullWidth mt="md">
            Забронировать
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}