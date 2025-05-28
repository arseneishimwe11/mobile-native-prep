import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";

// Import Screens
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CreateExpenseScreen from "../screens/CreateExpenseScreen";
import EditExpenseScreen from "../screens/EditExpenseScreen";
import ExpenseDetailScreen from "../screens/ExpenseDetailScreen";
import AllExpensesScreen from "../screens/AllExpensesScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#f7fafc" },
        }}
      >
        {!isLoggedIn ? (
          // Auth Stack
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animationTypeForReplace: "pop",
            }}
          />
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="CreateExpense"
              component={CreateExpenseScreen}
              options={{
                presentation: "modal",
                animationTypeForReplace: "push",
              }}
            />
            <Stack.Screen
              name="EditExpense"
              component={EditExpenseScreen}
              options={{
                presentation: "modal",
                animationTypeForReplace: "push",
              }}
            />
            <Stack.Screen
              name="ExpenseDetail"
              component={ExpenseDetailScreen}
              options={{
                presentation: "card",
              }}
            />
            <Stack.Screen
              name="AllExpenses"
              component={AllExpensesScreen}
              options={{
                presentation: "card",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
