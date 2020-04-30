import {Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CustomIconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
  }

  init() {
    this.matIconRegistry.addSvgIcon(
      'pubmed',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/pubmed.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'pubchem',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/pubchem.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'homo-sapiens',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/homo-sapiens.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'mus-musculus',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/mus-musculus.svg')
    );
  }
}
