import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/auth.styles'
import WalletSvg from '@/assets/svg/wallet-svg'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      if(err.errors.length>0){
        setError(err.errors[0].message)
      }
    }
  }

  return (
    <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background}} behavior="padding">
    <View style={styles.container}>
    {/* <View style={styles.illustration}>
          <WalletSvg />
        </View> */}
      <Text style={styles.title}>Welcome back</Text>
      {
          error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError('')}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          )
        }
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        placeholderTextColor={COLORS.textLight}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        placeholderTextColor={COLORS.textLight}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
       <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/sign-up')}>
                  <Text style={styles.linkText}>Sign up</Text>
                </TouchableOpacity>
              </View>
    </View>
    </KeyboardAvoidingView>
  )
}