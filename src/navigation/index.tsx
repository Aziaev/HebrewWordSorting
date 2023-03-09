import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../common/constants/Colors";
import StringsScreen from "../screens/StringsScreen/StringsScreen";
import { useDatabaseStateSelector } from "../store/slices/dataBase/database.hooks";
import DBLoadingScreen from "../screens/DBLoadingScreen";
import { APP_TITLE, ELanguage } from "../common/constants";
import BottomBarButtons from "../common/components/BottomBarButtons";
import VerbTablesScreen from "../screens/VerbTablesScreen/VerbTablesScreen";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { ready } = useDatabaseStateSelector();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {ready ? (
          <>
            <Stack.Screen
              name="StringsScreen"
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
              name="VerbTablesScreen"
              component={VerbTablesScreen}
              // @ts-expect-error
              options={({ navigation }) => ({
                headerLeftt: () => (
                  <Pressable
                    onPress={() => navigation.navigate("StringsScreen")}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.5 : 1,
                    })}
                  >
                    <AntDesign
                      name="left"
                      size={24}
                      color={Colors.accentColor}
                      style={{ marginLeft: 20 }}
                    />
                  </Pressable>
                ),
              })}
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

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Strings"
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.grey3,
      }}
    >
      <BottomTab.Screen
        name="Strings"
        component={StringsScreen}
        options={({ navigation }) => ({
          title: APP_TITLE[ELanguage.en],
          tabBarLabel: "Поиск",
          tabBarButton: BottomBarButtons,
          tabBarHideOnKeyboard: false,
          headerStyle: {
            backgroundColor: "#f7f7f7",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            textAlign: "center",
            justifyContent: "center",
            color: Colors.tint,
          },
        })}
      />
    </BottomTab.Navigator>
  );
}
