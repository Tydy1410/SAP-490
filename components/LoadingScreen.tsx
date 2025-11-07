import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoadingScreen() {
  // ✅ Animated values
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinValueInner = useRef(new Animated.Value(0)).current;

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ✅ Outer ring rotation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // ✅ Inner ring (reverse rotation)
    Animated.loop(
      Animated.timing(spinValueInner, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // ✅ Dots animation
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  // ✅ interpolation rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spinInner = spinValueInner.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <LinearGradient
      colors={["#0f172a", "#1e3a8a", "#1d4ed8", "#2563eb"]}
      style={styles.loadingContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.loadingContent}>
        {/* ✅ Outer Ring */}
        <Animated.View style={[styles.loadingRing, { transform: [{ rotate: spin }] }]}>
          {/* ✅ Inner Ring */}
          <Animated.View
            style={[styles.loadingRingInner, { transform: [{ rotate: spinInner }] }]}
          />
        </Animated.View>

        {/* ✅ Text + Dots */}
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loadingTitle}>FA25SAP11</Text>

          <View style={styles.loadingDots}>
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: dot1,
                  transform: [
                    {
                      scale: dot1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: dot2,
                  marginHorizontal: 8,
                  transform: [
                    {
                      scale: dot2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: dot3,
                  transform: [
                    {
                      scale: dot3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.loadingSubtitle}>Loading...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderTopColor: "white",
    borderRightColor: "rgba(255, 255, 255, 0.7)",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingRingInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 6,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderBottomColor: "white",
    borderLeftColor: "rgba(255, 255, 255, 0.7)",
  },
  loadingTextContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  loadingTitle: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  loadingDots: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  loadingSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "600",
  },
});
