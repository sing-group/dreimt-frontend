/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2018-2020 - Hugo López-Fernández,
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

import {Component} from '@angular/core';
import {CmapQueryUpDownSignatureResultsMetadata} from '../../../../models/interactions/cmap-up-down/cmap-query-up-down-signature-results-metadata';
import {CmapUpDownSignatureResultsDataSource} from './cmap-up-down-signature-results-data-source';
import {CmapUpDownResultsService} from '../../services/cmap-up-down-results.service';
import {ActivatedRoute} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-cmap-up-down-signature-results-view',
  templateUrl: './cmap-up-down-signature-results-view.component.html',
  styleUrls: ['./cmap-up-down-signature-results-view.component.scss']
})
export class CmapUpDownSignatureResultsViewComponent {

  private metadata: CmapQueryUpDownSignatureResultsMetadata;
  private dataSource: CmapUpDownSignatureResultsDataSource;
  private readonly routeUrl: string;
  private errorMessage: string;

  constructor(
    private service: CmapUpDownResultsService,
    private route: ActivatedRoute
  ) {
    this.routeUrl = window.location.href;
    const uuid = this.route.snapshot.params['uuid'];
    if (uuid) {
      this.service.getMetadata(uuid)
        .pipe(
          catchError(
            (error: Error) => {
              this.errorMessage = 'Error loading drug prioritization result with id = ' + uuid;
              return throwError(error);
            }
          ))
        .subscribe(metadata => {
          this.metadata = metadata;
          this.metadata.id = uuid;
          this.dataSource = new CmapUpDownSignatureResultsDataSource(this.service);
        });
    }
  }

  public getResultsUrl(): string {
    return this.routeUrl;
  }

  public isMetadataAvailable(): boolean {
    return this.metadata !== undefined;
  }

  public isError(): boolean {
    return this.errorMessage !== undefined;
  }
}
