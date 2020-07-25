# DREIMT [![license](https://img.shields.io/github/license/sing-group/dreimt-frontend)](https://github.com/sing-group/dreimt-frontend) [![release](https://img.shields.io/github/release/sing-group/dreimt-frontend.svg)](https://github.com/sing-group/dreimt-frontend/releases)

> DREIMT - A tool for immune modulation drug prioritization (http://www.dreimt.org)

<p align="center">
	<img src="src/assets/images/dreimt-logo.png" alt="DREIMT logo"></img>
</p>

**DREIMT** is a bioinformatics tool for hypothesis generation and prioritization of drugs capable of modulating immune cell activity from transcriptomics data.

DREIMT integrates 4,694 drug profiles from The Library of Network-Based Cellular Signatures (LINCS) L1000 data set and 2,687 manually curated immune gene expression signatures from multiple resources to generate a drug-immune signature association database.

DREIMT can also prioritize drug associations from user-provided immune signatures. 


## Development

### Local development server

Run `npm start` for a local dev server. This configuration will use the `environment.ts` configuration file.

A browser will be automatically opened for the URL `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Remote development server

Run `npm run start-development` for a remote dev server. This configuration will use the `environment.development.ts` configuration file.

A browser will be automatically opened for the URL `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Production server

Run `npm run start-production` for a remote production server (the one used by [DREIMT](http://dreimt.org)). This configuration will use the `environment.prod.ts` configuration file.

A browser will be automatically opened for the URL `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `npm run ng -- generate component component-name` to generate a new component. You can also use `npm run ng -- generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Production build

Run `npm run dist` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). Before running the tests make sure you are serving the app via `ng serve`.

### Other Angular commands
In order to run other `ng` commands you can run `npm run ng -- <parameters>`.

### Further help

To get more help on the Angular CLI use `npm run ng -- help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
