import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '할일',
          headerTitle: 'Haedda',
        }}
      />
    </Tabs>
  );
}
