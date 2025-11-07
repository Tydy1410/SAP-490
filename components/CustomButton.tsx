import { Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = (props: any) => {
  const {
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
    gradientColors,
    icon,
    iconStyles,
  } = props;

  const ButtonContent = (
    <>
      {icon && (
        <Image
          source={icon}
          className={`${iconStyles}`}
          resizeMode="contain"
        />
      )}
      <Text className={`mx-auto ${textStyles}`}>{title}</Text>
    </>
  );

  return gradientColors ? (
    <LinearGradient
      colors={isLoading ? ["#d3d3d3", "#a9a9a9"] : gradientColors}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[{ borderRadius: 9999 }, isLoading && { opacity: 1 }]}
      className={`overflow-hidden ${containerStyles}`}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.5}
        className={`flex-1 justify-center items-center ${
          isLoading ? "opacity-40" : ""
        }`}
        disabled={isLoading}
      >
        {ButtonContent}
      </TouchableOpacity>
    </LinearGradient>
  ) : (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.5}
      className={`bg-secondary flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {ButtonContent}
    </TouchableOpacity>
  );
};

export default CustomButton;
