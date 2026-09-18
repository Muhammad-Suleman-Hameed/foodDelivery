import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 420;

export type FontType =
  | 'Regular'
  | 'Medium'
  | 'SemiBold'
  | 'Bold'
  | 'ExtraBold'
  | 'Light'
  | 'Thin';

class Fonts {
  public static readonly regular: string = Platform.select({ ios: 'System', default: 'Roboto' });
  public static readonly medium: string = Platform.select({ ios: 'System', default: 'Roboto' });
  public static readonly semiBold: string = Platform.select({ ios: 'System', default: 'Roboto' });
  public static readonly bold: string = Platform.select({ ios: 'System', default: 'Roboto' });
  public static readonly extraBold: string = Platform.select({ ios: 'System', default: 'Roboto' });
  public static readonly light: string = Platform.select({ ios: 'System', default: 'Roboto' });
  public static readonly thin: string = Platform.select({ ios: 'System', default: 'Roboto' });

  public static normalize(size: number): number {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }

  public static getFontFamily(type: FontType): string {
    switch (type) {
      case 'Regular':
        return Fonts.regular;
      case 'Medium':
        return Fonts.medium;
      case 'SemiBold':
        return Fonts.semiBold;
      case 'Bold':
        return Fonts.bold;
      case 'ExtraBold':
        return Fonts.extraBold;
      case 'Light':
        return Fonts.light;
      case 'Thin':
        return Fonts.thin;
    }
  }
}

export default Fonts;
