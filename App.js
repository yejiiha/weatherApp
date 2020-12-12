import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "f3c59f07aa3c3d51508dd682e2c66808";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [temp, setTemp] = useState(null);
  const [condition, setCondition] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather,
      },
    } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    console.log(data);
    setIsLoading(false);
    setCondition(weather[0].main);
    setTemp(temp);
  };

  const getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't access your location", "Allow the location setting");
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Weather temp={Math.round(temp)} condition={condition} />
  );
}
