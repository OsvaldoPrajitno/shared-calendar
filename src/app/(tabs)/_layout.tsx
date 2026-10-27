import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={theme}
      backgroundColor="#3d3d3d"
      indicatorColor="rgba(255, 0, 0, 0.2)"
      rippleColor="rgba(100, 0, 0, 0.4)"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home"/>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about">
        <NativeTabs.Trigger.Icon sf={{ default: 'info', selected: 'house.fill' }} md="info"/>
        <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const theme = "red"