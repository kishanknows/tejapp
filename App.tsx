import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import Video from 'react-native-video';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

function App(): JSX.Element {
  const [result, seResult] = useState<DocumentPickerResponse>();
  const [loading, setLoading] = useState(false);

  return (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: 'powderblue',
        height: '100%',
      }}>
      {!result && (
        <Text style={{alignSelf: 'center'}}>choose a file to upload!</Text>
      )}
      {result && (
        <Video
          source={{uri: result.fileCopyUri!}}
          style={Styles.videoStyle}
          controls={true}
          repeat={true}
        />
      )}
      <View style={{flexDirection: 'row'}}>
        {result && (
          <TouchableOpacity
            style={Styles.customButtonStyle}
            onPress={() => {
              setLoading(true);
              const reference = storage().ref(result.name!);
              const task = reference.putFile(result.fileCopyUri!);
              task.then(res => {
                Alert.alert(
                  'file uploaded to bucket on :' + res.metadata.timeCreated,
                );
                setLoading(false);
              });
            }}>
            {loading ? (
              <ActivityIndicator size={'large'} color={'white'} />
            ) : (
              <Text style={{color: 'white', fontSize: 16}}>upload</Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={Styles.customButtonStyle}
          onPress={async () => {
            try {
              const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
              });
              seResult(pickerResult);
            } catch (e) {
              console.log('error');
            }
          }}>
          <Text style={{color: 'white', fontSize: 16}}>file pick</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  videoStyle: {
    height: 300,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 4,
    marginBottom: 10,
  },
  customButtonStyle: {
    flex: 1,
    backgroundColor: 'purple',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default App;
