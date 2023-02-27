import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/NotFoundScreen";
import StringsScreen from "../screens/StringsScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../../types";
import LinkingConfiguration from "./LinkingConfiguration";
import StringsModal from "../screens/StringsModal";
import NikudModal from "../screens/NikudModal";
import RootsModal from "../screens/RootsModal";
import TimesModal from "../screens/TimesModal";
import VerbsModal from "../screens/VerbsModal";
import { useDatabaseStateSelector } from "../store/slices/dataBase/database.hooks";
import DBLoadingScreen from "../screens/DBLoadingScreen";

export default function Navigation() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { ready } = useDatabaseStateSelector();
  return (
    <Stack.Navigator>
      {ready ? (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Nikud" component={NikudModal} />
            <Stack.Screen name="Roots" component={RootsModal} />
            <Stack.Screen name="Strings" component={StringsModal} />
            <Stack.Screen name="Times" component={TimesModal} />
            <Stack.Screen name="Verbs" component={VerbsModal} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen
          name="DBLoadingScreen"
          component={DBLoadingScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Strings"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="Strings"
        component={StringsScreen}
        options={({ navigation }: RootTabScreenProps<"Strings">) => ({
          title: "Сортировщик слов",
          tabBarLabel: "Поиск",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          // headerRight: () => (
          //   <Pressable
          //     onPress={() => navigation.navigate("Modal")}
          //     style={({ pressed }) => ({
          //       opacity: pressed ? 0.5 : 1,
          //     })}
          //   >
          //     <FontAwesome
          //       name="info-circle"
          //       size={25}
          //       color={Colors[colorScheme].text}
          //       style={{ marginRight: 15 }}
          //     />
          //   </Pressable>
          // ),
        })}
      />
      {/*<BottomTab.Screen*/}
      {/*  name="TabTwo"*/}
      {/*  component={TabTwoScreen}*/}
      {/*  options={{*/}
      {/*    title: "Tab Two",*/}
      {/*    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,*/}
      {/*  }}*/}
      {/*/>*/}
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}
