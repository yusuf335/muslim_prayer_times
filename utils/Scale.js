import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

//Guideline sizes are based on iphone 15 Pro max screen mobile device
const guidelineBaseWidth = 430;
const guidelineBaseHeight = 932;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
