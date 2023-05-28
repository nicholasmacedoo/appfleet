import 'styled-components/native'
import theme from '../theme'

type CustomType = typeof theme

declare module 'styled-components/native' {
  export interface DefaultTheme extends CustomType {}
}