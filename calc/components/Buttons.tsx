import { Styles } from "@/styles/GlobalStyles";
import { ThemeContext } from "@react-navigation/native";
import { useContext } from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
    onPress: () => void;
    title: string;
    isBlue?: boolean;
    isGray?: boolean;
}

export default function Button({title, onPress, isBlue, isGray}: ButtonProps) {
    const theme = useContext(ThemeContext);

    return (
        <TouchableOpacity
            style={
                
            }
    )
}