import React, {Fragment} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {LoginButton} from 'react-native-fbsdk';

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <LoginButton />
      </SafeAreaView>
    </Fragment>
  );
};

export default App;
