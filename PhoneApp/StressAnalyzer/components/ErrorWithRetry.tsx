import { Text, Button } from "react-native";
interface Props {
    errorText: string;
    retry: () => void;
}

export default function ErrorWithRetry({ errorText, retry: callback }: Props): JSX.Element {
    return (<>
        <Text>An error occured :(</Text>
        <Text>{errorText}</Text>
        <Button title="Retry" onPress={callback} />
    </>);
}