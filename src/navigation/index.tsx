import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import StringsScreen from "../screens/StringsScreen/StringsScreen";
import { useDatabaseStateSelector } from "../store/slices/dataBase/database.hooks";
import DBLoadingScreen from "../screens/DBLoadingScreen";
import { APP_TITLE, ELanguage } from "../common/constants";
import WordDetails from "../screens/WordDetailsScreen/WordDetails";
import NonVerbScreen from "../screens/NonVerbScreen/NonVerbScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { ready } = useDatabaseStateSelector();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        {ready ? (
          <>
            <Stack.Screen
              name={StringsScreen.path}
              component={StringsScreen}
              options={{
                title: APP_TITLE[ELanguage.en],
                headerStyle: {
                  backgroundColor: "#f7f7f7",
                },
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name={WordDetails.path}
              component={WordDetails}
              options={{
                title: APP_TITLE[ELanguage.en],
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: "#f7f7f7",
                },
                headerBackTitle: "fsdf",
              }}
            />
            <Stack.Screen
              name={NonVerbScreen.path}
              component={NonVerbScreen}
              options={{
                title: APP_TITLE[ELanguage.en],
                headerBackTitleVisible: false,
                headerStyle: {
                  backgroundColor: "#f7f7f7",
                },
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="DBLoadingScreen"
            component={DBLoadingScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
