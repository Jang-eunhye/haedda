import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    // 웹처럼 화면이 자체 헤더를 그리고, 화면 전환도 헤더에서 하므로 기본 헤더와 탭바는 숨긴다
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" options={{ title: '할일' }} />
    </Tabs>
  );
}
