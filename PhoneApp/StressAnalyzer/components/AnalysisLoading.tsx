import { ActivityIndicator, Text } from "react-native";

export default function AnalysisLoading(): JSX.Element {
  return <>
    <ActivityIndicator size="large" />
    <Text style={{ textAlign: 'center', color: 'white' }}>Crunching some numbers...</Text>
  </>;
}