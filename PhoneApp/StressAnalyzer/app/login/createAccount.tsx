import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { register, login } from "@/helpers/Database";
import { ChillChaser } from '@/components/name';

export default function CreateAccountScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showWrongPasswords, setShowWrongPasswords] = useState(false)
    const [hidePassword, setHidePassword] = useState(true)
    const [submitActive, setSubmitActive] = useState(false)
    const [creatingUser, setCreatingUser] = useState(false)

    const toggleHidePassword = () => setHidePassword(!hidePassword)

    function validateEmail(email: string): boolean {
        return email.includes("@") && email.includes(".");
    }

    function validatePass(pass: string): boolean {
        if (pass == '') { return false; }
        else if (pass.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return false;
        }
        else if (pass.match(/[A-Z]/) == null) {
            setPasswordError("Password must have at least one uppercase character");//Slightly long message
            return false;
        }
        else if ([...pass.matchAll(/[A-z]|[0-9]/g)].length == pass.length) { //If we have list of non alphanumerics might be better
            setPasswordError("Password must have at least one non alphanumeric character");//Slightly long message
            return false;
        }
        else {
            setPasswordError("");
            return true;
        }
    }

    function passwordsMatch(pass: string, repPass: string): boolean {
        let equal: boolean = pass == repPass;
        let value: boolean = (pass != '' && repPass != '') && (!equal);
        setShowWrongPasswords(value);
        return equal;
    }

    function toggleSubmitButton(email: string, pass: string, repPass: string) {
        //We need params to mitigate the async updating, and we do not want short circuiting
        let passVal: boolean = validatePass(pass);
        let passMatch: boolean = passwordsMatch(pass, repPass);
        let emailVal: boolean = validateEmail(email);
        setSubmitActive(passVal && passMatch && emailVal);
        setSubmitActive(true);
    }

    async function onSubmit(submitActive: Boolean, creatingUser: Boolean) {
        if (submitActive && !creatingUser) {
            setCreatingUser(true);
            let success = await register(email, password);
            setCreatingUser(false);
            if (success.status == 200) {
                let success = await login(email, password);
                if (success) {
                    router.replace("../tabs/mainPage");
                } else {
                    setError("Account created but could not log in");
                }
            } else {
                let errors: any = success.errors;
                //All known possible errors
                let invalidEmail = errors.InvalidEmail;
                let passNeedsDigit = errors.PasswordRequiresDigit;
                let passNeedsLower = errors.asswordRequiresLower;
                let passNeedsNonAlphanumeric = errors.PasswordRequiresNonAlphanumeric;
                let passNeedsUnique = errors.PasswordRequiresUniqueChars;
                let passNeedsUpper = errors.PasswordRequiresUpper;
                let passTooShort = errors.PasswordTooShort;
                let duplicateEmail = errors.DuplicateEmail;
                if (invalidEmail) { setError("Invalid e-mail"); }
                else if (passNeedsDigit || passNeedsLower || passNeedsNonAlphanumeric || passNeedsUpper || passTooShort || passNeedsUnique) 
                    { setError("Password is not strong enough"); }
                else if (duplicateEmail) { setError("E-mail is already in use") }
                else { setError("Something went wrong"); };
            }
        }
    }

    return (
        <View style={styles.container}>
            <ChillChaser></ChillChaser>
            {error != "" && <Text style={styles.error}> {error} </Text>}
            <View style={styles.textboxContainer}>
                <Text style={styles.descriptiveText}>E-mail</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        inputMode='email' autoComplete={'email'} style={styles.inputField}
                        autoCapitalize='none'
                        value={email}
                        onChangeText={(email: string) => setEmail(email)}
                    />
                </View>
            </View>

            <View style={styles.textboxContainer}>
                <Text style={styles.descriptiveText}>Password</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        secureTextEntry={hidePassword}
                        style={styles.inputField}
                        value={password}
                        autoCapitalize='none'
                        onChangeText={
                            (newPassword: string) => {
                                setPassword(newPassword)
                                toggleSubmitButton(email, newPassword, repeatPassword)
                            }}
                    />
                    <MaterialCommunityIcons
                        name={hidePassword ? 'eye' : 'eye-off'}
                        style={styles.eye}
                        size={24}
                        onPress={toggleHidePassword}
                    />
                </View>
                {passwordError != "" && <Text style={(styles.descriptiveText, { color: 'red' })}> {passwordError} </Text>}
            </View>
            <View style={styles.textboxContainer}>

                <Text style={styles.descriptiveText}>Repeat Password</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        autoCapitalize='none'
                        secureTextEntry={hidePassword}
                        style={styles.inputField}
                        value={repeatPassword}
                        onChangeText={(newRepeatPassword: string) => {
                            setRepeatPassword(newRepeatPassword)
                            toggleSubmitButton(email, password, newRepeatPassword)
                        }}
                    />
                </View>
                {showWrongPasswords && <Text style={(styles.error, { color: 'red' })}> Passwords do not match</Text>}
            </View>

            <View style={styles.separator} />
            <Pressable
                style={submitActive ? styles.button : styles.disabledButton}
                onPress={() => { onSubmit(submitActive, creatingUser) }}>
                <Text style={styles.buttonText}> Create account </Text>
            </Pressable>
        </View>
    );
}