# Structures

## Document Properties

### Dop

The Dop structure contains the document and compatibility settings for
the document.

Based on the value of [Fib](#fib).**cswNew**, the Dop is a structure
from the following table.


| Value | Meaning |
| --- | --- |
| 0 | Dop97 |
| otherwise | Based on the value of FibRgCswNew . nFibNew the Dop is a structure from the following: |



### DopBase

The **DopBase** structure contains document and compatibility settings
that are common to all versions of the binary document. These settings
influence the appearance and behavior of the current document and store
document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | B | C | D |  | fpc |  | E | unused4 |  |  |  |  |  |  |  | F |  | nFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |
| G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z | a | b | c | d | e | f | g | h | i | j | k | l |
| copts60 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | dxaTab |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cpgWebOpt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | dxaHotZ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cConsecHypLim |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | wSpare2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dttmCreated |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dttmRevised |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dttmLastPrint |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| nRevision |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | tmEdited |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cWords |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cCh |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cPg |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cParas |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| m |  | nEdn |  |  |  |  |  |  |  |  |  |  |  |  |  | epc |  | n |  |  |  | o |  |  |  | p | q | r | s | t | u |
| cLines |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cWordsWithSubdocs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cChWithSubdocs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cPgWithSubdocs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cParasWithSubdocs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cLinesWithSubdocs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | lKeyProtDoc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | v |  |  | pctWwdSaved |  |  |  |  |  |  |  |  | w |  | x | y |



**A - fFacingPages (1 bit):** A bit that specifies whether even and odd
pages have different headers and footers as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.10.1 evenAndOddHeaders, where **titlePg** corresponds to the
section property [sprmSFTitlePage](#section-properties).

**B - unused1 (1 bit):** This value is undefined and MUST be ignored.

**C - fPMHMainDoc (1 bit):** A bit that specifies whether this document
is a [**mail merge main
document**](#gt_4f32ec41-827b-4288-bd86-6d6139262ce6).

**D - unused2 (2 bits):** This value is undefined and MUST be ignored.

**fpc (2 bits):** Specifies where footnotes are placed on the page when
they are referenced by text in the current document for documents that
have an [**nFib**](#Section_fe6610529c884ae1aec444799b2b4777) value that
is less than or equal to 0x00D9. This MUST be one of the following
values.

| Value | Meaning                                                                                                                                  |
|-------|------------------------------------------------------------------------------------------------------------------------------------------|
| 0     | Specifies that all footnotes are placed at the end of the section in which they are referenced.                                          |
| 1     | Specifies that footnotes are displayed at the bottom margin of the page on which the note reference mark appears.                        |
| 2     | Specifies that footnotes are displayed immediately following the last line of text on the page on which the note reference mark appears. |

**E - unused3 (1 bit):** This value is undefined and MUST be ignored.

**unused4 (8 bits):** This value is undefined and MUST be ignored.

**F - rncFtn (2 bits):** Specifies when all automatic numbering for the
footnote reference marks is restarted for documents that have an
**nFib** value that is less than or equal to 0x00D9. For those documents
that rely on **rncFtn**, when restarted, the next automatically numbered
footnote in the document restarts to the specified **nFtn** value. This
MUST be one of the following values.

| Value | Meaning                                                                                                           |
|-------|-------------------------------------------------------------------------------------------------------------------|
| 0     | Specifies that the numbering of footnotes continues from the previous section in the document.                    |
| 1     | Specifies that the numbering of footnotes is reset to the starting value for each unique section in the document. |
| 2     | Specifies that the numbering of footnotes is reset to the starting value for each unique page in the document.    |

**nFtn (14 bits):** For those documents that have an **nFib** value that
is less than or equal to 0x00D9, this element specifies the starting
number for the first automatically numbered footnotes in the document,
and the first automatically numbered footnotes after each restart point
that is specified by the **rncFtn** element.

**G - unused5 (1 bit):** This value is undefined and MUST be ignored.

**H - unused6 (1 bit):** This value is undefined and MUST be ignored.

**I - unused7 (1 bit):** This value is undefined and MUST be ignored.

**J - unused8 (1 bit):** This value is undefined and MUST be ignored.

**K - unused9 (1 bit):** This value is undefined and MUST be ignored.

**L - unused10 (1 bit):** This value is undefined and MUST be ignored.

**M - fSplAllDone (1 bit):** Specifies whether all content in this
document was already checked by the spelling checker.

**N - fSplAllClean (1 bit):** Specifies whether all content in this
document can be considered to be spelled correctly.

**O - fSplHideErrors (1 bit):** Specifies whether visual cues are not
displayed around content contained in a document which is flagged as a
possible spelling error.

**P - fGramHideErrors (1 bit):** Specifies whether visual cues are not
displayed around content that is contained in a document and flagged as
a possible grammar error.

**Q - fLabelDoc (1 bit):** Specifies whether the document is a mail
merge [**labels document**](#gt_242f86a5-2dc4-4ef3-8d4a-d1b5a7aed0aa).

When the value is 1, the document was created as a labels document.

**R - fHyphCapitals (1 bit):** Specifies whether words that are composed
of all capital letters are hyphenated in a given document when
**fAutoHyphen** is set to 1.

**S - fAutoHyphen (1 bit):** Specifies whether text is hyphenated
automatically, as needed, when displayed as specified in \[ECMA-376\]
Part 1, section 17.15.1.10 autoHyphenation.

**T - fFormNoFields (1 bit):** Specifies that there are no editable
regions in a document that is currently protected for form field fill-in
(**fProtEnabled** is 1). This value MUST be 0 if **fProtEnabled** is 0.

**U - fLinkStyles (1 bit):** Specifies whether the styles of the
document are updated to match those of the attached template as
specified in \[ECMA-376\] Part 1, Section 17.15.1.55 linkStyles, where
the attachedTemplate value refers to entry 0x01 in
[SttbfAssoc](#sttbfassoc).

**V - fRevMarking (1 bit):** Specifies whether edits are tracked as
revisions. If the value of **fLockRev** is set to 1, the value of
**fRevMarking** MUST also be set to 1, as specified in \[ECMA-376\] Part
1, Section 17.15.1.89 trackRevisions.

**W - unused11 (1 bit):** This value is undefined and MUST be ignored.

**X - fExactCWords (1 bit):** In conjunction with
**fIncludeSubdocsInStats**, this bit specifies whether the values stored
in **cCh**, **cChWS**, **cWords**, **cParas**, **cLines**, **cDBC**,
**cChWithSubdocs**, **cChWSWithSubdocs**, **cWordsWithSubdocs**,
**cParasWithSubdocs**, **cLinesWithSubdocs**, or **cDBCWithSubdocs**
accurately reflect the current state of the document. When the value of
**fExactCWords** is 0, none of the mentioned fields contain accurate
values. When the value of **fExactCWords** is 1, the value of
**fIncludeSubdocsInStats** determines which set of fields contains
accurate values.

**Y - fPagHidden (1 bit):** This value is undefined and MUST be ignored.

**Z - fPagResults (1 bit):** This value is undefined and MUST be
ignored.

**a - fLockAtn (1 bit):** Specifies whether protection for comments was
applied to the document or, if
[Dop2003](#dop2003).**fTreatLockAtnAsReadOnly** has a value of 1,
whether read-only protection was applied to the document. These
restrictions are used to prevent unintentional changes to all or part of
a document. Because this protection does not encrypt the document,
malicious applications can circumvent its use. This protection is not
intended as a security feature and can be ignored. When **fLockAtn** is
1, **fLockRev** MUST be 0 and **fProtEnabled**
SHOULD<span id="Appendix_A_Target_164"
class="anchor"></span>[\<164\>](#Appendix_A_164) be 0. **fLockAtn** can
be one of the following.


| Value | Meaning |
| --- | --- |
| 0 | Specifies that the edits made to this document are restricted to the following: |
| 1 | Specifies that the edits made to this document are restricted to the following: |



**b - fMirrorMargins (1 bit):** Specifies that the left and right
margins that are defined in the section properties are swapped on facing
pages.

**c - fWord97Compat (1 bit):** Specifies that this document was in
[**Word97 compatibility
mode**](#gt_1d48627f-2bd0-4073-aabc-f05857b1394c) when last saved.

**d - unused12 (1 bit):** This value is undefined and MUST be ignored.

**e - unused13 (1 bit):** This value is undefined and MUST be ignored.

**f - fProtEnabled (1 bit):** Specifies that the edits that are made to
this document are restricted to the editing of form fields in sections
that are protected (see sprmSFProtected). All other sections have no
editing restrictions resulting from this setting. When **fProtEnabled**
is 1, both **fLockAtn** and **fLockRev**
SHOULD<span id="Appendix_A_Target_165"
class="anchor"></span>[\<165\>](#Appendix_A_165) be 0.

**g - fDispFormFldSel (1 bit):** If the document is currently protected
for form field fill-in (**fProtEnabled** is 1), this bit specifies that
the selection was within a display form field (check box or list box)
the last time that the document was saved.

**h - fRMView (1 bit):** Specifies whether to show any revision markup
that is present in this document.

**i - fRMPrint (1 bit):** Specifies whether to print any revision markup
that is present in the document. SHOULD<span id="Appendix_A_Target_166"
class="anchor"></span>[\<166\>](#Appendix_A_166) be the same value as
**fRMView**.

**j - fLockVbaProj (1 bit):** Specifies whether the Microsoft Visual
Basic project is locked from editing and viewing.

**k - fLockRev (1 bit):** Specifies whether to track all edits made to
this document as revisions. Additionally specifies that **fRevMarking**
MUST be 1 for the duration that **fLockRev** is 1. When **fLockRev** is
1, **fLockAtn** MUST be 0 and **fProtEnabled**
SHOULD[\<167\>](#Appendix_A_167) be 0.

**l - fEmbedFonts (1 bit):** Specifies that TrueType fonts are embedded
in the document when the document is saved as specified in \[ECMA-376\]
Part 1, Section 17.8.3.8 embedTrueTypeFonts.

**copts60 (2 bytes):** A [copts60](#copts60) that specifies
compatibility options.

**dxaTab (2 bytes):** Specifies the default tab stop interval, in
[**twips**](#gt_4b82472c-103d-4eff-a07e-6a0f784e3382), to use when
generating automatic tab stops as specified in \[ECMA-376\] Part 1,
Section 17.15.1.25 defaultTabStop.

**cpgWebOpt (2 bytes):** Specifies the [**code
page**](#gt_210637d9-9634-4652-a935-ded3cd434f38) to use when saving to
[**HTML**](#gt_549c4960-e8be-4c24-bc2b-b86530f1c1bf).

**dxaHotZ (2 bytes):** Specifies the maximum amount of white space, in
twips, allowed at the end of the line before attempting to hyphenate the
next word as specified in \[ECMA-376\] Part 1, Section 17.15.1.53
hyphenationZone.

**cConsecHypLim (2 bytes):** Specifies the maximum number of consecutive
lines that can end in a hyphenated word before ignoring automatic
hyphenation rules for one line as specified in \[ECMA-376\] Part 1,
Section 17.15.1.22 consecutiveHyphenLimit.

**wSpare2 (2 bytes):** This value MUST be 0, and MUST be ignored.

**dttmCreated (4 bytes):** A [**DTTM**](#dttm) that
MAY<span id="Appendix_A_Target_168"
class="anchor"></span>[\<168\>](#Appendix_A_168) specify the date and
time at which the document was created.

**dttmRevised (4 bytes):** A **DTTM** that specifies the date and time
at which the document was last saved.

**dttmLastPrint (4 bytes):** A **DTTM** that
MAY<span id="Appendix_A_Target_169"
class="anchor"></span>[\<169\>](#Appendix_A_169) specify the date and
time at which the document was last printed.

**nRevision (2 bytes):** A signed integer that
MAY<span id="Appendix_A_Target_170"
class="anchor"></span>[\<170\>](#Appendix_A_170) specify the number of
times that this document was resaved. This MUST be a value between 0 and
0x7FFF.

**tmEdited (4 bytes):** A signed integer value that
MAY[\<171\>](#Appendix_A_171) specify the time it took, in minutes, for
the document to be opened for editing and then subsequently saved.

**cWords (4 bytes):** A signed integer value that specifies the last
calculated or the estimated count of words in the main document,
depending on **fExactCWords** and **fIncludeSubdocsInStats**.

**cCh (4 bytes):** A signed integer value that specifies the last
calculated or estimated count of characters in the main document,
depending on the values of **fExactCWords** and
**fIncludeSubdocsInStats**. The character count excludes whitespace.

**cPg (2 bytes):** A signed integer value that specifies the last
calculated or estimated count of pages in the main document, depending
on the values of **fExactCWords** and **fIncludeSubdocsInStats**.

**cParas (4 bytes):** A signed integer value that specifies the last
calculated or estimated count of paragraphs in the main document,
depending on the values of **fExactCWords** and
**fIncludeSubdocsInStats**.

**m - rncEdn (2 bits):** Specifies when automatic numbering for the
endnote reference marks is reset to the beginning number for documents
that have an nFib value that is less than or equal to 0x00D9. For those
documents that rely on **rncEdn**, when restarted, the next
automatically numbered endnote in the document is reset to the specified
**nEdn** value. This value MUST be one of the following.

| Value | Meaning                                                                                                          |
|-------|------------------------------------------------------------------------------------------------------------------|
| 0     | Specifies that the numbering of endnotes continues from the previous section in the document.                    |
| 1     | Specifies that the numbering of endnotes is reset to its starting value for each unique section in the document. |
| 2     | Specifies that the numbering of endnotes is reset to its starting value for each unique page in the document.    |

**nEdn (14 bits):** For those documents that have an nFib value that is
less than or equal to 0x00D9, this element specifies the starting number
for the first automatically numbered endnote in the document, and the
first automatically numbered endnote after each restart point that is
specified by the **rncEdn** element.

**epc (2 bits):** Specifies where endnotes are placed on the page when
they are referenced by text in the current document. This value MUST be
one of the following.

| Value | Meaning                                                                                                                                |
|-------|----------------------------------------------------------------------------------------------------------------------------------------|
| 0     | Specifies that endnotes are placed at the end of the section in which they are referenced.                                             |
| 3     | Specifies that all endnotes are placed at the end of the current document, regardless of the section within which they are referenced. |

**n - unused14 (4 bits):** This value is undefined and MUST be ignored.

**o - unused15 (4 bits):** This value is undefined and MUST be ignored.

**p - fPrintFormData (1 bit):** Specifies whether to print only form
field results, as specified in \[ECMA-376\] Part 1, Section 17.15.1.61
printFormsData.

**q - fSaveFormData (1 bit):** Specifies whether the application
SHOULD[\<172\>](#Appendix_A_172) only save form field contents into a
comma-delimited text file and ignore all other content in the document
as specified in \[ECMA-376\] Part 1, Section 17.15.1.73 saveFormsData.

**r - fShadeFormData (1 bit):** Specifies whether to display visual cues
around form fields as specified in \[ECMA-376\] Part 1, Section
17.15.1.39 doNotShadeFormData, where the meaning of the
**doNotShadeFormData** element is the opposite of **fShadeFormData**.

**s - fShadeMergeFields (1 bit):** Specifies whether to display visual
cues around mail merge fields.

**t - reserved2 (1 bit):** This value MUST be 0, and MUST be ignored.

**u - fIncludeSubdocsInStats (1 bit):** Specifies whether **cCh**,
**cChWS**, **cWords**, **cParas**, **cLines**, **cDBC**,
**cChWithSubdocs**, **cChWSWithSubdocs**, **cWordsWithSubdocs**,
**cParasWithSubdocs**, **cLinesWithSubdocs**, or **cDBCWithSubdocs** are
calculated and displayed, or estimated.

**cLines (4 bytes):** A signed integer that specifies the last
calculated or estimated count of lines in the main document, depending
on the values of **fExactCWords** and **fIncludeSubdocsInStats**.

**cWordsWithSubdocs (4 bytes):** A signed integer that specifies the
last calculated or estimated count of words in the main document,
footnotes, endnotes, and text boxes in the main document, depending on
the values of **fExactCWords** and **fIncludeSubdocsInStats**.

**cChWithSubdocs (4 bytes):** A signed integer that specifies the last
calculated or estimated count of characters, excluding whitespace, in
the main document, footnotes, endnotes, and text boxes in the main
document, depending on the values of **fExactCWords** and
**fIncludeSubdocsInStats**.

**cPgWithSubdocs (2 bytes):** A signed integer that specifies the last
calculated or estimated count of pages in the main document, footnotes,
endnotes, and text boxes that are anchored in the main document,
depending on the values of **fExactCWords** and
**fIncludeSubdocsInStats**.

**cParasWithSubdocs (4 bytes):** A signed integer that specifies the
last calculated or estimated count of paragraphs in the main document,
footnotes, endnotes, and text boxes that are anchored in the main
document, depending on the values of **fExactCWords** and
**fIncludeSubdocsInStats**.

**cLinesWithSubdocs (4 bytes):** A signed integer that specifies the
last calculated or estimated count of lines in the main document,
footnotes, endnotes, and text boxes that are anchored in the main
document, depending on the values of **fExactCWords** and
**fIncludeSubdocsInStats**.

**lKeyProtDoc (4 bytes):** A signed integer that specifies the hash of
the password that is used with document protection (**fLockRev**,
**fProtEnabled**, **fLockAtn** and **fRevMarking**), as specified in
\[ECMA-376\] Part 1, Section 17.15.1.29 documentProtection.

**v - wvkoSaved (3 bits):** Specifies the viewing mode that was in use
when the document was last saved. If the viewing mode that was in use
cannot be represented by a valid value, an alternate view mode is
specified. See \[ECMA-376\] Part 1, section 17.15.1.92 view; the values
are mapped as follows.

| wvkoSaved value | ECMA attribute value |
|-----------------|----------------------|
| 0               | none                 |
| 1               | print                |
| 2               | outline              |
| 3               | masterPages          |
| 4               | normal               |
| 5               | web                  |

A value of 0 specifies the default view mode of the application.

**pctWwdSaved (9 bits):** Specifies the zoom percentage that was in use
when the document was saved. A value of 0 specifies the default zoom
percentage of the application. This value MUST be 0 or a value between
10 and 500.

**w - zkSaved (2 bits):** Specifies the zoom type that was in use when
the document was saved. See \[ECMA-376\] Part 1, Section 17.18.105
ST_Zoom; the values are mapped as follows.

| zkSaved value | ECMA attribute value |
|---------------|----------------------|
| 0             | none                 |
| 1             | fullPage             |
| 2             | bestFit              |
| 3             | textFit              |

**x - unused16 (1 bit):** This value is undefined and MUST be ignored.

**y - iGutterPos (1 bit):** Specifies whether the document gutter shall
be positioned at the top of the pages of the document when the document
is displayed. See \[ECMA-376\] Part 1, Section 17.15.1.50 gutterAtTop,
where **mirrorMargins** corresponds to **fMirrorMargins**,
**bookFoldPrinting** corresponds to [Dop2002](#dop2002).**fFolioPrint**,
**bookFoldRevPrinting** corresponds to Dop2002.**fReverseFolio** and
**printTwoOnOne** corresponds to
[DopTypography](#doptypography).**f2on1**.

### Dop95

The **Dop95** structure contains document and compatibility settings.
These settings influence the appearance and behavior of the current
document and store document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dopBase (84 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| copts80 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**dopBase (84 bytes):** A [**DopBase**](#dopbase) structure that
specifies document and compatibility settings.

**copts80 (4 bytes):** A [copts80](#copts80) specifying compatibility
options. **Copts80.copts60** components MUST be equal to
**DopBase.copts60**.

### Dop97

The **Dop97** structure contains document and compatibility settings.
These settings influence the appearance and behavior of the current
document and store the document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dop95 (88 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| adt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | doptypography (310 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dogrid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | A | lvlDop |  |  |  | B | C | D | E | F | G | H | I | J | K | L |
| unused5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | asumyi |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cChWS |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cChWSWithSubdocs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | grfDocEvents |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | M | N | KeyVirusSession30 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | space (30 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cpMaxListCacheMainDoc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ilfoLastBulletMain |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ilfoLastNumberMain |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cDBC |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cDBCWithSubdocs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved3a |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| nfcFtnRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | nfcEdnRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| hpsZoomFontPag |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | dywDispPag |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**dop95 (88 bytes):** A [**Dop95**](#dop95) that specifies document and
compatibility settings.

**adt (2 bytes):** Specifies the document classification as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.15.1.30 documentType; the values are mapped as follows.

| adt value | ECMA attribute value |
|-----------|----------------------|
| 0x0000    | notSpecified         |
| 0x0001    | letter               |
| 0x0002    | eMail                |

**doptypography (310 bytes):** A [DopTypography](#doptypography) that
specifies typography settings.

**dogrid (10 bytes):** A [Dogrid](#dogrid) that specifies the draw
object grid settings.

**A - unused1 (1 bit):** This bit is undefined and MUST be ignored.

**lvlDop (4 bits):** This value SHOULD[\<173\>](#Appendix_A_173) specify
which outline levels were showing in outline view at the time of the
last save operation. This MUST be a value between 0 and 9, inclusive, or
this value MUST be 15.

| Value | Levels showing                         |
|-------|----------------------------------------|
| 0x0   | Heading 1                              |
| 0x1   | Headings 1 and 2                       |
| 0x2   | Headings 1, 2 and 3                    |
| 0x3   | Headings 1, 2, 3 and 4                 |
| 0x4   | Headings 1, 2, 3, 4 and 5              |
| 0x5   | Headings 1, 2, 3, 4, 5 and 6           |
| 0x6   | Headings 1, 2, 3, 4, 5, 6 and 7        |
| 0x7   | Headings 1, 2, 3, 4, 5, 6, 7 and 8     |
| 0x8   | Headings 1, 2, 3, 4, 5 , 6, 7, 8 and 9 |
| 0x9   | All levels                             |
| 0xF   | All levels                             |

**B - fGramAllDone (1 bit):** Specifies whether the grammar of all
content in this document was checked.

**C - fGramAllClean (1 bit):** Specifies whether all content in this
document can be considered grammatically correct.

**D - fSubsetFonts (1 bit):** Specifies whether to subset fonts when
embedding as specified in \[ECMA-376\] Part 1, Section 17.8.3.15
saveSubsetFonts, where **embedTrueTypeFonts** refers to
[DopBase](#dopbase).**fEmbedFonts**.

**E - unused2 (1 bit):** This value is undefined and MUST be ignored.

**F - fHtmlDoc (1 bit):** This value
SHOULD<span id="Appendix_A_Target_174"
class="anchor"></span>[\<174\>](#Appendix_A_174) be 0.

**G - fDiskLvcInvalid (1 bit):** This bit
MAY<span id="Appendix_A_Target_175"
class="anchor"></span>[\<175\>](#Appendix_A_175) specify whether the
saved **ListNum** field cache contains valid information. The
**ListNum** field cache is specified by
[FibRgFcLcb97](#fibrgfclcb97).**fcPlcfBteLvc**.

**H - fSnapBorder (1 bit):** Specifies whether to align paragraph and
table borders with the page border, as specified in \[ECMA-376\] Part 1,
Section 17.15.1.2 alignBordersAndEdges.

**I - fIncludeHeader (1 bit):** Specifies whether to draw the page
border so that it includes the header area.

**J - fIncludeFooter (1 bit):** Specifies whether to draw the page
border so that it includes the footer area.

**K - unused3 (1 bit):** This value is undefined and MUST be ignored.

**L - unused4 (1 bit):** This value is undefined and MUST be ignored.

**unused5 (2 bytes):** This value is undefined and MUST be ignored.

**asumyi (12 bytes):** An [Asumyi](#asumyi) that specifies the
[**AutoSummary**](#gt_f4f3be71-a6a0-43a1-974d-cf345372f5bf) settings.

**cChWS (4 bytes):** Specifies the last calculated or estimated count of
characters in the main document depending on the values of
**fExactCWords** and **fIncludeSubdocsInStats**. The count of characters
includes whitespace.

**cChWSWithSubdocs (4 bytes):** Specifies the last calculated or
estimated count of characters in the main document, footnotes, endnotes,
and text boxes that are anchored in the main document, depending on
**fExactCWords** and **fIncludeSubdocsInStats**. The count of characters
includes whitespace.

**grfDocEvents (4 bytes):** A bit field that specifies which document
events are fired. The individual bits and their meanings are as follows.

| Bit Mask   | Event           |
|------------|-----------------|
| 0x00000001 | New             |
| 0x00000002 | Open            |
| 0x00000004 | Close           |
| 0x00000008 | Sync            |
| 0x00000010 | XMLAfterInsert  |
| 0x00000020 | XMLBeforeDelete |
| 0x00000100 | BBAfterInsert   |
| 0x00000200 | BBBeforeDelete  |
| 0x00000400 | BBOnExit        |
| 0x00000800 | BBOnEnter       |
| 0x00001000 | StoreUpdate     |
| 0x00002000 | BBContentUpdate |
| 0x00004000 | LegoAfterInsert |

All other bits MUST be set to 0.

**M - fVirusPrompted (1 bit):** Specifies whether the macro security
prompt is shown in this session for this document.

**N - fVirusLoadSafe (1 bit):** Specifies whether to disable macros for
this session.

**KeyVirusSession30 (30 bits):** A random value to match against the
current session key. If they match, this is the same session.

**space (30 bytes):** This value is undefined and MUST be ignored.

**cpMaxListCacheMainDoc (4 bytes):** This value
MAY<span id="Appendix_A_Target_176"
class="anchor"></span>[\<176\>](#Appendix_A_176) specify the maximum
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) value for which the
**ListNum** field cache contains valid information. The **ListNum**
field cache is specified by **FibRgFcLcb97.fcPlcfBteLvc**.

**ilfoLastBulletMain (2 bytes):** Specifies the index of the last
[**LFO**](#lfo) structure that was used for bullets in the document
before the save operation. This value MUST be between 0 and a number
that is one less than the number of entries in
**FibRgFcLcb97.fcPlfLfo**, unless there are 0 entries, in which case
this value MUST be 0.

**ilfoLastNumberMain (2 bytes):** Specifies the index of the last
**LFO** structure that was used for list numbering in the document
before the save operation. This value MUST be between 0 and a number
that is one less than the number of entries in
**FibRgFcLcb97.fcPlfLfo**, unless there are 0 entries, in which case
this value MUST be 0.

**cDBC (4 bytes):** Specifies the last calculated or estimated count of
double-byte characters in the main document, depending on the values of
**DopBase.fExactCWords** and **DopBase.fIncludeSubdocsInStats**. The
count of characters includes whitespace.

**cDBCWithSubdocs (4 bytes):** Specifies the last calculated or
estimated count of double-byte characters in the main document,
footnotes, endnotes, and text boxes anchored in the main document
depending on **DopBase.fExactCWords** and
**DopBase.fIncludeSubdocsInStats**. The character count includes
whitespace.

**reserved3a (4 bytes):** This value is undefined and MUST be ignored.

**nfcFtnRef (2 bytes):** An **MSONFC** (as specified in
[\[MS-OSHARED\]](%5bMS-OSHARED%5d.pdf#Section_d93502fa5b8f4f47a3fe5574046f4b8d)
section 2.2.1.3) that, for those documents that have an
[**nFib**](#Section_fe6610529c884ae1aec444799b2b4777) which is less than
or equal to 0x00D9, specifies the numbering format code to use for
footnotes in the document.

**nfcEdnRef (2 bytes):** An **MSONFC** (as specified in \[MS-OSHARED\]
section 2.2.1.3) that, for those documents that have an **nFib** which
is less than or equal to 0x00D9, specifies the numbering format code to
use for endnotes in the document.

**hpsZoomFontPag (2 bytes):** Specifies the size, in half points, of the
maximum font size to be enlarged in the view "online layout" at the time
the document was last paginated. This value
SHOULD<span id="Appendix_A_Target_177"
class="anchor"></span>[\<177\>](#Appendix_A_177) be ignored.

**dywDispPag (2 bytes):** Height of the screen, in pixels, at the time
that the document was last paginated. This value SHOULD\<178\> be
ignored.

### Dop2000

A structure that contains document and compatibility settings. These
settings influence the appearance and behavior of the current document
and store document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dop97 (500 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ilvlLastBulletMain |  |  |  |  |  |  |  | ilvlLastNumberMain |  |  |  |  |  |  |  | istdClickParaType |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| A | B | C | D | empty1 |  |  |  | E | F | G | H | I |  |  |  | J | K | iPixelsPerInch_WebOpt |  |  |  |  |  |  |  |  |  | L | M | N | O |
| copts (32 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| verCompatPre10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | P | Q | R | S | T | U | V | W | X | Y | Z | a | b | c | d | e |



**dop97 (500 bytes):** A [Dop97](#dop97) that specifies document and
compatibility settings.

**ilvlLastBulletMain (1 byte):** SHOULD<span id="Appendix_A_Target_179"
class="anchor"></span>[\<179\>](#Appendix_A_179) specify the last bullet
level applied via the toolbar before saving. MUST be between 0 and 9.
Default is 0.

**ilvlLastNumberMain (1 byte):** SHOULD<span id="Appendix_A_Target_180"
class="anchor"></span>[\<180\>](#Appendix_A_180) specify the last list
numbering level applied via the toolbar before saving. MUST be between 0
and 9. Default is 0.

**istdClickParaType (2 bytes):** Specifies the [ISTD](#stsh) of the
paragraph style to use for paragraphs that are automatically created by
the click and type feature to place the cursor where the user clicked.
Default value is 0 (Normal paragraph style).

**A - fLADAllDone (1 bit):** Specifies whether [**language
auto-detection**](#gt_a75c76d8-cf01-4540-a8e7-24b367b28370) has run to
completion for the document. Default is 0.

**B - fEnvelopeVis (1 bit):** Specifies whether to show the E-Mail
message header as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.15.1.79 showEnvelope. Default is 0.

**C - fMaybeTentativeListInDoc (1 bit):** Specifies whether the document
potentially contains tentative lists<span id="Appendix_A_Target_181"
class="anchor"></span>[\<181\>](#Appendix_A_181). Default is 0. See
[LVLF](#lvlf).**fTentative.**

**D - fMaybeFitText (1 bit):** If this is 0, then there MUST NOT be any
fit text (see [sprmCFitText](#character-properties)) in the document.
Default is 0.

**empty1 (4 bits):** MUST be zero, and MUST be ignored.

**E - fFCCAllDone (1 bit):** Specifies whether the [**format consistency
checker**](#gt_a2a42bb4-740d-4d06-9922-2e10d6233622) has run to
completion for the document. Default is 0.

**F - fRelyOnCSS_WebOpt (1 bit):** Specifies whether to rely on
[**CSS**](#gt_22155692-26b0-4146-9737-ef43f4b31305) for font face
formatting when saving as a Web page as specified in \[ECMA-376\] Part
1, Section 17.15.2.11 doNotRelyOnCSS, where the meaning is the opposite
of **fRelyOnCSS_WebOpt**. The default is 1.

**G - fRelyOnVML_WebOpt (1 bit):** Specifies whether to use
[**VML**](#gt_eb6b7893-b656-4b91-8fab-51fd1cf28a38) when saving as a Web
page as specified in \[ECMA-376\] Part 4, Section 14.8.4.1 relyOnVML.
The default is 0.

**H - fAllowPNG_WebOpt (1 bit):** Specifies whether to allow Portable
Network Graphics (PNG) format as a graphic format when saving as a Web
page as specified in \[ECMA-376\] Part 1, Section 17.15.2.1 allowPNG.
Default value is 0.

**I - screenSize_WebOpt (4 bits):** Specifies what the target screen
size for the Web page is as specified in \[ECMA-376\] Part 1, Section
17.15.2.41 targetScreenSz, where **screenSize_WebOpt** value maps to
**ST_TargetScreenSz** types as follows

| Value       | ST_TargetScreenSz string |
|-------------|--------------------------|
| 0           | 544x376                  |
| 1           | 640x480                  |
| 2           | 720x512                  |
| 3 (default) | 800x600                  |
| 4           | 1024x768                 |
| 5           | 1152x882                 |
| 6           | 1152x900                 |
| 7           | 1280x1024                |
| 8           | 1600x1200                |
| 9           | 1800x1440                |
| 10          | 1920x1200                |

**J - fOrganizeInFolder_WebOpt (1 bit):** Specifies whether to place
supporting files in a subdirectory when saving as a Web page as
specified in \[ECMA-376\] Part 1, Section 17.15.2.10
doNotOrganizeInFolder, where the meaning is the opposite of
**fOrganizeInFolder_WebOpt**. The default is 1.

**K - fUseLongFileNames_WebOpt (1 bit):** Specifies whether to use file
names longer than 8.3 characters when saving as a Web page as specified
in \[ECMA-376\] Part 1, Section 17.15.2.13 doNotUseLongFileNames, where
the meaning is the opposite of **fUseLongFileNames_WebOpt**. The default
is 1.

**iPixelsPerInch_WebOpt (10 bits):** Specifies the pixels per inch for
graphics/images when saving as a Web page as specified in \[ECMA-376\]
Part 1, Section 17.15.2.34 pixelsPerInch. If **fWebOptionsInit** is 1
then this MUST be between 19 and 480; otherwise, this is ignored. The
default is 96.

**L - fWebOptionsInit (1 bit):** Specifies whether
**fRelyOnCSS_WebOpt**, **fRelyOnVML_WebOpt**, **fAllowPNG_WebOpt**,
**screenSize_WebOpt**, **fOrganizeInFolder_WebOpt**,
**fUseLongFileNames_WebOpt** and **iPixelsPerInch_WebOpt** contain valid
data. When **fWebOptionsInit** is set to 0, the value of all those
fields MUST be ignored. The default is 0.

**M - fMaybeFEL (1 bit):** If this is 0, then there MUST NOT be any
[**Warichu**](#gt_b01cf911-a072-4f9f-9e31-89efffe046dd),
[**Tatenakayoko**](#gt_6075ed2c-009c-4fd2-8060-146f8e0bb4a9),
[**Ruby**](#gt_0d0ef427-846a-40b6-8965-93851e374e7a),
[**Kumimoji**](#gt_ab922a45-66c3-4368-9c3f-500e2dc1c6e7) or EncloseText
in the document. Enclose Text is a layout feature that uses EQ fields
(\[ECMA-376\] part 4, section 14.10.4.6) to enclose characters in
circles or other characters. The default is 0.

**N - fCharLineUnits (1 bit):** If this is 0, then there MUST NOT be any
character unit indents ([sprmPDxcLeft](#paragraph-properties),
sprmPDxcLeft1, sprmPDxcRight) or line units (sprmPDylBefore,
sprmPDylAfter) in use. The default is 0.

**O - unused1 (1 bit):** Undefined and MUST be ignored.

**copts (32 bytes):** A [copts](#copts) that specifies compatibility
options. Components of **Copts.copts80** MUST be equal to components of
**Dop97.copts80**.

**verCompatPre10 (16 bits):** A bit field that specifies the desired
feature set to use for the document. This overrides
[DopBase](#dopbase).**fWord97Compat**. Values are composed from the
following table:

| Bit Value        | Meaning                                                                       |
|------------------|-------------------------------------------------------------------------------|
| 0x0000 (default) | No Restrictions on feature use                                                |
| 0x0004           | Use only features available in Microsoft Word for Windows 95.                 |
| 0x0008           | Use only features available in Microsoft Word 97.                             |
| 0x0040           | Use only features available in the East Asian release of Word for Windows 95. |
| 0x0800           | Use only features available in Microsoft Office Word 2003.                    |

All other bits are undefined and MUST be ignored.

**P - fNoMargPgvwSaved (1 bit):** Specifies whether to suppress the
display of the header and footer area when in print layout view so that
the main text area of one page is displayed adjacent to the main text
area of the next page as specified in \[ECMA-376\] Part 1, Section
17.15.1.35 doNotDisplayPageBoundaries. Default is 0.

**Q - unused2 (1 bit):** Undefined and MUST be ignored.

**R - unused3 (1 bit):** Undefined and MUST be ignored.

**S - unused4 (1 bit):** Undefined and MUST be ignored.

**T - fBulletProofed (1 bit):** Specifies that this document was
produced by the Open and Repair feature. Default is 0.

**U - empty2 (1 bit):** MUST be zero, and MUST be ignored.

**V - fSaveUim (1 bit):** Specifies whether to save
[**UIM**](#gt_e8864b1e-f3e9-43e5-b95f-889a331e7268) data in the
document. Default is 1.

**W - fFilterPrivacy (1 bit):** Specifies whether to remove personal
information from the document properties on save as specified in
\[ECMA-376\] Part 1, Section 17.15.1.68 removePersonalInformation.
Default is 0.

**X - empty3 (1 bit):** MUST be zero, and MUST be ignored.

**Y - fSeenRepairs (1 bit):** Specifies whether the user has seen any
repairs made by the Open and Repair feature. Default is 0.

**Z - fHasXML (1 bit):** Specifies whether the document has any form of
[**structured document tags**](#gt_b4b00e1c-5410-4a49-8914-f2fb445b5c4d)
in it. Default is 0.

**a - unused5 (1 bit):** Undefined and MUST be ignored.

**b - fValidateXML (1 bit):** Specifies whether to validate custom XML
markup against any attached schemas as specified in \[ECMA-376\] Part 1,
Section 17.15.1.43 doNotValidateAgainstSchema, where the meaning is the
opposite of **fValidateXML**. Default is 1

**c - fSaveInvalidXML (1 bit):** Specifies whether to allow saving the
document as an XML file when the custom XML markup is invalid with
respect to the attached schemas as specified in \[ECMA-376\] Part 1,
Section 17.15.1.74 saveInvalidXml. Default is 0.

**d - fShowXMLErrors (1 bit):** Specifies whether to show a visual
indicator for invalid custom XML markup as specified in \[ECMA-376\]
Part 1, Section 17.15.1.34 doNotDemarcateInvalidXml, where the meaning
is the opposite of **fShowXMLErrors**.

**e - fAlwaysMergeEmptyNamespace (1 bit):** Specifies whether to
consider custom XML elements with no namespace as valid on open as
specified in \[ECMA-376\] Part 1, Section 17.15.1.3
alwaysMergeEmptyNamespace. Default is 0.

### Dop2002

A structure that contains document and compatibility settings. These
settings influence the appearance and behavior of the current document
and store document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dop2000 (544 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| unused |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| A | B | C | D | E | F | G | H | I |  |  | J | K | L | M | N | istdTableDflt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| verCompat |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | grfFmtFilter |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| iFolioPages |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpgText |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpMinRMText |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpMinRMFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpMinRMHdd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpMinRMAtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpMinRMEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpMinRmTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cpMinRmHdrTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | rsidRoot |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**dop2000 (544 bytes):** A [Dop2000](#dop2000) that specifies document
and compatibility settings.

**unused (4 bytes):** Undefined and MUST be ignored.

**A - fDoNotEmbedSystemFont (1 bit):** Specifies whether common system
fonts are not to be embedded as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.8.3.7 embedSystemFonts, where the meaning is the opposite of
**fDoNotEmbedSystemFont** and the **embedTrueTypeFonts** element refers
to [DopBase](#dopbase).**fEmbedFonts**. Default is 1.

**B - fWordCompat (1 bit):** Specifies that features not compatible with
the settings specified in **verCompat** will be disabled or removed when
saving. Default is 0.

**C - fLiveRecover (1 bit):** Specifies that this file is a recovered
document from after a crash. Default is 0.

**D - fEmbedFactoids (1 bit):** Specifies whether smart tags are to
remain in the document when saving. Smart tags are to be removed when
**fEmbedFactoids** is set to 0. See \[ECMA-376\] Part 1, Section
17.15.1.36 doNotEmbedSmartTags, where the meaning is the opposite of
**fEmbedFactoids**. Default is 1.

**E - fFactoidXML (1 bit):** Specifies whether to save smart tag data as
an XML-based property bag at the head of the
[**HTML**](#gt_549c4960-e8be-4c24-bc2b-b86530f1c1bf) page when saving as
HTML as specified in \[ECMA-376\] Part 1, Section 17.15.2.36
saveSmartTagsAsXml. Default is 0.

**F - fFactoidAllDone (1 bit):** Specifies whether the document has been
completely scanned for all possible smart tag creations. Default is 0.

**G - fFolioPrint (1 bit):** Specifies whether to use book fold printing
as specified in \[ECMA-376\] Part 1, Section 17.15.1 11
bookFoldPrinting. Default is 0.

**H - fReverseFolio (1 bit):** Specifies whether to use reverse book
fold printing as specified in \[ECMA-376\] Part 1, Section 17.15.1.13
bookFoldRevPrinting. If this is 1 then **fFolioPrint** MUST be 1.
Default is 0.

**I - iTextLineEnding (3 bits):** Specifies what to end a line of text
with when saving as a text file via automation. It MUST be one of the
values in the following table:


| Value | Meaning |
| --- | --- |
| 0 (default) | Carriage return (0x0D) followed by line feed (0x0A). |
| 1 | Carriage return (0x0D). |
| 2 | Line feed (0x0A). |
| 3 | Line feed (0x0A) followed by carriage return (0x0D). |
| 4 | If the code page supports it, Line Separator (U+2028) or Paragraph Separator (U+2029) otherwise behave as follows: |



**J - fHideFcc (1 bit):** Specifies whether to refrain from showing a
visual cue around ranges flagged by the [**format consistency
checker**](#gt_a2a42bb4-740d-4d06-9922-2e10d6233622) as suspect. Default
is 0.

**K - fAcetateShowMarkup (1 bit):** Specifies whether to visually
indicate any additional nonprinting area used to display annotations
when the annotations in this document are displayed. Default is 1.

**L - fAcetateShowAtn (1 bit):** Specifies if comments are included when
the contents of this document are displayed. Default is 1.

**M - fAcetateShowInsDel (1 bit):** Specifies if revisions to content
are included when the contents of this document are displayed. Default
is 1.

**N - fAcetateShowProps (1 bit):** Specifies whether [**property
revision marks**](#gt_4d5c1e95-df26-408b-a964-4a6cba5d2239) are included
when the contents of this document are displayed. Default is 1.

**istdTableDflt (16 bits):** An [istd](#stsh) that specifies the default
table style for newly inserted tables.

**verCompat (16 bits):** A bit field that specifies the desired feature
set to use for the document. This overrides DopBase.**fWord97Compat**
and Dop2000.**verCompatPre10**. The bit values are as follows:

| Value  | Meaning                                                               |
|--------|-----------------------------------------------------------------------|
| 0x0000 | No restrictions on feature use.                                       |
| 0x0001 | Use features supported by Microsoft® Internet Explorer® 4.0.          |
| 0x0002 | Use features supported by Microsoft® Internet Explorer® 5.0.          |
| 0x0004 | Use features supported by Word for Windows 95.                        |
| 0x0008 | Use features supported by Word 97.                                    |
| 0x0010 | Use features supported by the Word HTML format.                       |
| 0x0020 | Use features supported by the Word RTF format.                        |
| 0x0040 | Use features supported by East Asian versions of Word for Windows 95. |
| 0x0080 | Use features supported by plain text e-mail messages.                 |
| 0x0100 | Use features supported by Internet Explorer 6.0.                      |
| 0x0200 | Use features supported by the Word XML format.                        |
| 0x0400 | Use features supported by RTF e-mail messages.                        |
| 0x0800 | Do not use features introduced in Microsoft Office Word 2007.         |
| 0x1000 | Use features supported by plain text.                                 |

Default is 0.

**grfFmtFilter (2 bytes):** Specifies the suggested filtering for the
list of document styles as specified in \[ECMA-376\] Part 1, Section
17.15.1.85 stylePaneFormatFilter. Default is 0x5024.

**iFolioPages (2 bytes):** Specifies the number of pages per booklet as
specified in \[ECMA-376\] Part 1, Section 17.15.1.12
bookFoldPrintingSheets, where bookFoldPrinting refers to **fFolioPrint**
and bookFoldRevPrinting refers to **fReverseFolio**. Default is 0.

**cpgText (4 bytes):** Specifies the code page to use when saving as
encoded text. Default is the current Windows ANSI code page for the
system.

**cpMinRMText (4 bytes):** A CP in the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e) before which there
are no revisions. Default is 0.

**cpMinRMFtn (4 bytes):** A CP in the [footnote
document](#Section_f7e96a05aad74acba06dbfa430ac1fcc) before which there
are no revisions. Default is 0.

**cpMinRMHdd (4 bytes):** A CP in the [header
document](#Section_8465bee76c7945a9812e58b0c5fd6cdc) before which there
are no revisions. Default is 0.

**cpMinRMAtn (4 bytes):** A CP in the [comment
document](#Section_486f5a89fba5412f8ac61c551654ddcd) before which there
are no revisions. Default is 0.

**cpMinRMEdn (4 bytes):** A CP in the [endnote
document](#Section_13659f756a694a5f8e035f9bced90faa) before which there
are no revisions. Default is 0.

**cpMinRmTxbx (4 bytes):** A CP in the [textbox
document](#Section_f87b35602c234d109751ff141d307308) for the main
document before which there are no revisions. Default is 0.

**cpMinRmHdrTxbx (4 bytes):** A CP in the [header textbox
document](#Section_7392319674e14e6988b8d2cc9ac8093b) before which there
are no revisions. Default is 0.

**rsidRoot (4 bytes):** Specifies the original document revision save ID
as specified in \[ECMA-376\] Part 1, Section 17.15.1.71 rsidRoot. By
default the **rsidRoot** is not that of the currently running session.

### Dop2003

The **Dop2003** structure contains document and compatibility settings.
These settings influence the appearance and behavior of the current
document and store document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dop2002 (594 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | A | B | C | D | E | F | G | H | I | J | K | L | M | N |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | P | Q | R | S |  |  | T | empty2 |  |  |  |  |  |  |  |
| dxaPageLock |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dyaPageLock |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pctFontLock |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| grfitbid |  |  |  |  |  |  |  | empty3 |  |  |  |  |  |  |  | ilfoMacAtCleanup |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**dop2002 (594 bytes):** A [Dop2002](#dop2002) that specifies document
and compatibility settings.

**A - fTreatLockAtnAsReadOnly (1 bit):** Specifies whether
[DopBase](#dopbase).**fLockAtn** means read-only protection instead of
protect for comments. By default, this value is 0.

**B - fStyleLock (1 bit):** Specifies whether the styles available to
use in the document are restricted to those styles with
[STD](#std).[Stdf](#stdf).[StdfBase](#stdfbase).[GRFSTD](#grfstd).**fLocked**
set to 1 when style lock is enforced (**fStyleLockEnforced** is 1). By
default, this value is 0.

**C - fAutoFmtOverride (1 bit):** Specifies whether to allow automatic
formatting to override the **fStyleLock** setting as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.15.1.9 autoFormatOverride. By default, this value is 0.

**D - fRemoveWordML (1 bit):** Specifies whether to save only custom XML
markup when saving to XML as specified in \[ECMA-376\] Part 1, Section
17.15.1.77 saveXmlDataOnly. By default, this value is 0.

**E - fApplyCustomXForm (1 bit):** Specifies whether to save the
document through the custom XML transform specified via
[FibRgFcLcb2003](#fibrgfclcb2003).**fcCustomXForm** and
FibRgFcLcb2003.**lcbCustomXForm** when saving to XML as specified in
\[ECMA-376\] Part 1, Section 17.15.1.91 useXSLTWhenSaving. By default,
this value is 0.

**F - fStyleLockEnforced (1 bit):** Specifies whether to actively
enforce the style restriction as specified by **fStyleLock**. If
**fStyleLockEnforced** is 1, **fStyleLock** MUST be 1. By default, this
value is 0.

**G - fFakeLockAtn (1 bit):** Specifies that the DopBase.**fLockAtn**
setting is to be honored only if the application does not support
**fStyleLock**. By default, this value is 0.

**H - fIgnoreMixedContent (1 bit):** Specifies whether to ignore all
text not in leaf nodes of the custom XML when validating custom XML
markup as specified in \[ECMA-376\] Part 1, Section 17.15.1.54
ignoreMixedContent. By default, this value is 0.

**I - fShowPlaceholderText (1 bit):** Specifies whether to show some
form of in-document placeholder text when custom XML markup contains no
content and the custom XML tags are not being displayed as specified in
\[ECMA-376\] Part 1, Section 17.15.1.4 alwaysShowPlaceholderText. By
default, this value is 0.

**J - unused (1 bit):** This value is undefined and MUST be ignored.

**K - fWord97Doc (1 bit):** Specifies whether to disable UI for features
incompatible with the Word Binary File Format. By default, this value is
0.

**L - fStyleLockTheme (1 bit):** Specifies whether to prevent
modification of the document theme information as specified in
\[ECMA-376\] Part 1, Section 17.15.1.84 styleLockTheme. By default, this
value is 0.

**M - fStyleLockQFSet (1 bit):** Specifies whether to prevent the
replacement of style sets as specified in \[ECMA-376\] Part 1, Section
17.15.1.83 styleLockQFSet. By default, this value is 0.

**N - empty1 (19 bits):** This value MUST be 0, and MUST be ignored.

**O - fReadingModeInkLockDown (1 bit):** Specifies whether to
permanently set the layout to the specific set of page and text-sizing
parameters specified by **dxaPageLock**, **dyaPageLock** and
**pctFontLock** as specified in \[ECMA-376\] Part 1, Section 17.15.1.66
readModeInkLockDown. By default, this value is 0.

**P - fAcetateShowInkAtn (1 bit):** Specifies whether to include ink
annotations when the contents of this document are displayed. By
default, this value is 1.

**Q - fFilterDttm (1 bit):** Specifies whether to remove date and time
information from annotations as specified in \[ECMA-376\] Part 1,
Section 17.15.1.67 removeDateAndTime. By default, this value is 0.

**R - fEnforceDocProt (1 bit):** Specifies whether to enforce the
document protection mode that is specified by **iDocProtCur**. By
default, this value is 0.

**S - iDocProtCur (3 bits):** Specifies the document protection mode
that is in effect when **fEnforceDocProt** is set to 1. This MUST be set
to one of the following values.

| Value       | Meaning                                                                                                                                                                                                                                        |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0           | Track all edits that are made to the document as revisions.                                                                                                                                                                                    |
| 1           | Comments are permitted to be inserted or deleted, and regions that are delimited by range permissions can be edited if they match the editing rights of the user account which is performing the editing. See [PRTI](#prti).                   |
| 2           | Edits are restricted to the editing of form fields in sections where [sprmSFProtected](#section-properties) results in a value of "true". Edits are not restricted in sections where sprmSFProtected is not present or has a value of "false". |
| 3 (Default) | Edits are restricted to regions delimited by range permissions which match the editing rights of the user account which is performing the editing. See PRTI.                                                                                   |
| 7           | There are no editing restrictions.                                                                                                                                                                                                             |

**T - fDispBkSpSaved (1 bit):** Specifies whether to display background
objects when displaying the document in print layout view as specified
in \[ECMA-376\] Part 1, Section 17.15.1.26 displayBackgroundShape. By
default, this value is 0.

**empty2 (8 bits):** This value MUST be 0, and MUST be ignored.

**dxaPageLock (4 bytes):** Specifies the width, in
[**twips**](#gt_4b82472c-103d-4eff-a07e-6a0f784e3382), of the virtual
pages that are used in this document when **fReadingModeInkLockDown**
is 1. By default, this value is 0.

**dyaPageLock (4 bytes):** Specifies the height, in twips, of the
virtual pages that are used in this document when
**fReadingModeInkLockDown** is 1. By default, this value is 0.

**pctFontLock (4 bytes):** Specifies the percentage to which text in the
document is scaled before it is displayed on a virtual page when
**fReadingModeInkLockDown** is 1. By default, this value is 0.

**grfitbid (1 byte):** A bit field that specifies what toolbars were
shown because of document state rather than explicit user action at the
moment of saving. This value MUST be composed of the following bit
values.

| Value          | Meaning                                         |
|----------------|-------------------------------------------------|
| 0x00 (default) | No toolbar was shown because of document state. |
| 0x01           | The reviewing toolbar was shown.                |
| 0x02           | The Web toolbar was shown.                      |
| 0x04           | The mail merge toolbar was shown.               |

**empty3 (1 byte):** This value MUST be 0, and MUST be ignored.

**ilfoMacAtCleanup (2 bytes):** Specifies the largest **ilfo** value
(index into [PlfLfo](#plflfo)) such that all PlfLfo entries from 0 to
**ilfoMacAtCleanup** are searched for unused values to be pruned as
specified in \[ECMA-376\] Part 1, Section 17.9.19 numIdMacAtCleanup. By
default, this value is 0.

### Dop2007

The **Dop2007** structure contains document and compatibility settings.
These settings influence the appearance and behavior of the current
document and store document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dop2003 (616 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| A | B | C | D | E | ssm |  |  |  | F | G | reserved3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dopMth (34 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**dop2003 (616 bytes):** A [Dop2003](#dop2003) that specifies document
and compatibility settings.

**reserved1 (4 bytes):** This value is undefined, and MUST be ignored.

**A - fRMTrackFormatting (1 bit):** Specifies whether to track format
changes when tracking for revisions
([DopBase](#dopbase).**fRevMarking**). By default, this value is 1.

**B - fRMTrackMoves (1 bit):** Specifies whether to track moved text
when tracking for revisions (DopBase.**fRevMarking**) instead of
tracking for the deletions and insertions that are made. By default,
this value is 1.

**C - reserved2 (1 bit):** This value MUST be 0, and MUST be ignored.

**D - empty1 (1 bit):** This value MUST be 0, and MUST be ignored.

**E - empty2 (1 bit):** This value MUST be 0, and MUST be ignored.

**ssm (4 bits):** An unsigned integer that specifies the sorting method
to use when displaying document styles. This value MUST be one of the
following.

| Value       | Meaning                                                                           |
|-------------|-----------------------------------------------------------------------------------|
| 0           | Styles are sorted by name.                                                        |
| 1 (default) | Styles are sorted by the default sorting method of the application.               |
| 2           | Styles are sorted based on the font that they apply.                              |
| 3           | Styles are sorted by the style on which they are based.                           |
| 4           | Styles are sorted by their style types (character, linked, paragraph, and so on). |

**F - fReadingModeInkLockDownActualPage (1 bit):** Specifies whether to
render the document with actual pages or virtual pages as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.15.1.66 readModeInkLockDown. By default, this value is 0.

**G - fAutoCompressPictures (1 bit):** Specifies whether pictures in the
document are automatically compressed when the document is saved as
specified in \[ECMA-376\] Part 1, Section 17.15.1.33
doNotAutoCompressPictures, where the meaning is the opposite of
**fAutoCompressPictures**. By default, this value is 1.

**reserved3 (21 bits):** This value MUST be 0, and MUST be ignored.

**empty3 (4 bytes):** This value MUST be 0, and MUST be ignored.

**empty4 (4 bytes):** This value MUST be 0, and MUST be ignored.

**empty5 (4 bytes):** This value MUST be 0, and MUST be ignored.

**empty6 (4 bytes):** This value MUST be 0, and MUST be ignored.

**dopMth (34 bytes):** A [DopMth](#dopmth) that specifies various math
properties.

### Dop2010

The **Dop2010** structure contains document and compatibility settings.
These settings influence the appearance and behavior of the current
document and store document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dop2007 (674 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | docid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | A | empty |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | iImageDPI |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**dop2007 (674 bytes):** A **Dop2007** structure (section
[2.7.8](#dop2007)) that specifies document and compatibility settings.

**docid (4 bytes):** An unsigned integer that specifies an arbitrary
identifier for the context of the paragraph identifiers in the document,
as specified in
[\[MS-DOCX\]](%5bMS-DOCX%5d.pdf#Section_b839fe1fe1ca4fa68c265954d0abbccd)
section 2.6.1.14 (**docId**). MUST be greater than 0 and less than
0x80000000

**reserved (4 bytes):** This value is undefined and MUST be ignored.

**A - fDiscardImageData (1 bit):** Specifies whether the cropped-out
areas of images are to be discarded when the document is saved as
specified in \[MS-DOCX\] section 2.6.1.13 (**discardImageEditingData**).

**empty (31 bits):** This value MUST be 0 and MUST be ignored.

**iImageDPI (4 bytes):** An unsigned integer that specifies the
resolution at which to save images in the document, as specified in
\[MS-DOCX\] section 2.6.1.12 (**defaultImageDpi**).

### Dop2013

The **Dop2013** structure contains document and compatibility settings.
These settings influence the appearance and behavior of the current
document and store document-level state.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dop2010 (690 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | A | empty |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**dop2010 (690 bytes):** A **Dop2010** structure (section
[2.7.9](#dop2010)) that specifies document and compatibility settings.

**A - fChartTrackingRefBased (1 bit):** Specifies how the data point
properties and data labels in all charts in this document behave, as
specified in
[\[MS-DOCX\]](%5bMS-DOCX%5d.pdf#Section_b839fe1fe1ca4fa68c265954d0abbccd)
section 2.5.1.2 (**chartTrackingRefBased**).

**empty (31 bits):** This value MUST be 0 and MUST be ignored.

### Copts60

The **Copts60** structure specifies compatibility options.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**A - fNoTabForInd (1 bit):** Specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 4,
Section 14.8.3.31 noTabHangInd.

**B - fNoSpaceRaiseLower (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.30 noSpaceRaiseLower.

**C - fSuppressSpBfAfterPgBrk (1 bit):** Specified in \[ECMA-376\] Part
4, Section 14.8.3.42 suppressSpBfAfterPgBrk.

**D - fWrapTrailSpaces (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.58 wrapTrailSpaces.

**E - fMapPrintTextColor (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.33 printColBlack.

**F - fNoColumnBalance (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.27 noColumnBalance.

**G - fConvMailMergeEsc (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.6 convMailMergeEsc.

**H - fSuppressTopSpacing (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.43 suppressTopSpacing.

**I - fOrigWordTableRules (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.53 useSingleBorderforContiguousCells.

**J - unused14 (1 bit):** This value is undefined and MUST be ignored.

**K - fShowBreaksInFrames (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.36 showBreaksInFrames.

**L - fSwapBordersFacingPgs (1 bit):** Specified in \[ECMA-376\] Part 4,
Section 14.8.3.45 swapBordersFacingPages.

**M - fLeaveBackslashAlone (1 bit):** Specified in \[ECMA-376\] Part 1,
Section 17.15.3.6 doNotLeaveBackslashAlone, where the meaning of the
element is the opposite of **fLeaveBackslashAlone**

**N - fExpShRtn (1 bit):** Specified in \[ECMA-376\] Part 1, Section
17.15.3.5 doNotExpandShiftReturn, where the meaning is the opposite of
**fExpShRtn**.

**O - fDntULTrlSpc (1 bit):** Specified in \[ECMA-376\] Part 1, Section
17.15.3.8 ulTrailSpace, where the meaning of the element is the opposite
of **fDntULTrlSpc**.

**P - fDntBlnSbDbWid (1 bit):** Specified in \[ECMA-376\] Part 1,
Section 17.15.3.3 balanceSingleByteDoubleByteWidth, where the meaning of
the element is the opposite of **fDntBlnSbDbWid**.

### Copts80

The **Copts80** structure specifies compatibility options.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| copts60 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |



**copts60 (2 bytes):** A [Copts60](#copts60) that specifies additional
compatibility options.

**A - fSuppressTopSpacingMac5 (1 bit):** Specifies whether the minimum
line height for the first line on the page is ignored as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 4,
Section 14.8.3.41 suppressSpacingAtTopOfPage, where a **spacing**
element with a **lineRule** attribute value of **atLeast** refers to
[sprmPDyaLine](#paragraph-properties) with a
[LSPD](#lspd).**fMultLinespace** of 0 and **LSPD.dyaline** greater than
0.

**B - fTruncDxaExpand (1 bit):** Specifies whether text is expanded or
condensed by whole points as specified in \[ECMA-376\] Part 4, Section
14.8.3.37 spacingInWholePoints, where spacing refers to sprmPDyaBefore
and sprmPDyaAfter.

**C - fPrintBodyBeforeHdr (1 bit):** Specifies whether body text is
printed before header and footer contents as specified in \[ECMA-376\]
Part 4, Section 14.8.3.32 printBodyTextBeforeHeader.

**D - fNoExtLeading (1 bit):** Specifies whether leading is not added
between lines of text as specified in \[ECMA-376\] Part 4, Section
14.8.3.29 noLeading.

**E - fDontMakeSpaceForUL (1 bit):** Specifies whether additional space
is not added below the baseline for underlined [**East Asian
characters**](#gt_8dcae18f-67a0-4282-860e-1b6713fe6aae) as specified in
\[ECMA-376\] Part 1, Section 17.15.3.7 spaceForUL, where u is
[sprmCKul](#character-properties) and **textAlignment** with **val** of
**baseline** is sprmPWAlignFont with a value of 2 and the overall
meaning is the opposite of **fDontMakeSpaceForUL**.

**F - fMWSmallCaps (1 bit):** Specifies whether Word 5.x for the
Macintosh small caps formatting is to be used as specified in
\[ECMA-376\] Part 4, Section 14.8.3.26 mwSmallCaps.

**G - f2ptExtLeadingOnly (1 bit):** Specifies whether line spacing
emulates WordPerfect 5.x line spacing as specified in \[ECMA-376\] Part
4, Section 14.8.3.44 suppressTopSpacingWP.

**H - fTruncFontHeight (1 bit):** Specifies whether font height
calculation emulates WordPerfect 6.x font height calculation as
specified in \[ECMA-376\] Part 4, Section 14.8.3.46
truncateFontHeightsLikeWP6.

**I - fSubOnSize (1 bit):** Specifies whether the priority of font size
is increased during font substitution as specified in \[ECMA-376\] Part
4, Section 14.8.3.39 subFontBySize.

**J - fLineWrapLikeWord6 (1 bit):** Specifies whether line wrapping
emulates Microsoft® Word 6.0 line wrapping for East Asian characters as
specified in \[ECMA-376\] Part 4, Section 14.8.3.25 lineWrapLikeWord6.

**K - fWW6BorderRules (1 bit):** Specifies whether the paragraph borders
next to frames are not suppressed as specified in \[ECMA-376\] Part 4,
Section 14.8.3.13 doNotSuppressParagraphBorders.

**L - fExactOnTop (1 bit):** Specifies whether content on lines with
exact line height is not to be centered as specified in \[ECMA-376\]
Part 4, Section 14.8.3.28 noExtraLineSpacing, where exact line height
using the **spacing** element refers to sprmPDyaLine with
LSPD.**fMultLinespace** of 0 and **LSPD.dyaline** is less than 0.

**M - fExtraAfter (1 bit):** Specifies whether the exact line height for
the last line on a page is ignored as specified in \[ECMA-376\] Part 4,
Section 14.8.3.40 suppressBottomSpacing, where exact line height has
using the **spacing** element refers to sprmPDyaLine with
LSPD.**fMultLinespace** of 0 and **LSPD.dyaline** is less than 0.

**N - fWPSpace (1 bit):** Specifies whether the width of a space
emulates WordPerfect 5.x space width as specified in \[ECMA-376\] Part
4, Section 14.8.3.57 wpSpaceWidth.

**O - fWPJust (1 bit):** Specifies whether paragraph justification
emulates WordPerfect 6.x paragraph justification as specified in
\[ECMA-376\] Part 4, Section 14.8.3.56 wpJustification, where the
**val** attribute value of **both** on the **jc** element refers to
sprmPJc with a value of 3.

**P - fPrintMet (1 bit):** Specifies whether printer metrics are used to
display documents as specified in \[ECMA-376\] Part 4, Section 14.8.3.52
usePrinterMetrics.

### Copts

A structure that specifies compatibility options.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| copts80 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z | a | b | c | d | e | f |
| g | empty1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| empty6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**copts80 (4 bytes):** A [Copts80](#copts80) that specifies additional
compatibility options.

**A - fSpLayoutLikeWW8 (1 bit):** Specifies whether to emulate Word 97
text wrapping around floating objects. Specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) part 4,
14.8.3.35 (shapeLayoutLikeWW8).

**B - fFtnLayoutLikeWW8 (1 bit):** Specifies whether to emulate
Microsoft® Word 6.0, Word for Windows 95, or Word 97 footnote placement.
Specified in \[ECMA-376\] Part 4, 14.8.3.20 (footnoteLayoutLikeWW8).

**C - fDontUseHTMLParagraphAutoSpacing (1 bit):** Specifies whether to
use fixed paragraph spacing for paragraphs specifying auto spacing.
Specified in \[ECMA-376\] Part 4, 14.8.3.15
(doNotUseHTMLParagraphAutoSpacing).

**D - fDontAdjustLineHeightInTable (1 bit):** Prevents lines within
tables from having their heights adjusted to comply with the document
grid. See [sprmSDyaLinePitch](#section-properties) and \[ECMA-376\] Part
1, 17.15.3.1 (adjustLineHeightInTable) where the meaning is the opposite
of **fDontAdjustLineHeightInTable**.

**E - fForgetLastTabAlign (1 bit):** Specifies whether to ignore width
of the last tab stop when aligning a paragraph if the tab stop is not
left aligned. Specified in \[ECMA-376\] Part 4, 14.8.3.21
(forgetLastTabAlignment) where **jc** refers to
[sprmPJc](#paragraph-properties) and the **tab** element refers to
either sprmPChgTabs or sprmPChgTabsPapx.

**F - fUseAutospaceForFullWidthAlpha (1 bit):** Specifies whether to
emulate Word for Windows 95 full-width character spacing. Specified in
\[ECMA-376\] Part 4, 14.8.3.4 (autoSpaceLikeWord for Windows 95).

**G - fAlignTablesRowByRow (1 bit):** Specifies whether to align table
rows independently. Specified in \[ECMA-376\] Part 4, 14.8.3.1
(alignTablesRowByRow) where the **jc** element refers to
[sprmTJc](#table-properties) or sprmTJc90.

**H - fLayoutRawTableWidth (1 bit):** Specifies whether to ignore space
before tables when deciding if a table wraps a floating object.
Specified in \[ECMA-376\] Part 4, 14.8.3.23 (layoutRawTableWidth).

**I - fLayoutTableRowsApart (1 bit):** Specifies whether to allow table
rows to wrap inline objects independently. Specified in \[ECMA-376\]
Part 4, 14.8.3.24 (layoutTableRowsApart).

**J - fUseWord97LineBreakingRules (1 bit):** Specifies whether to
emulate Word 97 [**East Asian line breaking
rules**](#gt_75586443-d3aa-4e41-a68f-f816ee4137d8). Specified in
\[ECMA-376\] Part 4, 14.8.3.55 (useWord97LineBreakRules).

**K - fDontBreakWrappedTables (1 bit):** Specifies whether to prevent
floating tables from breaking across pages. Specified in \[ECMA-376\]
Part 4, 14.8.3.10 (doNotBreakWrappedTables) where the **tblpPr** element
refers to any of sprmTDxaAbs, sprmTDyaAbs, sprmTPc,
sprmTDyaFromTextBottom, sprmTDyaFromText, sprmTDxaFromTextRight, or
sprmTDxaFromText with a nondefault value specified.

**L - fDontSnapToGridInCell (1 bit):** Specifies whether to not snap to
the document grid in table cells with objects. Specified in \[ECMA-376\]
Part 4, 14.8.3.11 (doNotSnapToGridInCell) where the **docGrid** element
refers to any of sprmSClm, sprmSDyaLinePitch or sprmSDxtCharSpace with a
nondefault value specified.

**M - fDontAllowFieldEndSelect (1 bit):** Specifies whether to select an
entire field when the first or last character of the field is selected.
Specified in \[ECMA-376\] Part 4, 14.8.3.34
(selectFldWithFirstOrLastChar).

**N - fApplyBreakingRules (1 bit):** Specifies whether to use legacy
Ethiopic and Amharic line breaking rules. Specified in \[ECMA-376\] Part
1, 17.15.3.2 (applyBreakingRules).

**O - fDontWrapTextWithPunct (1 bit):** Specifies whether to prevent
hanging punctuation with the character grid. Specified in \[ECMA-376\]
Part 4, 14.8.3.19 (doNotWrapTextWithPunct) where the **docGrid** element
refers to any of sprmSClm, sprmSDyaLinePitch or sprmSDxtCharSpace with a
nondefault value specified and the **overflowPunct** element refers to
sprmPFOverflowPunct.

**P - fDontUseAsianBreakRules (1 bit):** Specifies whether to disallow
the compressing of compressible characters when using the document grid.
Specified in \[ECMA-376\] Part 4, 14.8.3.14
(doNotUseEastAsianBreakRules) where the **docGrid** element refers to
any of sprmSClm, sprmSDyaLinePitch, or sprmSDxtCharSpace with a
nondefault value specified

**Q - fUseWord2002TableStyleRules (1 bit):** Specifies whether to
emulate Microsoft Word 2002 table style rules. Specified in \[ECMA-376\]
Part 4, 14.8.3.54 (useWord2002TableStyleRules).

**R - fGrowAutoFit (1 bit):** Specifies whether to allow tables to
autofit into the page margins. Specified in \[ECMA-376\] Part 4,
14.8.3.22 (growAutofit).

**S - fUseNormalStyleForList (1 bit):** Specifies whether to not
automatically apply the list paragraph style to bulleted or numbered
text. Specified in \[ECMA-376\] Part 4, 14.8.3.51
(useNormalStyleForList). MAY<span id="Appendix_A_Target_182"
class="anchor"></span>[\<182\>](#Appendix_A_182) be ignored.

**T - fDontUseIndentAsNumberingTabStop (1 bit):** Specifies whether to
ignore the hanging indent when creating a tab stop after numbering.
Specified in \[ECMA-376\] Part 4, 14.8.3.16
(doNotUseIndentAsNumberingTabStop). MAY<span id="Appendix_A_Target_183"
class="anchor"></span>\<183\> be ignored.

**U - fFELineBreak11 (1 bit):** Specifies whether to use an alternate
set of East Asian line breaking rules. Specified in \[ECMA-376\] Part 4,
14.8.3.48 (useAltKinsokuLineBreakRules).
MAY<span id="Appendix_A_Target_184"
class="anchor"></span>[\<184\>](#Appendix_A_184) be ignored.

**V - fAllowSpaceOfSameStyleInTable (1 bit):** Specifies whether to
allow contextual spacing of paragraphs in tables. Specified in
\[ECMA-376\] Part 4, 14.8.3.2 (allowSpaceOfSameStyleInTable) where the
**contextualSpacing** element refers to sprmPFContextualSpacing.
MAY<span id="Appendix_A_Target_185"
class="anchor"></span>[\<185\>](#Appendix_A_185) be ignored.

**W - fWW11IndentRules (1 bit):** Specifies whether to not ignore
floating objects when calculating paragraph indentation. Specified in
\[ECMA-376\] Part 4, 14.8.3.12 (doNotSuppressIndentation).
MAY<span id="Appendix_A_Target_186"
class="anchor"></span>[\<186\>](#Appendix_A_186) be ignored.

**X - fDontAutofitConstrainedTables (1 bit):** Specifies whether to not
autofit tables such that they fit next to wrapped objects. Specified in
\[ECMA-376\] Part 4, 14.8.3.8 (doNotAutofitConstrainedTables).
MAY[\<187\>](#Appendix_A_187) be ignored.

**Y - fAutofitLikeWW11 (1 bit):** Specifies whether to allow table
columns to exceed the preferred widths of the constituent cells.
Specified in \[ECMA-376\] Part 4, 14.8.3.3
(autofitToFirstFixedWidthCell). MAY<span id="Appendix_A_Target_188"
class="anchor"></span>[\<188\>](#Appendix_A_188) be ignored.

**Z - fUnderlineTabInNumList (1 bit):** Specifies whether to underline
the tab following numbering when both the numbering and the first
character of the numbered paragraph are underlined. Specified in
\[ECMA-376\] Part 4, 14.8.3.47 (underlineTabInNumList).
MAY[\<189\>](#Appendix_A_189) be ignored.

**a - fHangulWidthLikeWW11 (1 bit):** Specifies whether to use fixed
width for Hangul characters. Specified in \[ECMA-376\] Part 4, 14.8.3.7
(displayHangulFixedWidth). MAY<span id="Appendix_A_Target_190"
class="anchor"></span>[\<190\>](#Appendix_A_190) be ignored.

**b - fSplitPgBreakAndParaMark (1 bit):** Specifies whether to move
paragraph marks to the page after a page break. Specified in
\[ECMA-376\] Part 4, 14.8.3.38 (splitPgBreakAndParaMark).
MAY[\<191\>](#Appendix_A_191) be ignored.

**c - fDontVertAlignCellWithSp (1 bit):** Specifies whether to not
vertically align cells containing floating objects. Specified in
\[ECMA-376\] Part 4, 14.8.3.17 (doNotVertAlignCellWithSp).
MAY<span id="Appendix_A_Target_192"
class="anchor"></span>[\<192\>](#Appendix_A_192) be ignored.

**d - fDontBreakConstrainedForcedTables (1 bit):** Specifies whether to
not break table rows around floating tables. Specified in \[ECMA-376\]
Part 4, 14.8.3.9 (doNotBreakConstrainedForcedTable) where **cantSplit**
element refers to either sprmTFCantSplit or sprmTFCantSplit90 and
**tblpPr** element refers to any of sprmTDxaAbs, sprmTDyaAbs, sprmTPc,
sprmTDyaFromTextBottom, sprmTDyaFromText, sprmTDxaFromTextRight, or
sprmTDxaFromText with a nondefault value specified.
MAY<span id="Appendix_A_Target_193"
class="anchor"></span>[\<193\>](#Appendix_A_193) be ignored.

**e - fDontVertAlignInTxbx (1 bit):** Specifies whether to ignore
vertical alignment in text boxes. Specified in \[ECMA-376\] Part 4,
14.8.3.18 (doNotVertAlignInTxbx). MAY<span id="Appendix_A_Target_194"
class="anchor"></span>[\<194\>](#Appendix_A_194) be ignored.

**f - fWord11KerningPairs (1 bit):** Specifies whether to use ANSI
kerning pairs from fonts instead of the
[**Unicode**](#gt_c305d0ab-8b94-461a-bd76-13b40cb8c4d8) kerning pair
info. Specified in \[ECMA-376\] Part 4, 14.8.3.49 (useAnsiKerningPairs).
MAY<span id="Appendix_A_Target_195"
class="anchor"></span>[\<195\>](#Appendix_A_195) be ignored.

**g - fCachedColBalance (1 bit):** Specifies whether to use cached
paragraph information for column balancing. Specified in \[ECMA-376\]
Part 4, 14.8.3.5 (cachedColBalance). MAY<span id="Appendix_A_Target_196"
class="anchor"></span>[\<196\>](#Appendix_A_196) be ignored.

**empty1 (31 bits):** Undefined, and MUST be ignored.

**empty2 (4 bytes):** Undefined, and MUST be ignored.

**empty3 (4 bytes):** Undefined, and MUST be ignored.

**empty4 (4 bytes):** Undefined, and MUST be ignored.

**empty5 (4 bytes):** Undefined, and MUST be ignored.

**empty6 (4 bytes):** Undefined, and MUST be ignored.

### Asumyi

The **Asumyi** structure specifies
[**AutoSummary**](#gt_f4f3be71-a6a0-43a1-974d-cf345372f5bf) state
information


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | B | C |  | D | reserved |  |  |  |  |  |  |  |  |  |  | wDlgLevel |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lHighestLevel |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lCurrentLevel |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**A - fValid (1 bit):** Specifies whether the rest of the information in
the Asumyi is currently valid.

**B - fView (1 bit):** Specifies whether the AutoSummary view is
currently active.

**C - iViewBy (2 bits):** Specifies the type of AutoSummary to use. This
value MUST be one of the following.

| Value | Meaning                                                   |
|-------|-----------------------------------------------------------|
| 0     | Highlight the text that is to be included in the summary. |
| 1     | Hide all text that is not part of the summary             |
| 2     | Insert the summary at the top of the document.            |
| 3     | Create a new document that contains the summary.          |

**D - fUpdateProps (1 bit):** Specifies whether to update the document
summary information to reflect the AutoSummary results after the next
summarization.

**reserved (11 bits):** This value MUST be 0, and MUST be ignored.

**wDlgLevel (2 bytes):** Specifies the desired size of the summary. This
value SHOULD[\<197\>](#Appendix_A_197) either be between 0 and 100,
expressing the percentage of the original document size, or be one of
the following values.

| Value  | Meaning                                   |
|--------|-------------------------------------------|
| 0xFFFE | 10 sentences.                             |
| 0xFFFD | 20 sentences.                             |
| 0xFFFC | 100 words.                                |
| 0xFFFB | 500 words.                                |
| 0xFFFA | 10 percent of the original document size. |
| 0xFFF9 | 25 percent of the original document size. |
| 0xFFF8 | 50 percent of the original document size. |
| 0xFFF7 | 75 percent of the original document size. |

**lHighestLevel (4 bytes):** If **fValid** is set to 1, this value MUST
be greater than or equal to the highest value of
[ASUMY](#asumy).**lLevel**.

**lCurrentLevel (4 bytes):** If **fValid** is set to 1, this value MUST
be equal to the following.

<embed src="media/media/image9.bin"
title="I Current Level if F Valid is set to 1"
style="width:3.22917in;height:0.64583in" />

If **wDlgLevel** is between 0xFFF7 and 0xFFFE, the value to use for
**wDlgLevel** is the equivalent percentage to maintain the meaning of
**wDlgLevel**. This value is compared to ASUMY.**lLevel** to see if is
to be part of the summary. If ASUMY.**lLevel** is less than or equal to
**lCurrentLevel**, it is to be part of the summary.

### Dogrid

The **Dogrid** structure specifies parameters for the drawn object
properties of the document.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xaGrid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | yaGrid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dxaGrid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | dyaGrid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dyGridDisplay |  |  |  |  |  |  | A | dxGridDisplay |  |  |  |  |  |  | B |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**xaGrid (2 bytes):** An [XAS_nonNeg](#xas_nonneg) that specifies
horizontal origin point of the drawing grid. See
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.15.1.44 (drawingGridHorizontalOrigin), where
**doNotUseMarginsForDrawingGridOrigin** has the opposite meaning of
**fFollowMargins**. The default value is 1701.

**yaGrid (2 bytes):** A [YAS_nonNeg](#yas_nonneg) that specifies the
vertical origin point of the drawing grid. See \[ECMA-376\] Part 1,
Section 17.15.1.46 (drawingGridVerticalOrigin), where
**doNotUseMarginsForDrawingGridOrigin** has the opposite meaning of
**fFollowMargins**. The default value is 1984.

**dxaGrid (2 bytes):** An XAS_nonNeg that specifies the horizontal grid
unit size of the drawing grid. See \[ECMA-376\] Part 1, Section
17.15.1.45 (drawingGridHorizontalSpacing). The default value is 180.

**dyaGrid (2 bytes):** A YAS_nonNeg that specifies the vertical grid
unit size of the drawing grid. See \[ECMA-376\] Part 1, Section
17.15.1.47 (drawingGridVerticalSpacing). The default value is 180.

**dyGridDisplay (7 bits):** A positive value, in units specified by
**dyaGrid**, that specifies the distance between vertical gridlines. See
\[ECMA-376\] Part 1, Section 17.15.1.28
(displayVerticalDrawingGridEvery) where drawingGridVerticalSpacing
refers to **dyaGrid**. The default value is 1.

**A - unused (1 bit):** This value is undefined, and MUST be ignored.

**dxGridDisplay (7 bits):** A positive value, in units specified by
**dxaGrid**, that specifies the distance between horizontal gridlines.
See \[ECMA-376\] Part 1, Section 17.15.1.27.
(displayHorizontalDrawingGridEvery) where drawingGridHorizontalSpacing
refers to **dxaGrid**. The default value is 1.

**B - fFollowMargins (1 bit):** A value that specifies whether to use
margins for drawing grid origin. See \[ECMA-376\] Part 1, Section
17.15.1.42 (doNotUseMarginsForDrawingGridOrigin), where the meaning is
the opposite of **fFollowMargins**. The default is 1.

### DopTypography

The **DopTypography** structure contains [**East Asian
language**](#gt_12f63b8b-1c85-4855-9ae1-e6b05720bcfc) typography
settings.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | B |  | C |  | D | E | F |  |  | G | reserved |  |  |  |  | cchFollowingPunct |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cchLeadingPunct |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | rgxchFPunct (202 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| rgxchLPunct (102 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**A - fKerningPunct (1 bit):** Specifies whether to kern punctuation
characters as specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 17.15.1.60 noPunctuationKerning, where the meaning of
noPunctuationKerning is the opposite of **fKerningPunct**.

**B - iJustification (2 bits):** Specifies the character-level
whitespace compression as specified in \[ECMA-376\] Part 1, Section
17.15.1.18 characterSpacingControl. This value MUST be one of the
following.

| Value       | Meaning                            |
|-------------|------------------------------------|
| 0 (default) | doNotCompress                      |
| 1           | compressPunctuation                |
| 2           | compressPunctuationAndJapaneseKana |

**C - iLevelOfKinsoku (2 bits):** This value
MAY<span id="Appendix_A_Target_198"
class="anchor"></span>[\<198\>](#Appendix_A_198) specify which set of
line breaking rules to use for [**East Asian
characters**](#gt_8dcae18f-67a0-4282-860e-1b6713fe6aae). This value MUST
be one of the following.


| Value | Meaning |
| --- | --- |
| 0 (default) | Chinese (Simplified) / Chinese (Traditional) / Japanese / Korean |
| 1 | Identical to 0 for all but Japanese where the following is used: / Cannot start a line: !%),.:;?]}¢°’"‰′″℃、。々〉》」』】〕ぁぃぅぇぉっゃゅょゎ゛゜ゝゞァィゥェォッャュョヮヵヶ・ーヽヾ！％），．：；？］｝｡｣､･ｧｨｩｪｫｬｭｮｯｰﾞﾟ￠ / Cannot end a line: $([\\{£¥‘"〈《「『【〔＄（［｛｢￡￥ |
| 2 | The characters that are forbidden to be used for starting or ending a line are specified by rgxchFPunct and rgxchLPunct . |



**D - f2on1 (1 bit):** Specifies whether to print two pages per sheet,
as specified in \[ECMA-376\] Part 1, Section 17.15.1.64 printTwoOnOne.

**E - unused (1 bit):** This value is undefined and MUST be ignored.

**F - iCustomKsu (3 bits):** This value specifies for what language the
characters in **rgxchFPunct** are
[**kinsoku**](#gt_3ec90cfa-5a13-4285-9296-70340122d2eb)
overrides<span id="Appendix_A_Target_199"
class="anchor"></span>[\<199\>](#Appendix_A_199). All other languages
act according to the description of **iLevelOfKinsoku** with a value of
0. This MUST be one of the following values.

| Value       | Language identifier   |
|-------------|-----------------------|
| 0 (default) | No language           |
| 1           | Japanese              |
| 2           | Chinese (Simplified)  |
| 3           | Korean                |
| 4           | Chinese (Traditional) |

**G - fJapaneseUseLevel2 (1 bit):** This value specifies that line
breaking rules for Japanese acts according to the description of
**iLevelOfKinsoku** with a value of 1[\<200\>](#Appendix_A_200). The
default value is 0.

**reserved (5 bits):** This value MUST be 0, and MUST be ignored.

**cchFollowingPunct (2 bytes):** A signed integer that specifies the
number of characters in **rgxchFPunct**. This MUST be a value between
0x0000 and 0x0064 inclusive. By default, this value is 0x0000.

**cchLeadingPunct (2 bytes):** A signed integer that specifies the
number of characters in **rgxchLPunct**. This MUST be a value between
0x0000 and 0x0032, inclusive. By default, this value is 0x0000.

**rgxchFPunct (202 bytes):** An array of **cchFollowingPunct**
[**Unicode**](#gt_c305d0ab-8b94-461a-bd76-13b40cb8c4d8) characters that
cannot start a line if the language of the text matches the language
specified in **iCustomKsu**. If **iCustomKsu** has a value of 0, this
array has no effect on the document.

**rgxchLPunct (102 bytes):** An array of **cchLeadingPunct** Unicode
characters that cannot end a line if the language of the text matches
the language specified in **iCustomKsu**. If **iCustomKsu** has a value
of 0, this array has no effect on the document.

### DopMth

The **DopMth** structure specifies document-wide math settings.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A |  | B |  | C |  |  | D | E | F | G | H | I | reserved2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ftcMath |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | dxaLeftMargin |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | dxaRightMargin |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | empty1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | empty2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | empty3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | empty4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | dxaIndentWrapped |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**A - mthbrk (2 bits):** Specifies how to break on binary operators as
specified in
[\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part 1,
Section 22.1.2.16 brkBin. This MUST be one of the following values.


| Value | Meaning |
| --- | --- |
| 0 (default) | Before. / In line wrapping, breaks occur on binary operators, so the binary operator appears before the break. |
| 1 | After. / In line wrapping, breaks occur on binary operators, so the binary operator appears after the break. |
| 2 | Repeat. / In line wrapping, breaks occur on binary operators, so the binary operator appears on both sides of the break. |



**B - mthbrkSub (2 bits):** Specifies how to break on binary subtraction
when **mthbrk** is 2 as specified in \[ECMA-376\] Part 1, Section
22.1.2.17 brkBinSub. This value MUST be one of the following.


| Value | Meaning |
| --- | --- |
| 0 (default) | Minus Minus. / Repetition of a subtraction sign after a line-wrapping break is minus on the first and second lines. |
| 1 | Plus Minus. / Repetition of a subtraction sign after a line-wrapping break is plus on the first line and minus on the second line. |
| 2 | Minus Plus. / Repetition of a subtraction sign after a line-wrapping break is minus on the first line and plus on the second line. |



**C - mthbpjc (3 bits):** Specifies the default justification of math as
specified in \[ECMA-376\] Part 1, Section 22.1.2.25 defJc. This MUST be
one of the following values.


| Value | Meaning |
| --- | --- |
| 1 (default) | Centered as Group. / Justifies equations with respect to each other and centers the group of equations with respect to the page. |
| 2 | Center. / Centers each equation individually with respect to margins. |
| 3 | Left. / Left justification of the paragraph containing only math. |
| 4 | Right. / Right justification of the paragraph containing only math. |



**D - reserved1 (1 bit):** This value is undefined and MUST be ignored.

**E - fMathSmallFrac (1 bit):** Specifies whether to use a reduced
fraction size when displaying math that contains fractions as specified
in \[ECMA-376\] Part 1, Section 22.1.2.98 smallFrac. By default, this
value is 0.

**F - fMathIntLimUndOvr (1 bit):** Specifies that the default placement
of integral limits when converting from a linear format is directly
above and below the base as opposed to on the side of the base as
specified in \[ECMA-376\] Part 1, Section 22.1.2.49 intLim. By default,
this value is 0.

**G - fMathNaryLimUndOvr (1 bit):** Specifies that the default placement
of n-ary limits other than integrals is directly above and below the
base, as opposed to on the side of the base, as specified in
\[ECMA-376\] Part 1, Section 22.1.2.71 naryLim. By default, this value
is 0.

**H - fMathWrapAlignLeft (1 bit):** Specifies the left justification of
the wrapped line of an equation as opposed to right justification of the
wrapped line of an equation as specified in \[ECMA-376\] Part 1, Section
22.1.2.121 wrapRight where the meaning is the opposite of
**fMathWrapAlignLeft**. By default, this value is 1.

**I - fMathUseDispDefaults (1 bit):** Specifies whether to use display
math defaults as specified in \[ECMA-376\] Part 1, Section 22.1.2.30
dispDef. By default, this value is 1.

**reserved2 (19 bits):** This value MUST be 0, and MUST be ignored.

**ftcMath (2 bytes):** An index into an [**SttbfFfn**](#sttbfffn)
structure that specifies the font to use for new equations in the
document. The default font is Cambria Math.

**dxaLeftMargin (4 bytes):** A signed integer, in
[**twips**](#gt_4b82472c-103d-4eff-a07e-6a0f784e3382), that specifies
the left margin for math. MUST be greater than or equal to 0 and less
than or equal to 31680 as specified in \[ECMA-376\] Part 1, Section
22.1.2.59 lMargin. By default, this value is 0.

**dxaRightMargin (4 bytes):** A signed integer in twips that specifies
the right margin for math. This value MUST be greater than or equal to 0
and less than or equal to 31680, as specified in \[ECMA-376\] Part 1,
Section 22.1.2.90 rMargin. By default, this value is 0.

**empty1 (4 bytes):** This value MUST be 120, and MUST be ignored.

**empty2 (4 bytes):** This value MUST be 120, and MUST be ignored.

**empty3 (4 bytes):** This value MUST be 0, and MUST be ignored.

**empty4 (4 bytes):** This value MUST be 0, and MUST be ignored.

**dxaIndentWrapped (4 bytes):** A signed integer, in twips, that
specifies the indentation of the wrapped line of an equation. This value
MUST be greater than or equal to 0 and less than or equal to 31680 as
specified in \[ECMA-376\] Part 1, Section 22.1.2.120 wrapIndent. By
default, this value is 1440.
