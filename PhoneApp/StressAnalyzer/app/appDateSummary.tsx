import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";

export default function AppDateSummaryScreen(){
  const params = useLocalSearchParams<{ date: string, image: string, name: string }>();
  const navigation = useNavigation();
  const date = new Date(parseInt(params.date))
}