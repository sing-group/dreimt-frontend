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

import {DrugSignatureInteraction} from '../../models/drug-signature-interaction.model';
import {DrugSignatureInteractionQueryParams} from '../../models/drug-signature-interaction-query-params.model';
import {InteractionsService} from '../../services/interactions.service';
import {PartialDataSource} from '../../../../utils/partial-data-source';

export class DatabaseDataSource extends PartialDataSource<DrugSignatureInteraction> {
  constructor(
    private service: InteractionsService
  ) {
    super();
  }

  list(queryParams: DrugSignatureInteractionQueryParams): void {
    this.update(this.service.list(queryParams));
  }
}
