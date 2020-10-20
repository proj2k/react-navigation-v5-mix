import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {useTheme} from '@react-navigation/native';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeScreen = ({navigation}) => {
  const {colors} = useTheme();

  const theme = useTheme();

  const [datePickerTargetFnc, setDatePickerTargetFnc] = useState(
    () => () => {},
  );
  const [datePickerValue, setDatePickerValue] = useState(moment().toDate());
  const [tnDe, setTnDe] = useState(moment().format('YYYY-MM-DD'));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [workCd, setWorkCd] = useState();
  const [attendTime, setAttendTime] = useState();
  const [lvffcTime, setLvffcTime] = useState();
  // const [value, onChangeText] = React.useState('Useless Placeholder');
  const handleDatePicker = (event, selectedDate) => {
    if (selectedDate) {
      setShow(Platform.OS === 'ios');
      if (mode === 'date') {
        datePickerTargetFnc(moment(selectedDate).format('YYYY-MM-DD'));
      } else if (mode === 'time') {
        datePickerTargetFnc(moment(selectedDate).format('HH:mm'));
      }
    }
  };
  const handleSave = () => {
    const head = {
      headers: {'Content-Type': 'application/json'},
    };

    axios
      .post(
        'http://10.0.2.2:8180/api/authenticate.do',
        {username: 'DOIT|10000', password: 'admin'},
        head,
      )
      .then(res => {
        console.log(res.data);
      });
    // axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
    //         .then(res => {
    //             console.log(res.data);
    //         })
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = (event, targetSetter) => {
    setDatePickerTargetFnc(() => targetSetter);
    showMode('date');
  };
  const showTimePicker = (event, targetSetter) => {
    setDatePickerTargetFnc(() => targetSetter);
    showMode('time');
  };

  // return (
  //   <View style={styles.container}>
  //     <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/>
  //     <Text style={{color: colors.text}}>Home Screen</Text>
  //   <Button
  //     title="Go to details screen"
  //     onPress={() => navigation.navigate("Details")}
  //   />
  //   </View>
  // );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>근무일자</Text>
        <View style={{width: '100%', paddingTop: 10, paddingBottom: 20}}>
          <TextInput
            style={{
              color: 'black',
              height: 40,
              borderWidth: 1,
              backgroundColor: 'white',
              paddingLeft: 10,
            }}
            onFocus={event => showDatePicker(event, setTnDe)}
            showSoftInputOnFocus={false}
            value={tnDe}
            keyboardType={'number-pad'}
          />
        </View>
        <Text style={styles.text}>구분</Text>
        <View
          style={{
            color: 'white',
            width: '100%',
            paddingTop: 10,
            paddingBottom: 20,
          }}>
          <Picker
            selectedValue={workCd}
            // style={{color: 'white', height: 50, width: 100}}
            onValueChange={v => {
              setWorkCd(v);
            }}
            style={styles.workCd}
            mode="dialog">
            <Picker.Item label="선택..." value="" />
            <Picker.Item label="정상근무" value="001" />
            <Picker.Item label="교육" value="007" />
            <Picker.Item label="출장" value="008" />
          </Picker>
        </View>
        <Text style={styles.text}>정상근무시간</Text>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 20,
          }}>
          <TextInput
            style={{
              color: 'white',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              width: '30%',
            }}
            onFocus={event => {
              showTimePicker(event, setAttendTime);
            }}
            showSoftInputOnFocus={false}
            value={attendTime}
            keyboardType={'number-pad'}
            autofocus={false}
          />
          <Text style={{color: 'white', paddingLeft: 10, paddingRight: 10}}>
            ~
          </Text>
          <TextInput
            style={{
              color: 'white',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              width: '30%',
            }}
            onFocus={event => {
              showTimePicker(event, setLvffcTime);
            }}
            showSoftInputOnFocus={false}
            value={lvffcTime}
            keyboardType={'number-pad'}
          />
        </View>
        <Text style={styles.text}>휴식 & 외출(비근로시간)</Text>
        <View
          style={{
            color: 'white',
            width: '100%',
            paddingTop: 10,
            paddingBottom: 20,
          }}>
          <Picker
            selectedValue={workCd}
            // style={{color: 'white', height: 50, width: 100}}
            onValueChange={v => {
              setWorkCd(v);
            }}
            style={styles.workCd}
            mode="dialog">
            <Picker.Item label="선택..." value="" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="20" value="20" />
            <Picker.Item label="30" value="30" />
            <Picker.Item label="40" value="40" />
            <Picker.Item label="50" value="50" />
            <Picker.Item label="60" value="60" />
          </Picker>
        </View>
        <View
          style={{
            color: 'white',
            width: '100%',
            paddingTop: 10,
            paddingBottom: 20,
          }}>
          <Button title="저장" onPress={handleSave} height="20px" />
        </View>
        <View style={{}}>
          <Text style={{...styles.text, alignSelf: 'flex-end'}}>
            기본: xxx시간 xxx분
          </Text>
          <Text style={{...styles.text, alignSelf: 'flex-end'}}>
            최대: xxx시간 xxx분
          </Text>
          <Text style={{...styles.text, alignSelf: 'flex-end'}}>
            누적: xxx시간 xxx분
          </Text>
        </View>
        <View>
          {show && datePickerTargetFnc && (
            <DateTimePicker
              testID="dateTimePicker"
              value={datePickerValue}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={handleDatePicker}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
