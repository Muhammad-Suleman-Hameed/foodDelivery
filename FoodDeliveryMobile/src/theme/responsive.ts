import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

export const hp = (percentage: string | number): number => {
  return heightPercentageToDP(percentage);
};

export const wp = (percentage: string | number): number => {
  return widthPercentageToDP(percentage);
};
