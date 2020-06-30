import { Component, OnInit, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';
import { UtilsService } from '../services/utils.service';
import * as Applist from 'cordova-plugin-applist2/www/Applist.js';


declare var window: any;
declare var navigator: any;


@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  // public applist: any = null;
  public loading: any;
  public displaySearch: boolean = false;

  public _applist: any = [
    { appName: 'Tmp1', packageName: 'com.tmp1', appIcon: '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' },
    { appName: 'Tmp2', packageName: 'com.tmp2', appIcon: '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' },
    { appName: 'Tmp3', packageName: 'com.tmp3', appIcon: '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' }
  ];
  public applist: any = [];
  public title = "";
  // public platform: any;
  constructor(
    public platform: Platform,
    public ngZone: NgZone,
    private sanitizer: DomSanitizer,
    public loadingController: LoadingController,
    public utilsService: UtilsService,
    public router: Router,
    public aRoute: ActivatedRoute,

  ) {



  }
  async ngOnInit() {
    // console.log(window);
    console.log(this.utilsService.getApp());

    this.applist = this._applist.slice();
    // console.log(this._applist.slice());

    this.loading = await this.loadingController.create({ message: "Loading" });
    await this.startLoading();
    this.getAppList();

  }
  async startLoading() {
    this.loading.present();
  }
  async dismissLoading() {
    this.loading.dismiss();
  }
  getAppList() {
    this.platform.ready().then((d) => {
      console.log(window.navigator);
      // this.title = "Done";
      if (window.DeviceApps) {
        window.DeviceApps.getInstalledApplications((apps) => {
          this.ngZone.run(() => {
            let tmpApps = apps;
            // this.applist = apps;
            tmpApps = tmpApps.map((el: any) => {
              el.appIcon = 'data:image/png;base64,' + el.appIcon;
              return el;
            });
            tmpApps = tmpApps.sort((a: any, b: any) => {
              if (a.appName == b.appName) return 0;
              return (a.appName + "").toLowerCase() < (b.appName + "").toLowerCase() ? -1 : 1;
            });
            this._applist = tmpApps;
            this.applist = this._applist.slice();
            this.dismissLoading();
          });

          console.log(this.applist);
        }, (err) => {
          this.dismissLoading();
        }, {
          includeAppIcons: true,
          systemApps: false
        });
      } else {
        this.dismissLoading();
      }
      // if (window.navigator.IntentList)
      //   window.navigator.IntentList.getList((app: any) => {
      //     this.ngZone.run(() => {

      //       this.applist = app;
      //       this.applist = this.applist.map((el: any) => {
      //         el.packageIcon = this.sanitizer.bypassSecurityTrustUrl(el.packageIcon);
      //         return el;
      //       });
      //       this.applist = this.applist.sort((a: any, b: any) => {
      //         if (a.label == b.label) return 0;
      //         return (a.label + "").toLowerCase() < (b.label + "").toLowerCase() ? -1 : 1;
      //       });
      //       this._applist = this.applist;
      //       this.dismissLoading();
      //       console.log(this.applist);
      //     })
      //   });
      // else {
      //   // this.applist = undefined;
      //   this.dismissLoading();
      // }

      // if (this.platform.is('android') && !this.platform.is('mobileweb')) {
      //   var success = function (app_list: any) {
      //     //success function
      //     console.log(app_list);
      //   };
      //   var error = function (app_list: any) {
      //     //error          
      //     console.log("An Error occured while fetching App Lists");
      //     console.error(app_list);
      //   };
      //   //for the date parameters, any date is okay, 
      //   //the first date should be in the past
      //   Applist.createEvent('', '', '', new Date(1999, 10, 11, 12, 12, 12, 12), new Date(), success, error);
      // }
      // window.plugins && window.plugins.packagemanager && window.plugins.packagemanager.show(
      //   true,
      //   (s) => {
      //     alert(JSON.stringify(s));
      //     this.applist = s;
      //   },
      //   (e) => {
      //     alert("Error");
      //   }
      // );
    });
  }

  onSearch(e: any) {
    // console.log();
    this.filterList(e.target.value);
  }
  filterList(src = "") {
    if (!this._applist) return;
    // this.applist = this._applist.slice();
    src = src.toLowerCase().trim();
    this.applist = this.applist.map(((item: any) => {
      if ((item.packageName + "").toLowerCase().trim().indexOf(src) > -1 || (item.appName + "").toLowerCase().trim().indexOf(src) > -1) {
        item.show = true;
      }
      else
        item.show = false;
      return item;
    }));
    // console.log(this.applist);

  }

  listHasSearch() {
    if (Array.isArray(this.applist))
      return this.applist.find(a => a.show !== false) ? true : false;
    return false;
  }

  goDetail(app = null) {
    if (!app) return;
    this.utilsService.app = app;
    // console.log(app);
    this.router.navigate(['detail/' + app['packageName']], { relativeTo: this.aRoute });
  }
}
