import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
import NotFoundScreen from "../screens/NotFoundScreen";
import StringsScreen from "../screens/StringsScreen/StringsScreen";
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
import { Pressable, StyleSheet } from "react-native";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../store/slices/strings/strings.hooks";
import { FLAGS_MAP } from "../constants";
import { Text } from "../common/components/Themed";

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
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
  const { lang } = useStringsStateSelector();
  const { toggleLanguage } = useStringsDispatchedActions();

  return (
    <BottomTab.Navigator
      initialRouteName="Strings"
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.tabIconDefault,
      }}
    >
      <BottomTab.Screen
        name="Strings"
        component={StringsScreen}
        options={({ navigation }: RootTabScreenProps<"Strings">) => ({
          title: "Сортировщик слов",
          tabBarLabel: "Поиск",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerStyle: {
            backgroundColor: "#f7f7f7",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            textAlign: "center",
            justifyContent: "center",
            color: Colors.tint,
          },
          headerRight: () => (
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text style={styles.flag}>{FLAGS_MAP[lang]}</Text>
            </Pressable>
          ),
          // headerLeft: () => (
          //   <Pressable
          //     onPress={() => navigation.navigate("Modal")}
          //     style={({ pressed }) => ({
          //       opacity: pressed ? 0.5 : 1,
          //     })}
          //   >
          //     <FontAwesome
          //       name="info-circle"
          //       size={25}
          //       color={Colors.accentColor}
          //       style={{ marginLeft: 15 }}
          //     />
          //   </Pressable>
          // ),
        })}
      />
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

const styles = StyleSheet.create({
  flag: {
    fontSize: 26,
    marginRight: 15,
  },
});
