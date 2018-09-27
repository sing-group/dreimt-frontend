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

import {ErrorHandler, Injectable} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DreimtError} from '../entities';

@Injectable()
export class ErrorNotificationHandler implements ErrorHandler {
  constructor(
    private notificationService: NotificationService
  ) {
  }

  public handleError(error: Error | DreimtError | HttpErrorResponse): void {
    if (console) {
      console.log(error);
    }

    if (error instanceof DreimtError) {
      console.log('CAUSE', error.cause);
      this.notificationService.error(error.detail, error.summary);
    } else if (error instanceof HttpErrorResponse) {
      this.notificationService.error(error.statusText, error.message);
    }
  }
}
