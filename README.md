# AppList
A application build with ionic + angular to list the apps installed in your android device.

# Requirements
1. [NPM](https://nodejs.org/en/download/)
2. [ANGULAR](https://cli.angular.io/)
3. [CORDOVA](https://cordova.apache.org/docs/en/latest/guide/cli/)
3. [IONIC](https://ionicframework.com/docs/intro/cli)

# Setup the project
```
$ git clone https://github.com/stdioh321/applist.git
$ cd applist
$ npm install
$ ionic cordova prepare
```

# How to run
```
$ ionic serve
```
Open your browser at: http://localhost:8100

[!pic1](./screenshots/output_browser.png)



# How to run on Android
```
$ ionic cordova platform add android
$ ionic cordova build android
```
A .apk file will be generate at the path: 
./platforms/android/app/build/outputs/apk/debug/app-debug.apk


# References
* https://www.npmjs.com/package/cordova-plugin-intent-list