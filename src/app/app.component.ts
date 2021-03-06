/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2019 - Hugo López-Fernández,
 *  Daniel González-Peña, Miguel Reboiro-Jato, Kevin Troulé,
 *  Fátima Al-Sharhour and Gonzalo Gómez-López.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {Component, OnInit} from '@angular/core';
import {NotificationService} from './modules/notification/services/notification.service';
import {NotificationsService as ToastService} from 'angular2-notifications';
import {Severity} from './modules/notification/entities';
import {WorkService} from './modules/work/services/work.service';
import {CustomIconService} from './services/custom-icon.service';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faEnvelopeOpen} from '@fortawesome/free-regular-svg-icons';
import {faDatabase} from '@fortawesome/free-solid-svg-icons';
import {DreimtInformationService} from './services/dreimt-information.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public readonly title = 'DREIMT';

  public readonly faTwitter = faTwitter;
  public readonly faEnvelopeOpen = faEnvelopeOpen;
  public readonly faDatabase = faDatabase;

  public workCount: number;
  public currentDatabaseVersion = 'not available';

  public isSmall: boolean;

  public constructor(
    private breakpointObserver: BreakpointObserver,
    private workService: WorkService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private customIconService: CustomIconService,
    private dreimtInformationService: DreimtInformationService
  ) {
    this.workCount = 0;

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.isSmall = result.matches;
    });
  }

  public ngOnInit(): void {
    this.workService.listUserWorks()
      .subscribe(works => this.workCount = works.length);

    this.dreimtInformationService.getCurrentDatabaseVersion().subscribe(c => this.currentDatabaseVersion = c);

    this.notificationService.getMessages().subscribe(
      message => {
        switch (message.severity) {
          case Severity.ERROR:
            this.toastService.error(message.summary, message.detail);
            break;
          case Severity.SUCCESS:
            this.toastService.success(message.summary, message.detail);
            break;
          case Severity.INFO:
            this.toastService.info(message.summary, message.detail);
            break;
          case Severity.WARNING:
            this.toastService.warn(message.summary, message.detail);
            break;
        }
      }
    );

    this.customIconService.init();
  }
}
