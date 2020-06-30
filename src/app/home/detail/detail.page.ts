import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public package: any;
  constructor(
    public aRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
  ) {
    this.package = this.aRoute.snapshot.paramMap.get("id");
    if (!this.package || !this.utilsService.app)
      this.router.navigate(['/home']);
  }

  ngOnInit() {
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
}
