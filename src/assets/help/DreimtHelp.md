# DREIMT Help

Drug REpositioning for IMmune Transcriptome

To make most effective use of DREIMT, we recommend that you carefully read this manual and its examples.

## Index
1. [What is DREIMT?](help#whats-dreimt)
    1. [How does it work?](help#how)
    2. [DREIMT tools](help#tools)
2. [How to select drug candidates?](help#how-candidate)
    1. [Drug prioritization score (Tau)](help#tau)
    2. [False discovery rate](help#fdr)
    3. [Drug specificity score](help#dss)
3. [Database](help#database)
    1. [Database fields](help#fields)
    2. [Database filtering](help#filtering)
    3. [DREIMTdb query example I](help#query-db1)
    4. [DREIMTdb query example II](help#query-db2)
4. [Drug prioritization](help#Drug-prioritization)
    1. [Input](help#queries-input-prioritization)
    2. [Drug prioritization example](help#example1)
5. [Signature comparison](help#comparison)
    1. [Input](help#queries-input-comparison)
    2. [Signature comparison example](help#comparison-example-1)
6. [Input genes](help#inputs)
7. [Query history](help#queries-history)
8. [Error messages](help#errors)
9. [FAQ](help#faqs)
    1. [Why are there duplicated drugs?](help#f1)
    2. [Why did the tau score change?](help#f2)
    3. [How do I interpret the tau score?](help#f3)
    4. [What does signature and geneset mean?](help#f4)



## 1. What is DREIMT?<a name="whats-dreimt"></a>

DREIMT is a bioinformatics tool for **hypothesis generation** and prioritization of **drugs capable of modulating immune cells activity**. DREIMT aims to repurpose drugs capable of modulating immune cells from transcriptomics data.

DREIMT integrates **4,690 drug profiles** from The Library of Network-Based Cellular Signatures (LINCS) L1000 data set  and **2,700 manually curated immune gene expression signatures** from multiple sources to generate a drug-immune signature association database.


#### 1.1 How does it work?<a name="how"></a>
DREIMT uses the rationale developed by the LINCS L1000 project (Subramanian et al. 2017) based on the use of geneset enrichment analysis (GSEA) methodologies to compare gene expression signatures to a set of drug transcriptomics profiles. The GSEA score (ES) is then prioritized against a large set of ES data to generate an association score (tau) for each drug profile-immune signature pair.

This methodology is employed to create a prioritized drug association database for immune gene expression signatures and to prioritize drugs from user-provided immune expression signatures. A complete description of the methodology can be found in the supplementary material.

<p align="center">
<img src="assets/help/assets/help/PaperFig.jpg" alt="Abstract figure" style="max-width: 50%"></img>
</p>


#### 1.2 DREIMT tools<a name="tools"></a>
DREIMT contains three tools accessible in the upper menu.

- **Drug prioritization**: to retrieve ranked drug associations for user-provided immune gene expression signatures.
- **Signature comparison**: to compare a user-provided immune gene expression signature to DREIMT database immune signatures.
- **Database**: precalculated ranked drug associations for a set of 2,700 manually curated immune gene expression signatures retrieved from the literature.

<p align="center">
<img src="assets/help/assets/help/Splash_ppt.png" alt="Splash"  style="max-width: 50%"></img>
</p>

DREIMT also contains three further sections of interest.
- **Help**: information and examples for the correct use of DREIMT.
- **REST API**: information for the use of the REST API tool.
- **Query history**: stored results for drug prioritization and signature comparison tools.













## 2. How to select drug candidates?<a name="how-candidate"></a>
DREIMT offers three scores to rank and prioritize drug candidates.

#### 2.1 Drug prioritization score (Tau)<a name="tau"></a>
The Drug prioritization score (**tau**) indicates the degree of specificity for a given drug profile-immune signature association pair compared to a large set of drug-immune signatures association pairs in DREIMT's database.

Tau score ranges from **-100 to 100**. Extreme values, both positive and negative, are scores of high specificity. The tau score measures:
- How high is a particular drug profile-immune gene expression association compared to the rest of the associations for a given drug.
- How high is a particular drug profile-immune gene expression association compared to all the associations calculated for a given immune signature.

For an **initial search** of drug candidates, **tau scores >|90|** are considered as strong hypotheses for the drug profile-immune signature association.

**Tau score** should be considered as the **primary score** to prioritize drug associations.

<!---
<p align="center">
<img src="assets/help/assets/help/Sign_help.png" alt="Tau sign" style="max-width: 50%"></img>
</p>
-->

#### 2.2 False discovery rate<a name="fdr"></a>
**FDR** (Benjamini Y. and Hochberg Y., 1995) are generated by GSEA to account for multiple hypothesis testing. Drug profile-immune gene expression signature associations with FDR < 0.05 are considered statistically significant.

FDR values are not intended to be used as cut-off values, but to **prioritize** associations when **multiple drugs are associated with a signature** (tau score >|90|). FDR values can also be helpful to retrieve meaningful information from the drug profile-immune gene expression signature association. When using a signature (composed of both the upregulated and downregulated genes), FDR values can indicate which of the two genesets accounts for the highest weight in the drug profile-immune gene expression signature association, thus helping to retrieve biological information.

#### 2.3 Drug specificity score<a name="dss"></a>
The Drug specificity score (**DSS**) adapted from Hodos et al. (Hodos et al. 2018) summarizes the replicability of a given drug profile across multiple cancer cell lines. This score considers the question of whether the response to a drug is cell-specific or comparable across cells.

DSS scores ranges from **0 to 1**. Scores close to 1 indicate that the transcriptomic effect of a given drug is found to be similar to all tested cancer cell lines in LINCS database. Conversely scores close to 0 indicate the drug effect has been observed to be more cancer cell line specific. Not all drugs have a DSS score available.

If multiple drugs are associated (tau score >|90|) with an immune expression signature, DSS can be used to prioritize drugs with a higher DSS score.

















## 3. Database<a name="database"></a>
DREIMT database (DREIMTdb) contains **precalculated drug associations** for nearly **2,700 manually curated immune gene expression signatures** retrieved from the literature and **4,690 drug profiles** from The Library of Network-Based Cellular Signatures (LINCS) L1000 data set.

DREIMTdb in its **online** version only offers drug profile-immune gene expression signature associations with **tau > |80|**.

#### 3.1 Database fields<a name="fields"></a>
DREIMTdb contains 12 information fields:

- **Drug**: drug common name and link to PubChem. Hovering the mouse over this field will display a tooltip with the drug's BROAD's ID, gene targets NCBI gene ID and a warning indicating that DREIMT contains multiple drug profiles for a given compound.

- **Summary**: summarized sentence that includes relevant manually annotated information to ease drug association interpretation.  

- **Case type**: cell type/cell subtype used as case for gene expression signature generation. If cell type and cell subtype names match, only cell subtype name is shown.

- **Reference type**: cell type/cell subtype used as reference for gene expression signature generation. If cell type and cell subtype names match, only cell subtype name is shown.

- **Signature info**: immune signature source name and a pop-up panel with signature-related links to: signature source database, DREIMTdb summarized results and NCBI data-generation publication.

- **Up genes FDR**: adjusted p-value for the upregulated geneset.

- **Down genes FDR**: adjusted p-value for the downregulated geneset.

- **Tau**: drug prioritization score, range (-100, 100).

- **DSS**: drug specificity score, range (0, 1).

- **Drug status**: current known status of drug (approved, experimental or withdrawn).

- **Drug MOA**: drug mechanism of action.

- **More info**: symbolic signature information of: organism source of the signature (<i>Homo sapiens</i> or <i>Mus musculus</i>), experimental design (<i>in vitro, in vivo, ex vivo, patient, in silico</i>) and signature treatment (signature, upregulated signature, downregulated signature and geneset).

<p align="center">
<img src="assets/help/assets/help/DatabaseSummary_ppt.png" alt="Database summary" style="max-width: 70%"></img>
</p>

Depicted: Drug fields (orange), immune signature fields (green), drug-signature association fields (blue) and fields with tooltips (red asterisk).


#### 3.2 Database filtering<a name="filtering"></a>

DREIMTdb can be queried using two types of filters: **basic** and the **advanced** filters.

Clicking over each filter box displays a panel with all available options, boxes allow text input and will display options matching the input. Once a filter is applied, the rest of the filters will automatically update to only show feasible filtering options.

DREIMTdb results can be downloaded in csv format for queries with less than 1,000 results. DREIMTdb can be queried programmatically using the API.

#### 3.2.1 Basic filters
**By default DREIMTdb prompts the basic filters panel:**

- **Cell type/subtype 1**: filters drug associations by the specific immune cell type/cell subtype of interest.

- **Drug effect**: specifies the modulatory effect of interest (boosting/inhibition) on the selected cell type in "Cell type/subtype 1" filter. This filter is activated after a cell type has been specified in "Cell type/subtype 1".

- **Drug name**: filters drug associations by the specified drug name. This filter can be used both independently and jointly with the other two basic filters.

<p align="center">
<img src="assets/help/assets/help/Basic_filters_ppt.png" alt="Basic filters" style="max-width: 50%"></img>
</p>

Both, basic and advanced **filters** can be cleared by clicking the **Clear filters** button.


#### 3.2.1 Advanced filters
Clicking in the Advanced filters displays a panel of detailed filters that can be used to refine the query. Previously selected basic filters will be displayed in the advanced filters panel, unless they have been previously erased.

**Advanced filters are organized in three main categories:**

#### Score filters
- **Min. tau (1)**: filters drug associations by the absolute tau score selected.

- **Max. up genes FDR (2)**: sets a threshold FDR value for the upregulated geneset of the immune signature.

- **Max. down genes FDR (3)**: sets a threshold FDR value for the downregulated geneset of the immune signature.

- **Interaction type (4)**: sets the way in which the immune gene expression signature is used to calculate the drug association score: signature (uses the complete signature composed of the upregulated and downregulated genes), signature up (uses only the upregulated genes), signature down (uses only the downregulated genes), geneset (genes without specified direction).

<p align="center">
<img src="assets/help/assets/help/Adv_filters_row1.png" alt="Advanced R1" style="max-width: 50%"></img>
</p>

#### Drug filters
- **Drug effect (1)**: (basic filter) specifies the modulatory effect of interest (boosting/inhibition) on the selected cell type in the Cell type/subtype 1 filter. This filter is activated after a cell type has been specified in Cell type/subtype 1 filter.

- **Drug name (2)**: (basic filter) filters drug associations by the specified drug name.

- **MOA (3)**: filters associations by the specified mechanism of action of the drugs.

- **Drug status (4)**: filters by the specified status of the drug.

- **Min. drug specificity score (5)**: specifies a minimum threshold value for the DSS score.

<p align="center">
<img src="assets/help/assets/help/Adv_filters_row2.png" alt="Advanced R2" style="max-width: 50%"></img>
</p>

#### Signature/Geneset filters
- **Name (1)**: filters associations by the immune signature source name.

- **Source DB (2)**: filters associations by the immune signature source database.

- **PubMed ID (3)**: filters associations by the PubMed ID of the publication that generated the immune signature data.

- **Experimental design (4)**: filters associations by the experimental design performed to generate the immune signatures (*in vivo, in vitro, transfection, ex vivo, patient or in silico*).

- **Cell type/subtype 1 (5)**: (basic filter) filters associations in which the specified immune cell type/cell subtype is involved.

- **Cell type 1 disease (6)**: filters by disease source of the "Cell type/subtype 1". This filter is activated after a cell type has been specified in Cell type/subtype 1 filter.

- **Cell type 1 treatment (7)**: filters by perturbations applied to the selected "Cell type/subtype 1". This filter is activated after a cell type has been specified in Cell type/subtype 1 filter.

- **Cell type/subtype 2 (8)**: allows to specify a second immune cell type involved in the generation of the immune signature. This filter is activated after a cell type has been specified in Cell type/subtype 1 filter. It will filter signatures that jointly contain the cells specified as subtype 1 and 2.

- **Condition (9)**: filters signatures in which the specified disease/treatment is involved.

- **Organism (10)**: selects organism source of the signature: *Homo sapiens*, *Mus musculus*.

<p align="center">
<img src="assets/help/assets/help/Adv_filters_row3.png" alt="Advanced R3" style="max-width: 50%"></img>
</p>

**Important**: Note that "Cell type/subtype 1" and "Cell type/subtype 2" only indicate cells involved in a signature, they do not specify which cell type is used as case and which as reference (see [example II for a practical demonstration](help#query-db2)).

#### 3.3 DREIMTdb query example I<a name="query-db1"></a>
In this example a [query](http://dreimt.org/database?cellType1Effect=INHIBIT&cellType1Treatment=Overexpression%20%5BTOX%5D&interactionType=SIGNATURE&minTau=90&cellType1=T%20cell&cellSubType1=T%20CD8%2B) will be performed to search for drugs with the potential to inhibit the effect of **TOX overexpression** (exhaustion marker) **in T CD8+ cells** will be performed. For this example only associations made with the complete immune signature (upregulated and downregulated genes) will be of interest.


#### Filters applied
- **Cell type/subtype 1**: T cell/ T CD8+.
- **Cell type 1 treatment**: Overexpression [TOX].
- **Drug effect**: Inhibition.
- **Interaction type**: Signature.
- **Min. tau:** 90.

<p align="center">
<img src="assets/help/assets/help/Example_1_signature_ppt.png" alt="Example 1" style="max-width: 50%"></img>
</p>

This query yields a single result, **BIX-01294** (an experimental methyltransferase inhibitor), with a tau score of -91.08. Both genesets are statistically significant (upregulated: 0.014 FDR, downregulated: 0.043 FDR), which indicates that both genesets have been highly relevant for the association with the drug.

The icons in the More information field indicate that *Mus musculus* is the source organism for the immune cells, the experiment was performed *in vitro* and the complete signature (up- and down-regulated genes) is being considered for the drug association.

The summary sentence indicates that this drug might **inhibit** those **T CD8+ cells simulated with LCMV and with TOX overexpression compared to those T CD8+ cells stimulated with LCMV**. This drug targets EHMT2 and EHMT1, and a follow-up search in the literature indicates that these genes are known to be related with CD8+ exhaustion (Birili et al., 2020).

Hovering the mouse over the Signature information field will display a tooltip with detailed information, such as the PubMed ID and title of the publication that is the source of the signature.

<p align="center">
<img src="assets/help/assets/help/TooltipExample1.png" alt="Tooltip ex1" style="max-width: 50%"></img>
</p>

Clicking on the link in the Signature information field displays a panel with three useful links.  

- **PubMed**: a link to the publication that generated the expression data to generate the immune signature.
- **DREIMT Query**: summarized results for the selected immune signature.
- **Signature source**: a link to the source of the immune signature. In cases where the signature has been obtained from the literature and not from a database, this will link to the original publication.

<p align="center">
<img src="assets/help/assets/help/Example_1_signature_detailed_1.png" alt="Example1 detailed" style="max-width: 35%"></img>
</p>

By selecting the **DREIMT Query** option a new page with detailed information for the current signature will be displayed.


**This page displays three summary plots and a table.**
- **Drug prioritization plot (1)**: plot representing all DREIMTdb drug associations (|tau| > 80) with the immune signature. The x-axis represents the tau score, while y-axis represents the -log10(FDR).

 Two areas of interest are depicted in the plot to prioritize drug selection:
 - **Best candidates**: drug associations with |tau| > 90 and a statistically significant FDR (FDR < 0.05).
 - **Good candidates**: drug associations with |tau| > 90 but no statistically significant FDR (FDR > 0.05).

 By default all associations are represented:
 - **Circles**: drug associations using the complete signature (up and down genes)
 - **Upright triangles**: drug associations performed using only the upregulated signature.
 - **Upside-down triangles**: drug associations performed using only the downregulated signature.
 - **Squares**: drug associations performed using genesets.

- **Drugs by approval status (2)**: pie-chart representing the status of drugs associated with the immune signature.
- **Drugs by MOA (3)**: pie-chart representing the mode of action of drugs associated with the immune signature.
- **Drug association table (4)**: summarized database with associations for the specified immune signature. The header contains filter boxes, and once these are applied, the table will filter associations and all plots will update to show filtered results.

Plots can be downloaded in multiple formats (png, jpeg, pdf and svg) using the download buttons. Hovering the mouse over the the plots will display tooltips with detailed information.

<p align="center">
<img src="assets/help/assets/help/PlotsSummarized_filter.png" alt="Plot summary" style="max-width: 50%"></img>
</p>

After **applying filters** in the header of the table to keep only associations made using the complete signature, |tau| > 90 and experimental drugs, the plots automatically update to show table-filtered associations. Hovering the mouse over each point in the plot will activate a tooltip.

<p align="center">
<img src="assets/help/assets/help/PlotsSummarized.png" alt="Plot summary2" style="max-width: 50%"></img>
</p>


#### 3.4 DREIMTdb query example II<a name="query-db2"></a>
In this example we will perform a query to search for approved drugs with the potential to boost human macrophage cell polarization towards a macrophage M1 phenotype instead of to macrophage M2 phenotype. Initially we will need to filter immune signatures generated from the comparison of macrophages M1 and M2, then apply the rest of the filters to narrow our search. This example is intended to demonstrate that "Cell type/subtype 1" and "Cell type/subtype 2" only indicates cells involved in a signature and does not specify which cell type is used as case and which as reference

#### Filters applied (option I)
- **Cell type/subtype 1**: Macrophage/Macrophage M1.
- **Cell type/subtype 2**: Macrophage/Macrophage M2.
- **Organism**: *Homo sapiens*.
- **Drug effect**: Boosting.
- **Drug status**: Approved.

For this filtering we have selected "Boosting" as the drug effect, because the "Drug effect" filter works on the cell type specified in the "Cell type/subtype 1" filter, which, in this case is Macrophage M1.

<p align="center">
<img src="assets/help/assets/help/MacrophagesDB1_ppt.png" alt="Macrophages DB1" style="max-width: 50%"></img>
</p>

#### Filters applied (option II)
- **Cell type/subtype 1**: Macrophage/Macrophage M2.
- **Cell type/subtype 2**: Macrophage/Macrophage M1.
- **Organism**: *Homo sapiens*.
- **Drug effect**: Inhibition.
- **Drug status**: Approved.

For this filtering we have selected "Inhibition" as the drug effect, because the "Drug effect" filter works on the cell type specified in the "Cell type/subtype 1" filter, which, in this case is Macrophage M2.

<p align="center">
<img src="assets/help/assets/help/MacrophagesDB2_ppt.png" alt="Macrophages DB2" style="max-width: 50%"></img>
</p>

Both queries yield the same results, seven drug candidate to modulate macrophage M1/M2 polarization balance. In this case filtered associations have been made using the downregulated genesets from the classical M1 macrophages vs alternative M2 macrophages signature.

<p align="center">
<img src="assets/help/assets/help/MacrophageQueryResults.png" alt="Macrophages results" style="max-width: 50%"></img>
</p>












## 4.  Drug prioritization<a name="Drug-prioritization"></a>
Drug prioritization tool performs drug association prioritizations from user-provided immune gene expression signatures against 4,690 DREIMTdb drug profiles. Drug prioritization tool uses genes that are present in both, the user-provided signature and the DREIMTdb profiles. Genes not present in DREIMTdb profiles will not be used for drug association prioritization.

#### 4.1 Input<a name="queries-input-prioritization"></a>

- **Query title**: (optional) name given to the query. This name will be used to store the results in the Query history panel.

- **Case cell description**: (optional) brief description of the case immune cell used to generate the signature. It is highly recommended to add a short description, as this will be used to create a brief sentence to facilitate the results interpretation.

- **Reference cell description**: (optional) brief description of the reference immune cell used to generate the signature. It is highly recommended to add a short description, as this will be used to create a brief sentence to facilitate the results interpretation.

- **Signature descriptor**: this tab indicates the type of input being queried: signature, signature up, signature down or geneset. If genes are input directly to the text boxes the tab must be manually specified. Once a descriptor is specified, the tool automatically blocks the input of data in certain boxes to avoid incorrect inputs (e.g.. writing a downregulated signature in the upregulated text box). If the input is uploaded as a  csv/tsv file, the descriptor tab will automatically select the correct option based on the csv file content.

- **Query genes**: user-provided immune signature, can be input as a list of genes pasted into the text boxes or as a csv/tsv file. For a complete description of input formats see [Input genes](help#inputs).

<p align="center">
<img src="assets/help/assets/help/DrugPrioritization_panel1.png" alt="Drug prioritization" style="max-width: 50%"></img>
</p>

This tool only accepts a single query at time, as each query requires its own separate input.

Input gene lists must contain a **minimum of 15** and a **maximum of 200 genes** matching DREIMdb drug profile genes, otherwise the tool will indicate an error and the analysis will not be performed.

Genes are required to be in **gene symbol** format.

#### 4.2 Drug prioritization example<a name="example1"></a>

In this example the input is a signature derived from the comparison of M1 macrophages vs M2 macrophages, which corresponds to one of the [preloaded examples](http://dreimt.org/query/drug-prioritization/results/signature/4a99eb2b-b591-4bf1-b53b-d1ef83950463) (Coates et al 2008). For demonstration purposes the cells are labeled as "cells with M1 markers" and "cells with M2 markers".

<p align="center">
<img src="assets/help/assets/help/EjemploPrioritization.png" alt="Example prioritization" style="max-width: 50%"></img>
</p>

After launching the query, a message will indicate that the analysis is being performed, and in a few minutes the results will appear on the screen. The window can be closed while the analysis is running, the results will be stored in the query [history panel](help#queries-history) with the name given in the query title.

<p align="center">
<img src="assets/help/assets/help/WaitingMsg.png" alt="Waiting" style="max-width: 35%"></img>
</p>

Once the analysis is performed a page with results will be displayed.

**This page displays three summary plots and a table.**
- **Query parameters (1)**: panel with summarized analysis information:
 - **Query up genesets**: number of user-provided genes in the upregulated geneset.
 - **Query down genes**: number of user-provided genes in downregulated geneset.
 - **Query up genes in DREIMT**: number of user-provided upregulated genes that match genes in the drug profiles. Matching genes are used for drug-gene expression signature association analyses.
 - **Query down genes in DREIMT**: number of user-provided downregulated genes that match genes in the drug profiles. Matching genes are used for drug-gene expression signature association analyses.

- **Drug prioritization plot (2)**: plot representing all drugs associated (tau > |75|) with the user-provided immune signature. The x-axis represents the tau score, while the y-axis represents the -log10(FDR).

 Two areas of interest are depicted in the plot to prioritize drug selection:
 - **Best candidates**: drug associations with |tau| > 90 and a statistically significant FDR (FDR < 0.05).
 - **Good candidates**: drug associations with |tau| > 90 but no statistically significant FDR (FDR > 0.05).

- **Drugs by approval status (3)**: pie-chart representing the status of drugs associated with the immune signature.
- **Drugs by MOA (4)**: pie-chart representing the mode of action of drugs associated with the immune signature.
- **Drug predictions table (5)**: summarized table with associations (tau > |75|) for the user-provided immune signature. The table can be filtered using the header filters, any filtering applied to this table will update the plots.

<p align="center">
<img src="assets/help/assets/help/PriotirizationResults1.png" alt="Prioritization results1" style="max-width: 50%"></img>
</p>

Note how a proper case and reference cell description facilitates drug association results interpretation by creating a meaningful summary sentence.

The user-provided signature contains 81 upregulated and 78 downregulated genes. Of those, 61 upregulated and 55 downregulated genes matched DREIMTdb drug profiles genes and were used to generate drug associations with the signature. Genes used for the drug association can be downloaded in plain text format by pressing the download query genes button. The result association table can be downloaded as a csv file.

A total of 306 drugs are associated (|tau| > 75) with the user-provided signature, and an initial search to retrieve the topmost interesting drug hypotheses should be centered on drugs falling in the plot areas (|tau| > 90) of best candidates and good candidates.


<p align="center">
<img src="assets/help/assets/help/EjemploPrioritization_tau90.png" alt="Prioritization tau 90" style="max-width: 50%"></img>
</p>

After filtering associations by |tau| > 90, 35 potential drug hypotheses are candidate for further investigation.









## 5. Signature comparison<a name="comparison"></a>
Signature comparison tool performs geneset-pairwise Fisher's exact test and Jaccard index analyses to test the existence of significant gene overlap between the  user-provided gene expression signature and DREIMTdb signatures. From this the user can explore drug associations for the topmost similar DREIMTdb signatures.

#### 5.1 Input<a name="queries-input-comparison"></a>
- **Query title**: (optional) name given to the query. This name will be used to store the results of the query in the Query history panel.

- **Filters my query**: (optional) filters DREIMTdb signatures to which the user-provided signature will be compared. The matching signatures string indicates the number of DREIMTdb filtered. If nothing is specified the comparison will be performed against all DREIMTdb signatures (currently 2,687).

- **Perform analysis using only genes in DREIMT**: (optional) specifies the genes used to perform comparison analysis. If marked, only genes in DREIMTdb drug profiles will be used to compare user-provided signature to DREIMTdb signatures. If this option is not marked, all genes will be used to compare the user-provided signature to DREIMTdb signatures.

- **Query genes**: user-provided immune signature, can be input as a list of genes pasted to the text boxes or as a csv/tsv file. For a complete description of input formats see [Input genes](help#inputs).

<p align="center">
<img src="assets/help/assets/help/Panel_Jaccard.png" alt="Panel Jaccard" style="max-width: 50%"></img>
</p>


This tool only accepts a single query at time, as each query requires its own separate input.

Genes can be provided directly to the text box as a **list of genes** or uploaded in a **csv/tsv** format file. Genesets must contain a **minimum of 15** and a **maximum  of 200 genes** , otherwise the tool will indicate an error and the analysis will not be performed.

Genes are required to be in **gene symbol** format.

#### 5.2 Signature comparison example<a name="comparison-example-1"></a>
In this example the user-provided signature will be compared to all DREIMTdb signatures. For demonstration purposes the user-provided signature is a DREIMTdb signature derived from comparing macrophages M1 vs M2, which correspond to one of the preloaded [examples](http://dreimt.org/query/drug-prioritization/results/signature/4a99eb2b-b591-4bf1-b53b-d1ef83950463) (Coates et al 2008).

<p align="center">
<img src="assets/help/assets/help/Jaccard_panel_query1_ppt.png" alt="Panel query1" style="max-width: 50%"></img>
</p>

After launching the query, a message will indicate that the analysis is being performed, and in a few minutes the results will appear on the screen. The window can be closed while the analysis is running, the results will be stored in the [queries history](help#queries-history) panel with the name given in the query title.

<p align="center">
<img src="assets/help/assets/help/WaitingMsg.png" alt="Waiting message 2" style="max-width: 35%"></img>
</p>

**Results page displays two plots and three tables**

- **Query parameters (1)**: panel with summarized analysis information.
 - **Query up genesets**: number of user-provided genes in the upregulated geneset.
 - **Query down genes**: number of user-provided genes in downregulated geneset.
 - **Query up genes in DREIMT**: number of user-provided upregulated genes that match genes in the drug profiles. Matching genes are used for drug-gene expression signature association analyses.
 - **Query down genes in DREIMT**: number of user-provided downregulated genes that match genes in the drug profiles. Matching genes are used for drug-gene expression signature association analyses.

- **Enrichment Cell type plot (2)**: bar-chart results for cell type enrichment analysis. This plot indicates whether the user-provided signature significantly overlaps with DREIMTdb signatures derived from a specific cell type. This analysis is on based in cell types filtered in the signature comparison table (5), by default only DREIMTdb signatures with a significant gene overlap (FDR < 0.05) are accounted. This threshold can be modified using a different threshold for p-value, FDR or Jaccard index. Bars are ordered by p-value, with their length representing the significance for the specific cell type, and bars with p-value < 0.05 are color-coded. By default all cell types are tested unless a signature filtering is specified in the input (Filters my query option). A maximum of 10 bars are shown.

- **Enrichment Cell subtype plot (3)**: bar-chart results for cell subtype enrichment analysis. This plot indicates whether the user-provided signature significantly overlaps with DREIMTdb signatures derived from a specific cell subtype. This analysis is on based in cell subtypes filtered in the signature comparison table (5), by default only DREIMTdb signatures with a significant gene overlap (FDR < 0.05) are accounted. This threshold can be modified using a different threshold for p-value, FDR or Jaccard index. Bars are ordered by p-value, with their length representing the significance for the specific cell type, and bars with p-value < 0.05 are color-coded. By default all cell types are tested unless a signature filtering is specified in the input (Filters my query option). A maximum of 10 bars are shown.

- **Enrichment Cell type raw data (4)**: raw data used to generate the enrichment cell type plot. The table can be downloaded in csv format. A maximum of 10 bars are shown.

- **Enrichment Cell subtype raw data (5)**: raw data used to generate the enrichment cell subtype plot. The table can be downloaded in csv format.

- **Signature comparison table (6)**: table with summarized pairwise user-provided-DREIMTdb geneset comparisons. By default only genesets with significant overlaps are shown (FDR < 0.05).
 - **User geneset**: indicates which user-provided geneset is compared to a DREIMTdb signature.
 - **Database geneset**: indicates which DREIMTdb geneset is compared to the user-provided geneset.
 - **Target signature info.**: indicates the DREIMTdb signature name, it also includes a pop-up panel with DREIMTdb signature related links to: signature source database, DREIMTdb summarized results and NCBI data generation publication.
 - **P-value**: Fisher's exact test p-value from the comparison of the user-provided immune genesets and DREIMTdb immune geneset.
 - **FDR**: Fisher's exact test adjusted p-value (by default filter set at FDR = 0.05).
 - **Jaccard**: Jaccard index value from the comparison of the user-provided immune geneset against the DREIMTdb immune geneset. Includes a link to download a file with genes common to both the user-provided and DREIMTdb geneset.

<p align="center">
<img src="assets/help/assets/help/ComparisonEx1.png" alt="Comparison 1" style="max-width: 50%"></img>
</p>

The bar plots indicate that the user-provided signature significantly (p-value < 0.05) overlaps with DREIMTdb signatures derived from macrophage and monocyte (cell types) and macrophage M1, macrophage, monocyte and macrophage M2 (cell subtypes). By default only signatures with a significant (Fisher's exact test FDR < 0.05) gene overlap between user-provided geneset and DREIMTdb geneset are considered for this analysis. This can be modified by applying other FDR, p-value or Jaccard threshold values, which will in turn update bar plot results.


<p align="center">
<img src="assets/help/assets/help/ComparisonEx2.png" alt="Comparison 1" style="max-width: 60%"></img>
</p>

In this example the user-provided signature corresponds to a signature included in DREIMTdb, both the upregulated and downregulated genesets have a perfect match (Jaccard index = 1) with their respective genesets.

For signatures of interest (generally those most similar to the user-provided signature) information interest can be retrieved using the pop-up panel in the Target signature information column:

- **PubMed**: a link to the publication that reported the expression data used to generate the immune signature.
- **DREIMT Query**: summarized results for the selected immune signature.
- **Signature source**: a link to the source of the immune signature, in cases where the signature has been obtained from the literature and not from a database this will link to the original publication.

<p align="center">
<img src="assets/help/assets/help/PopUpComparison.png" alt="pop-up panel" style="max-width: 60%"></img>
</p>





## 6. Input genes<a name="inputs"></a>
Drug prioritization and signature comparison tool take user-provided signatures in two formats:

#### Input file (csv/tsv)
The input file can either be a **one or two columns** csv/tsv file. Files with more than two columns will not be processed and an error message will be displayed:

- **One column**: for single geneset queries, shuch as upregulated signature, downregulated signature or a geneset without specified direction.
- **Two columns**: for complete signatures (upregulated and downregulated geneset).


The first line must contain column headings that identify the content of each column:
- **GENES_UP**: specifies that the column contains upregulated genes.
- **GENES_DN**: specifies that the column contains downregulated genes.
- **GENES**: specifies that the column contains genes without a specific direction.

Example of the top rows of the four possible csv inputs.

<p align="center">
<img src="assets/help/assets/help/FileHeader.png" alt="File header" style="max-width: 50%"></img>
</p>

#### Input text box
Genes can be input in their corresponding text boxes in a single line (whitespaces or tab separated) or as a list (single gene per line).

<p align="center">
<img src="assets/help/assets/help/InputBoxes.png" alt="Input boxes" style="max-width: 50%"></img>
</p>






## 7. Query history<a name="queries-history"></a>
Drug prioritization and Signature comparison results will be accessible through the Query history menu. A panel will display the queries performed. Results will be **stored** in DREIMT for a period of **one month**.

<p align="center">
<img src="assets/help/assets/help/HistoryPanel.png" alt="History panel" style="max-width: 40%"></img>
</p>












## 8. Error messages<a name="errors"></a>
The csv/tsv file contains more than two columns.

<p align="center">
<img src="assets/help/assets/help/Error3columns.png" alt="Error 1" style="max-width: 20%"></img>
</p>

The csv/tsv file header is not specified as expected.

<p align="center">
<img src="assets/help/assets/help/ErrorHeader.png" alt="Error 3" style="max-width: 20%"></img>
</p>

The query its out of the required range of a minimum 15 genes and maximum of 200 and/or does not contain (15-200) genes matching drug profile genes.

<p align="center">
<img src="assets/help/assets/help/ErrorSize.png" alt="Error 2" style="max-width: 20%"></img>
</p>










## 9. FAQ<a name="faqs"></a>
#### 9.1 Why are there duplicated drugs?<a name="f1"></a>
DREIMTdb contains 4,690 different drug profiles of which 3,580 correspond to unique compounds. Duplicated drugs correspond to compounds with different BROAD ID. Because of this, duplicated drugs in DREIMTdb might show different, even opposite tau scores for the same immune signature. DREIMTdb indicates compounds with multiple drug profiles with and exclamation mark icon and adding a warning in the drug tooltip.

<p align="center">
<img src="assets/help/assets/help/DuplicatedDrug.png" alt="Drug warning" style="max-width: 10%"></img>
</p>

#### 9.2 Why did the tau score change?<a name="f2"></a>
Changes in tau prioritization score and FDR values can occur after a database update.
#### 9.3 How do I interpret the tau score?<a name="f3"></a>
The interpretation of the tau score can, in some cases, be complicated. For signatures, signature up and genesets, a positive tau indicates a boosting effect of the drug over the case cell compared to the reference (or as inhibiting the reference cell compared to the case cell). A negative tau has the opposite interpretation. Contrary a positive tau for a signature down indicate that the drug inhibits the case cell compared to the reference cell.
For this reason, DREIMT includes a summary sentence to ease result interpretation.

| Interaction type | TAU | Boosts | Inhibits | Prediction summary |
|------------------------------------ |----- |-------- |---------- |-------------------------------- |
| Signature / Signature up / Geneset | > 0 | A | B | Drug <span style="color:red">boosts</span> A compared to B |
| Signature / Signature up / Geneset | < 0 | B | A | Drug <span style="color:green">inhibits</span> A compared to B |
| Geneset | > 0 | A | B | Drug <span style="color:red">boosts</span> A |
| Geneset | < 0 | B | A | Drug <span style="color:green">inhibits</span> A |
| Signature down | > 0 | B | A | Drug <span style="color:red">boosts</span> B compared to A |
| Signature down | < 0 | A | B | Drugs <span style="color:green">inhibits</span> B compared to A |

#### 9.4 What does signature and geneset mean?<a name="f4"></a>
- **Drug profile**: Gene list rank-ordered according to their differential expression, cell treated with a drug relative to control cells.
- **Signature**: Gene list rank-ordered according to their differential expression, immune cells relative to control. Signatures can be composed of either one or both of the follwing genesets:
 - **Signature up**: geneset composed of the topmost signature upregulated genes.
 - **Signature down**: geneset composed of the topmost signature downregulated genes.
- **Geneset**: group of genes representing an immune cell without specified control (e.g. macrophage core genes).
