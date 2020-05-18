import { createContext } from 'react'
export type SizeType = 'small' | 'middle' | 'large' | undefined

const SizeContext = createContext<SizeType>(undefined)

export default SizeContext