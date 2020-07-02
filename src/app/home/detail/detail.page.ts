import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public package: any;
  public unityVersion = "Loading...";
  public appSize = "Loading...";

  constructor(
    public aRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public ngZone: NgZone,
  ) {

  }

  ngOnInit() {
    this.package = this.aRoute.snapshot.paramMap.get("id");
    if (!this.package || !this.utilsService.app) {
      this.router.navigate(['/home']);
      return false;
    }
    try {
      this.getAppSize();
    } catch (err) {
      console.log("CATCH: " + err);
      this.appSize = "Not possible to get the size";

    }
    try {
      this.getUnityVersion();
    } catch (err) {
      console.log("CATCH: " + err);
      this.ngZone.run(() => {
        this.unityVersion = "It was not possible to get this information."
      });
    }
  }

  openApp(pkg = "") {
    console.log(pkg);

    if (window['DeviceApps'])
      window['DeviceApps'].openApp(() => {
        console.log('Success');
      }, () => {
        console.log('Error');
      }, pkg);

  }
  getAppSize() {
    window['ShellExec'].exec(['pm', 'path', this.utilsService.app.packageName],
      (res) => {
        if (res.exitStatus != 0) {
          this.appSize = "Not possible to get the size";
          return false;
        }
        let apk = res.output.match(/\:.*apk/)[0].substr(1);
        // let apk = res.output.split(":")[1].trim();
              

        window['resolveLocalFileSystemURL']("file://" + apk,
          (f) => {
            f.getMetadata(
              (m) => {
                this.appSize = (m.size / 1024 / 1024).toFixed(2) + "MB";
              }, (err) => {
                this.appSize = "Not possible to get the size";
              });
          },
          (err) => {
            this.appSize = "Not possible to get the size";
          });
      });
  }
  removeBaseApk() {
    return new Promise((resolve, reject) => {
      let counter = 0;
      window['resolveLocalFileSystemURL'](window['cordova'].file.externalDataDirectory + 'base',
        (d: any) => {
          d.removeRecursively(
            () => {
              counter++;
              if (counter == 2) resolve();
            },
            (err) => {
              counter++;
              if (counter == 2) resolve();
            })
        }, err => {
          counter++;
          if (counter == 2) resolve();
        });


      window['resolveLocalFileSystemURL'](window['cordova'].file.externalDataDirectory + 'base.rar',
        (f) => {
          f.remove(
            () => {
              counter++;
              if (counter == 2) resolve();
            },
            (err) => {
              counter++;
              if (counter == 2) resolve();
            })
        }, err => {
          counter++;
          if (counter == 2) resolve();
        });
    });
  }
  getUnityVersion() {
    try {
      this.removeBaseApk()
        .then(() => {
          window['ShellExec'].exec(['pm', 'path', this.utilsService.app.packageName],
            (res) => {
              console.log(res);
              let apk = res.output.match(/\:.*apk/)[0].substr(1)
              window['resolveLocalFileSystemURL']('file://' + apk,
                (file: any) => {
                  window['resolveLocalFileSystemURL'](window['cordova'].file.externalDataDirectory,
                    (dir: any) => {
                      file.copyTo(dir, 'base.rar',
                        (res) => {
                          console.log('success, file copied');
                          window['JJzip'].unzip(window['cordova'].file.externalDataDirectory + "base.rar",
                            { target: window['cordova'].file.externalDataDirectory + "base", name: "base" },
                            (res) => {
                              console.log('success, file unziped');
                              window['resolveLocalFileSystemURL'](window['cordova'].file.externalDataDirectory + 'base/assets/bin/Data/Resources/unity_builtin_extra',
                                (file: any) => {
                                  file['file']((f) => {
                                    var fr = new FileReader();
                                    fr.onerror = (err) => {
                                      this.setUnityVersion();
                                      throw new Error('Error reading unity file');

                                    };
                                    fr.onload = (data) => {
                                      let result: any = fr.result;
                                      let version: any = result.match(/\d+[\w\.]+/)[0];
                                      this.ngZone.run(() => {
                                        this.unityVersion = version ? version : "No version found";
                                      });
                                    };
                                    fr.readAsText(f);
                                  }, err => {
                                    this.setUnityVersion();
                                    throw new Error('Error reading unity file.');

                                  })
                                }, err => {
                                  this.ngZone.run(() => {
                                    this.unityVersion = "Not a unity application";
                                  });
                                });
                            },
                            (err) => {
                              this.setUnityVersion();
                              throw new Error('Error unziping the apk.');

                            }
                          );

                        }, err => {
                          this.setUnityVersion();
                          throw new Error('Error copyng apk to the application Directory ');

                        })
                    }, (err) => {
                      this.setUnityVersion();
                      throw new Error('Error getting Data Directory ');

                    });
                }, err => {
                  this.setUnityVersion();
                  throw new Error('Error reading the apk');

                });
            }, (err) => {
              this.setUnityVersion();
              throw new Error('Error getting apk path');

            });
        })



    } catch (err) {
      console.log("OUT CATCH: " + err);
      this.ngZone.run(() => {
        this.unityVersion = "It was not possible to get this information.";
      });
    }
  }
  setUnityVersion(str = "") {
    this.ngZone.run(() => {
      if (!str) this.unityVersion = "It was not possible to get this information.";
      else this.unityVersion = str;
    });

  }
}
