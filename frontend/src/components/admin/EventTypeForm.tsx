import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, TextInput, NumberInput, Button, Text, Card } from '@mantine/core';
import { useCreateEventType } from '../../hooks/useEventTypes';

const eventTypeSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  durationMinutes: z.number().min(15, 'Минимальная длительность 15 минут').max(480),
});

type EventTypeFormData = z.infer<typeof eventTypeSchema>;

export function EventTypeForm() {
  const createEventType = useCreateEventType();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EventTypeFormData>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      durationMinutes: 60,
    },
  });

  const onSubmit = (data: EventTypeFormData) => {
    createEventType.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: 'white' }}>
      <Stack gap="md">
        <Text fw={600} size="lg">
          Добавить услугу
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Название услуги"
              placeholder="Консультация"
              {...register('title')}
              error={errors.title?.message}
              required
            />

            <TextInput
              label="Описание"
              placeholder="Описание вашей услуги"
              {...register('description')}
              error={errors.description?.message}
              required
            />

            <Controller
              name="durationMinutes"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Длительность (минуты)"
                  min={15}
                  max={480}
                  step={15}
                  value={field.value}
                  onChange={(val) => field.onChange(typeof val === 'number' ? val : Number(val))}
                  onBlur={field.onBlur}
                  error={errors.durationMinutes?.message}
                  required
                />
              )}
            />

            <Button
              type="submit"
              color="orange"
              loading={createEventType.isPending}
              fullWidth
            >
              Создать услугу
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}