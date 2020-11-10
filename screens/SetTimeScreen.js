import React, {useState, useEffect} from 'react';
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
import axios from 'axios';
import {AuthContext} from '../components/context';
import { Alert } from 'react-native';
import { ProgressBar } from 'react-native-multicolor-progress-bar';

const HomeScreen = ({navigation}) => {

  const {getHeader, addGroupCode} = React.useContext(AuthContext);
  const head = getHeader();
  //console.log(head)
  
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
  const [workCdItem, setWorkCdItem] = useState([]);
  const [attendTime, setAttendTime] = useState(); 
  const [lvffcTime, setLvffcTime] = useState();
  const [nonWorkMin, setNonWorkMin] = useState(0);
  const [totWorkTimeValue, setTotWorkTime] = useState();
  const [baseWorkTimeValue, setBaseWorkTime] = useState();
  const [maxWorkTimeValue, setMaxWorkTime] = useState();
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

  useEffect(()=> {
    const getComboData = () => {
      axios
        .post(
        'http://10.0.2.2:8180/api/tna/work/retrieveCmmnComboCodes.do',
        {dataSet: addGroupCode({groupCode: 'TNA_CD', atrb2: 'N', atrb4: 'Y'})},
        head
      )
      .then((res) => {
        setWorkCdItem(res.data.codes);
      })
      .catch((error)=> {
        console.log('Connect Fail, Error Message: '+ error);
      });
    }

    const getTnaWorkTime = () => {
      axios
        .post(
        'http://10.0.2.2:8180/api/tna/work/retrieveTnaWorkTimeForMobile.do',
        /* {dataSet: {searchCmpnyCd: 'DOIT', searchEmplId: '16', tnaDe: '20201015'}}, */
        {dataSet: {tnaDe: moment(tnDe).format('YYYYMMDD')}},
        head
      )
      .then((res) => {
        setWorkCd(res.data.baseTime.workCd);

        if(res.data.baseTime.attendTime != null) {
          setAttendTime(res.data.baseTime.attendTime);
        }
        if(res.data.baseTime.lvffcTime != null) {
          setLvffcTime(res.data.baseTime.lvffcTime);
        }

        setTotWorkTime(res.data.totWorkTimeFormatted);
        setBaseWorkTime(res.data.baseWorkTimeFormatted);
        setMaxWorkTime(res.data.maxWorkTimeFormatted);
      })
      .catch((error)=> {
        console.log('Connect Fail, Error Message: '+ error);
      });
    }
    getComboData();
    getTnaWorkTime();
    }, []
  );


  const handleSave = () => {

    if(workCd === '0') {
      Alert.alert(
        "알림",
        "구분을 선택해 주십시오.",
        [{ text: "OK" }]
      )
      return;
    }
    if(attendTime === undefined || lvffcTime === undefined) {
      Alert.alert(
        "알림",
        "정상근무시간을 선택해 주십시오.",
        [{ text: "OK" }]
      )
      return;
    }
    
    axios
    .post(
      'http://10.0.2.2:8180/api/tna/work/saveTnaWorkTimeListForMobile.do',
      /* {dataSet: {searchCmpnyCd: 'DOIT', searchEmplId: '16', tnaDe: '20201015'}}, */
      {dataSet: {tnaDe: moment(tnDe).format('YYYYMMDD'), 
                workCd: workCd, 
                attendTime: attendTime.replace(':', ''), 
                lvffcTime: lvffcTime.replace(':', ''), 
                nonWorkMin:nonWorkMin}},
      head
    )
    .then((res) => {
      console.log('Success')
    })
    .catch((error)=> {
      console.log('Connect Fail, Error Message: '+ error);
    });
  };
  //handleSave();

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
        <View>
          <TextInput
            style={styles.tnDe}
            onFocus={event => showDatePicker(event, setTnDe)}
            showSoftInputOnFocus={false}
            value={tnDe}
            keyboardType={'number-pad'}
          />
        </View>
        <Text style={styles.text}>구분</Text>
        <View
          style={styles.picker}>
          <Picker
            selectedValue={workCd}
            // style={{color: 'white', height: 50, width: 100}}
            onValueChange={v => {
              setWorkCd(v);
            }}
            style={styles.workCd}
            mode="dialog">
            <Picker.Item label="선택..." value="0" />
            {workCdItem.map((item, idx)=>(
              <Picker.Item label={item.cmmnCdNm} value={item.cmmnCd} key={idx} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>정상근무시간</Text>
        <View
          style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.time}
            onFocus={event => {
              showTimePicker(event, setAttendTime);
            }}
            showSoftInputOnFocus={false}
            value={attendTime}
            keyboardType={'number-pad'}
            autofocus={false}
          />
          <Text style={{color: 'black', paddingLeft: 10, paddingRight: 10, paddingTop:10}}>
            ~
          </Text>
          <TextInput
            style={styles.time}
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
          style={styles.picker}>
          <Picker
            selectedValue={nonWorkMin}
            // style={{color: 'white', height: 50, width: 100}}
            onValueChange={v => {
              setNonWorkMin(v);
            }}
            mode="dialog">
            <Picker.Item label="선택..." value="0" />
            {[10, 20, 30, 40, 50, 60].map((value, idx)=>(
              <Picker.Item label={value.toString()} value={value} key={idx} />
            ))}
          </Picker>
        </View>
        <View
          style={{
            color: 'white',
            width: '100%',
            paddingTop: 40,
            paddingBottom: 20,
          }}>
          <Button title="저장" onPress={handleSave} height="20px" />
        </View>

        {/* <ProgressBar
          arrayOfProgressObjects={[
          {
            color: 'red',
            value: 0.4,
            nameToDisplay: "40%"
          },
          {
            color: 'blue',
            value: 0.2,
            
          },
          ]}
          backgroundBarStyle={
            {flexDirection:'row',alignItems:'stretch',backgroundColor: 'gray',borderRadius: 8.5,height: 12}
          }
        /> */}

        <View style={{paddingTop: 20}}>
          <Text style={{alignSelf: 'flex-end'}}>
            기본: {totWorkTimeValue}
          </Text>
          <Text style={{alignSelf: 'flex-end'}}>
            최대: {baseWorkTimeValue}
          </Text>
          <Text style={{alignSelf: 'flex-end'}}>
            누적: {maxWorkTimeValue}
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
  text: {
    paddingTop: 30,
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  tnDe: {
    color: 'black',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  picker: {
    color: 'black',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  time: {
    color: 'black',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '30%',
    paddingLeft: 10
  }

});
