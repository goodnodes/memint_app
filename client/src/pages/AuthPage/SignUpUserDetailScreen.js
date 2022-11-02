import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import BackButton from '../../components/common/BackButton';
import {useToast} from '../../utils/hooks/useToast';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import TagElement from '../../components/AuthComponents/TagElement';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {data} from '../../assets/docs/contents';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const SignUpUserDetailScreen = ({navigation, route}) => {
  let {userInfo} = route.params || {};
  const {showToast} = useToast();
  const [property, setProperty] = useState({
    mbti: '',
    emoji: '',
    region: [],
    favYoutube: '',
    twinCeleb: '',
    drinkCapa: '',
    alcoholType: [],
    drinkStyle: [],
    curfew: '',
    favGame: [],
  });
  const [selfIntroduction, setSelfIntroduction] = useState('');

  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const goToNextPage = () => {
    if (
      property.mbti === '' ||
      property.emoji === '' ||
      property.region.length === 0 ||
      property.favYoutube === '' ||
      property.twinCeleb === '' ||
      property.drinkCapa === '' ||
      property.drinkStyle.length === 0 ||
      property.alcoholType.length === 0 ||
      property.curfew === '' ||
      property.favGame.length === 0 ||
      selfIntroduction === ''
    ) {
      // Alert.alert('실패', '회원 정보를 올바르게 입력해주세요');
      showToast('error', '모든 내용을 입력해주세요.');
    } else {
      userInfo = {
        ...userInfo,
        property,
        selfIntroduction,
      };
      // createProperty({
      //   userId: uid,
      //   drinkCapa: property.drinkCapa,
      //   drinkStyle: property.drinkStyle,
      //   alcoholType: property.alcoholType,
      // });
      navigation.push('SignUpAgreement', {userInfo});
      // navigate('SignUpServeNFT', route.params);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.KeyboardAvoidingView}
      enableOnAndroid={true}
      enableAutomaticScroll={Platform.OS === 'ios' ? true : false}>
      {Platform.OS === 'ios' ? (
        <SafeStatusBar />
      ) : (
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#3C3D43"
          animated={true}
        />
      )}
      <View style={styles.header}>
        <BackButton />
      </View>
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.5}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.fullscreen}>
          <ScrollView
            style={styles.fullscreenSub}
            contentContainerStyle={styles.paddingBottom}
            behavior={Platform.select({ios: 'padding'})}>
            <View style={styles.propertyView}>
              <Text style={styles.title}>
                {userInfo.nickName}님에 대해{'\n'}알고 싶어요!
              </Text>
              <Text style={styles.propertydesc}>
                더 재밌는 미팅을 위해{'\n'}아래의 질문들에 답해주세요.
              </Text>
            </View>
            <Animated.View
              style={[
                styles.propertyView,
                {
                  transform: [
                    {
                      translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [200, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={styles.propertyTitle}>가볍게 시작해볼까요?</Text>
              <Text style={styles.propertydesc}>
                {userInfo.nickName}님의 MBTI는 뭐에요?
              </Text>
              <SelectDropdown
                data={data.mbti}
                onSelect={selectedItem => {
                  setProperty({...property, mbti: selectedItem});
                }}
                defaultButtonText=" "
                buttonStyle={styles.dropdown}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.dropdownTextStyle}
                buttonTextStyle={styles.buttonTextStyle}
              />
            </Animated.View>

            {!property.mbti ? null : (
              <Emoji
                property={property}
                setProperty={setProperty}
                nickName={userInfo.nickName}
              />
            )}
            {!property.emoji ? null : (
              <Region property={property} setProperty={setProperty} />
            )}
            {!property.region.length ? null : (
              <FavYoutube property={property} setProperty={setProperty} />
            )}
            {!property.favYoutube ? null : (
              <TwinCeleb property={property} setProperty={setProperty} />
            )}
            {!property.twinCeleb ? null : (
              <DrinkCapa
                property={property}
                setProperty={setProperty}
                nickName={userInfo.nickName}
              />
            )}
            {!property.drinkCapa ? null : (
              <AlcoholType
                data={data}
                property={property}
                setProperty={setProperty}
              />
            )}
            {!property.alcoholType.length ? null : (
              <DrinkStyle
                data={data}
                property={property}
                setProperty={setProperty}
              />
            )}
            {!property.drinkStyle.length ? null : (
              <Curfew
                data={data}
                property={property}
                setProperty={setProperty}
              />
            )}
            {!property.curfew ? null : (
              <FavGame
                data={data}
                property={property}
                setProperty={setProperty}
                nickName={userInfo.nickName}
              />
            )}
            {!property.favGame.length ? null : (
              <SelfIntroduction
                selfIntroduction={selfIntroduction}
                setSelfIntroduction={setSelfIntroduction}
              />
            )}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={goToNextPage}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

const Emoji = ({property, setProperty, nickName}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  function handleEmoji(string) {
    const regex =
      /([\u2700-\u27bf]|(\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    //emoji 길이 2~7
    if (regex.test(string)) {
      if (property.emoji) {
        return property.emoji;
      }
      return string;
    } else {
      return '';
    }
  }
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>
        {nickName}님을 가장 잘 표현한 이모지
      </Text>
      <TextInput
        style={[
          styles.textInput,
          property.emoji ? styles.borderedTextInput : null,
        ]}
        value={property.emoji}
        placeholderTextColor="#EAFFEFB2"
        placeholder="한 개만 입력해주세요 :)"
        autoComplete="off"
        autoCorrect={false}
        selectionColor="#AEFFC1"
        onChangeText={value => {
          let emoji = handleEmoji(value);
          setProperty({...property, emoji: emoji});
        }}
        onSubmitEditing={() => {}}
        maxLength={7}
      />
    </Animated.View>
  );
};

const Region = ({property, setProperty}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>나의 주출몰지</Text>
      <Text style={styles.propertydesc}>최대 3개까지 선택 가능해요.</Text>
      <View style={styles.tagsContainer}>
        {data.region.map((tag, idx) => (
          <TagElement
            key={idx}
            tag={tag}
            property={property}
            setProperty={setProperty}
            selectLimit={3}
            type="region"
          />
        ))}
      </View>
    </Animated.View>
  );
};

const FavYoutube = ({property, setProperty}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>최근에 자주 본 유튜브 채널</Text>
      <TextInput
        style={[
          styles.textInput,
          property.favYoutube ? styles.borderedTextInput : null,
        ]}
        value={property.favYoutube}
        placeholder="여러개 쓰셔도 좋아요!"
        placeholderTextColor="#EAFFEFB2"
        autoComplete="off"
        autoCorrect={false}
        selectionColor="#AEFFC1"
        onChangeText={value => {
          setProperty({...property, favYoutube: value});
        }}
        onSubmitEditing={() => {}}
        maxLength={20}
      />
    </Animated.View>
  );
};

const TwinCeleb = ({property, setProperty}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>나의 닮은꼴 연예인</Text>
      <TextInput
        style={[
          styles.textInput,
          styles.twinCeleb,
          property.twinCeleb ? styles.borderedTextInput : null,
        ]}
        value={property.twinCeleb}
        multiline
        placeholder={
          '부끄러워 마세요! 누구나 절친에게 들은 닮은꼴\n연예인 한 명쯤은 있잖아요 😏'
        }
        placeholderTextColor="#EAFFEFB2"
        autoComplete="off"
        autoCorrect={false}
        selectionColor="#AEFFC1"
        onChangeText={value => {
          setProperty({...property, twinCeleb: value});
        }}
        onSubmitEditing={() => {}}
        maxLength={20}
      />
    </Animated.View>
  );
};

const DrinkCapa = ({nickName, property, setProperty}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={[styles.propertyTitle, styles.meetingStyle]}>
        이제부터, {nickName}님의{'\n'}미팅 스타일을 알아보려고 해요!
      </Text>
      <Text style={styles.propertyTitle}>나의 주량은?</Text>
      <SelectDropdown
        data={data.drinkCapa}
        onSelect={value => {
          setProperty({...property, drinkCapa: value});
        }}
        defaultButtonText=" "
        buttonStyle={styles.dropdown}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.dropdownTextStyle}
        buttonTextStyle={styles.buttonTextStyle}
      />
    </Animated.View>
  );
};

const AlcoholType = ({property, setProperty}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>나의 선호 주류</Text>
      <Text style={styles.propertydesc}>최대 3개까지 선택 가능해요.</Text>
      <View style={styles.tagsContainer}>
        {data.alcoholType.map((tag, idx) => (
          <TagElement
            key={idx}
            tag={tag}
            property={property}
            setProperty={setProperty}
            type="alcoholType"
            selectLimit={3}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const DrinkStyle = ({property, setProperty}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>나의 술자리 스타일</Text>
      <Text style={styles.propertydesc}>하나만 선택해 주세요.</Text>
      <View style={styles.tagsContainer}>
        {data.drinkStyle.map((tag, idx) => (
          <TagElement
            key={idx}
            tag={tag}
            property={property}
            setProperty={setProperty}
            type="drinkStyle"
            selectLimit={1}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const Curfew = ({property, setProperty}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>나의 통금</Text>
      <View style={styles.tagsContainer}>
        {data.curfew.map((tag, idx) => (
          <TagElement
            key={idx}
            tag={tag}
            property={property}
            setProperty={setProperty}
            type="curfew"
            selectLimit={1}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const FavGame = ({property, setProperty, nickName}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>
        {nickName}님이 좋아하는~랜덤~게임~!
      </Text>
      <Text style={styles.propertydesc}>
        좋아하는 술게임을 알려주세요. (최대3개)
      </Text>
      <View style={styles.tagsContainer}>
        {data.favGame.map((tag, idx) => (
          <TagElement
            key={idx}
            tag={tag}
            property={property}
            setProperty={setProperty}
            type="favGame"
            selectLimit={3}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const SelfIntroduction = ({selfIntroduction, setSelfIntroduction}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={[
        styles.propertyView,
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.propertyTitle}>마지막으로 자기소개 부탁드려요</Text>
      <TextInput
        style={[
          styles.textInput,
          styles.selfIntroduction,
          selfIntroduction ? styles.borderedTextInput : null,
        ]}
        value={selfIntroduction}
        multiline={true}
        placeholder="자유롭게 작성해 주세요 😉"
        placeholderTextColor="#EAFFEFCC"
        autoComplete="off"
        autoCorrect={false}
        selectionColor="#AEFFC1"
        onChangeText={value => {
          setSelfIntroduction(value);
        }}
        onSubmitEditing={() => {}}
        maxLength={100}
      />
      <Text style={styles.texinputAlert}>{selfIntroduction.length} / 100</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#3C3D43',
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  fullscreenSub: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    lineHeight: 33.6,
    textAlign: 'center',
    marginBottom: 8,
  },

  tagsContainer: {
    flexWrap: 'wrap',
    marginBottom: 10,
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
  },

  buttonTextStyle: {
    color: '#1D1E1E',
    fontSize: 16,
  },
  button: {
    // marginTop: 'auto',
    // marginBottom: 30,
    backgroundColor: '#ffffff',
    width: '100%',
    height: 50,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,

    position: 'absolute',
    bottom: 20,
    marginHorizontal: 15,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
  paddingBottom: {
    paddingBottom: 120,
  },
  propertyView: {
    alignItems: 'center',
    paddingTop: 26,
    paddingBottom: 38,
  },
  propertyTitle: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 25.2,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  propertydesc: {
    color: '#EDEEF6',
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EAFFEFCC',
    borderRadius: 5,
    color: '#ffffff',
    height: 42,
    paddingHorizontal: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  borderedTextInput: {
    borderColor: '#AEFFC0',
    borderWidth: 2,
  },
  dropdown: {
    width: '100%',
    borderColor: '#EAFFEF',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 99,
    height: 36,
    backgroundColor: '#EAFFEF',
    marginTop: 12,
  },
  dropdownStyle: {
    backgroundColor: '#3C3D43',
    borderRadius: 10,
    height: 200,
  },
  dropdownTextStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  gradientBackground: {
    flex: 1,
  },
  selfIntroduction: {
    height: 100,
    textAlign: 'left',
    paddingTop: 10,
  },
  twinCeleb: {
    height: 62,
    paddingTop: 10,
  },
  meetingStyle: {
    marginBottom: 50,
  },
  texinputAlert: {
    fontWeight: '500',
    position: 'absolute',
    right: 10,
    bottom: 55,
    color: '#EAEAEA',
  },
});

export default SignUpUserDetailScreen;
