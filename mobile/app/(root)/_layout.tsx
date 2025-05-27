import {useUser} from '@clerk/clerk-expo'
import {Stack} from 'expo-router/stack'
import {Redirect} from 'expo-router'

export default function RootLayout() {
    const { isSignedIn } = useUser()

    if (!isSignedIn) {
        return <Redirect href='/sign-in' />
    }

    return <Stack />
}