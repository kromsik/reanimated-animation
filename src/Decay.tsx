import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Constants from "expo-constants";

import { onGestureEvent } from "react-native-redash";
import { Box, BOX_HEIGHT, BOX_WIDTH } from "./Box";

const {
  Clock,
  Value,
  diffClamp,
  cond,
  set,
  eq,
  add,
  decay: reDecay,
  clockRunning,
  startClock,
  stopClock,
  block,
  and,
  not
} = Animated;

const { width, height } = Dimensions.get("window");

const containerWidth = width;
const containerHeight = height - Constants.statusBarHeight;
const offsetX = new Value((containerWidth - BOX_WIDTH) / 2);
const offsetY = new Value((containerHeight - BOX_HEIGHT) / 2);

interface WithDecayProps {
  value: Animated.Adaptable<number>;
  velocity: Animated.Adaptable<number>;
  state: Animated.Value<State>;
  offset?: Animated.Value<number>;
  deceleration?: number;
}

const withDecay = (config: WithDecayProps) => {
  const { value, velocity, state, offset, deceleration } = {
    offset: new Value(0),
    deceleration: 0.998,
    ...config
  };
  const clock = new Clock();
  const decayState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const decayAnimationStarted = eq(state, State.END);
  const isDecayInterrupted = and(eq(state, State.BEGAN), clockRunning(clock));
  const finishDecay = [set(offset, decayState.position), stopClock(clock)];
  return block([
    cond(isDecayInterrupted, finishDecay),
    cond(
      and(decayAnimationStarted, not(isDecayInterrupted)),
      // animation started
      [
        cond(and(not(clockRunning(clock)), not(decayState.finished)), [
          set(decayState.velocity, velocity),
          set(decayState.time, 0),
          startClock(clock)
        ]),
        reDecay(clock, decayState, { deceleration }),
        cond(decayState.finished, finishDecay)
      ],
      // animation finished
      [
        set(decayState.finished, 0),
        set(decayState.position, add(offset, value))
      ]
    ),
    decayState.position
  ]);
};

const Animation = () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);

  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY
  });

  const translateX = diffClamp(
    withDecay({
      value: translationX,
      velocity: velocityX,
      state,
      offset: offsetX
    }),
    0,
    containerWidth - BOX_WIDTH
  );
  const translateY = diffClamp(
    withDecay({
      value: translationY,
      velocity: velocityY,
      state,
      offset: offsetY
    }),
    0,
    containerHeight - BOX_HEIGHT
  );
  return (
    <View style={[styles.container, StyleSheet.absoluteFillObject]}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            transform: [{ translateX }, { translateY }]
          }}
        >
          <Box />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export { Animation };
