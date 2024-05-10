import { Text, Button } from "react-native";
import { StyleSheet } from 'react-native';
interface Props {
    errorText: string;
    retry: () => void;
}

export default function ErrorWithRetry({ errorText, retry: callback }: Props): JSX.Element {
    return (<>
        <Text style={styles.whiteText}>An error occured :(</Text>
        <Text style={styles.whiteText}>{errorText}</Text>
        <Button title="Retry" onPress={callback} />
    </>);
}

const styles = StyleSheet.create({
    whiteText: {
        color: 'white'
    }
});
