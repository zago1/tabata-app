import React, { useEffect, useRef } from 'react';
import { Dimensions, Animated, Easing, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = width - 32;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRFUNFERENCE = RADIUS * 2 * Math.PI;

interface Props {
    time: number;
}

const styles = StyleSheet.create({
    timerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        position: 'absolute',
        fontSize: 72,
        color: 'white',
    }
})

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Counter: React.FC<Props> = ({ time }) => {
    const inputRef = useRef(null);
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const textAnimation = useRef(new Animated.Value(0)).current;
    const alpha = progressAnimation.interpolate({
        inputRange: [0, 1], 
        outputRange: [0, Math.PI * 2],
    });
    const dashOffset = Animated.multiply(alpha, RADIUS);

    const start = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(progressAnimation, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: time * 1000,
                    easing: Easing.linear,
                }),
                Animated.timing(textAnimation, {
                    toValue: 0,
                    useNativeDriver: true,
                    duration: time * 1000,
                }),
            ]),
            Animated.delay(500),
        ]).start(() => {
            progressAnimation.setValue(0);
            textAnimation.setValue(time);
        })
    }

    useEffect(() => {
        const listener = textAnimation.addListener(({value}) => {
            inputRef?.current?.setNativeProps({
                text: Math.ceil(value).toString(),
            })
        });

        return () => {
            textAnimation.removeListener(listener);
        }
    }, []);

    return (
        <TouchableOpacity style={styles.timerContainer} onPress={start}>
            <TextInput 
                ref={inputRef}
                style={styles.timerText} 
                defaultValue={time.toString()}
            />
            <Svg width={SIZE} height={SIZE}>
                <Circle 
                    stroke="rgba(255, 255, 255, 0.3)"
                    fill="none"
                    cy={SIZE/2}
                    cx={SIZE/2}
                    r={RADIUS}
                    strokeWidth={1}
                />
                <AnimatedCircle 
                    stroke="#F1F1F1"
                    fill="none"
                    cy={SIZE/2}
                    cx={SIZE/2}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${CIRFUNFERENCE} ${CIRFUNFERENCE}`}
                    strokeDashoffset={dashOffset}
                />
            </Svg>
        </TouchableOpacity>
    );
}

export default Counter;