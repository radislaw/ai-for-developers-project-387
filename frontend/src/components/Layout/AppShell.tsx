import { AppShell, Group, Title, Text, Stack, NavLink } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Settings } from 'tabler-icons-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppShellProps) {
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm' }}
      padding="md"
      styles={{
        main: {
          backgroundColor: '#F8FAFC',
        },
      }}
    >
      <AppShell.Header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Group gap="xs">
              <Calendar size={28} color="#F97316" />
              <Title order={3} c="dark.8">
                Booking App
              </Title>
            </Group>
          </Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ backgroundColor: 'white', borderRight: '1px solid #E2E8F0' }}>
        <Stack gap="xs">
          <NavLink
            component={Link}
            to="/book"
            label="Записаться"
            leftSection={<Calendar size={20} />}
            active={location.pathname.startsWith('/book')}
            color="orange"
            variant="light"
            style={{ borderRadius: '8px' }}
          />
          <NavLink
            component={Link}
            to="/admin"
            label="Админка"
            leftSection={<Settings size={20} />}
            active={location.pathname.startsWith('/admin')}
            color="orange"
            variant="light"
            style={{ borderRadius: '8px' }}
          />
        </Stack>
        <Text c="dimmed" size="xs" mt="auto" pt="md">
          v1.0.0
        </Text>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}