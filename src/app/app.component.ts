/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018 - Hugo López-Fernández,
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public readonly title = 'DREIMT';

  constructor(
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {
  }

  public ngOnInit(): void {
    this.notificationService.getMessages().subscribe(
      message => {
        console.log('message');
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
  }
}
