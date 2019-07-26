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

import {IdAndUri} from '../id-and-uri.model';
import {WorkStep} from './work-step.model';
import {ExecutionStatus} from './execution-status.enum';

export class Work {
  public readonly id: IdAndUri;
  public readonly name?: string;
  public readonly description?: string;
  public readonly creationDateTime?: Date;
  public readonly schedulingDateTime?: Date;
  public readonly startingDateTime?: Date;
  public readonly finishingDateTime?: Date;
  public readonly resultReference?: string;
  public readonly status: ExecutionStatus;
  public readonly steps?: WorkStep[];
}
