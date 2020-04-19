import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export default class App extends React.Component {
  state = {
    loading: false,
    user: null,
  };

  getUserCallback = (error, result) => {
    if (error) {
      return console.log('getUserError', error);
    }
    console.log(result);
    console.log(result.picture.data.url);
    this.setState({user: result, loading: false});
  };

  getUserInfo = async (accessToken) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken,
        parameters: {
          fields: {
            string:
              'picture.width(960), email, first_name, gender, last_name, birthday, location',
          },
        },
      },
      this.getUserCallback,
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {this.state.loading && <ActivityIndicator />}
            {this.state.user && (
              <>
                <Image
                  style={styles.image}
                  source={{url: this.state.user.picture.data.url}}
                  alt="User Image"
                />
                <Text style={styles.userName}>
                  {this.state.user.first_name}
                </Text>
                <Text style={styles.userName}>{this.state.user.last_name}</Text>
                <Text style={styles.userEmail}>{this.state.user.email}</Text>
              </>
            )}
          </View>
          <LoginButton
            onLoginFinished={async (error, result) => {
              if (error) {
                console.log('Auth Error', error);
              } else if (result.isCancelled) {
                console.log('Canceled by user');
              } else {
                const {accessToken} = await AccessToken.getCurrentAccessToken();
                this.setState({loading: true});
                this.getUserInfo(accessToken);
              }
            }}
            permissions={[
              'public_profile',
              'email',
              'user_birthday',
              'user_location',
            ]}
          />
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userName: {
    fontWeight: 'bold',
    color: '#999',
    fontSize: 18,
  },
  userEmail: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: 14,
  },
  image: {
    height: 200,
    width: 200,
  },
});
