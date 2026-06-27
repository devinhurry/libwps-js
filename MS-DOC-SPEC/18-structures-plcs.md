# Structures

## PLCs

### Plcbkf

The **Plcbkf** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[BKF](#bkf) structures (6 bytes each). Each
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) in the Plcbkf, with the
exception of the last CP, represents the character position of the start
of a [**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a
[Document Part](#Section_5f0c432987184d678cc760d8968c5127). For every
Plcbkf, there is a corresponding [Plcbkl](#plcbkl). Each data element in
the Plcbkf is associated in a one-to-one correlation with a data element
in that Plcbkl, whose corresponding CP represents the character position
of the end of the same bookmark. Constraints on the CPs inside a Plcbkf
as they relate to the CPs in its corresponding Plcbkl can be found in
the description of [Plcfbkf](#plcfbkf), which shares the same
constraints in relation to its corresponding [Plcfbkl](#plcfbkl).

The only type of bookmark found in a Plcbkf is a [**range-level
protection bookmark**](#gt_de964a62-a534-4a1d-9d49-6cadafb096be). The
largest valid value for a CP marking the start or end of a range-level
protection bookmark is the CP representing the end of all document
parts.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aBKF (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. Each CP in the array specifies the
start of a bookmark in the document.

**aBKF (variable):** An array of BKFs (6 bytes each), each of which
specifies additional information about the bookmark starting at the
corresponding CP in **aCP**.

### Plcbkfd

The **Plcbkfd** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[BKFD](#bkfd) structures (10 bytes each). Each
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) in the Plcbkfd that is
not the last CP represents the character position of the start of a
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a [Document
Part](#Section_5f0c432987184d678cc760d8968c5127). For every Plcbkfd,
there is a corresponding [Plcbkld](#plcbkld). Each data element in the
Plcbkfd is associated in a one-to-one correlation with a data element in
the corresponding Plcbkld. The CP corresponding to the data element in
the Plcbkld represents the character position of the end of the same
bookmark. Constraints upon the CPs inside a Plcbkfd as they relate to
the CPs in its corresponding Plcbkld can be found with the description
of [Plcfbkf](#plcfbkf), which shares the same constraints in relation to
its corresponding [Plcfbkl](#plcfbkl).

The only type of bookmark found in a Plcbkfd is a [**structured document
tag bookmark**](#gt_ad0003b6-75cc-4c4c-80fe-859dacbea6d7). When a
structured document tag bookmark is created, a character demarcating the
start of an arbitrary XML range (see
[sprmCFSpec](#character-properties)) is inserted into the CP stream at
the start of the bookmark range. The CP defining the start of a
structured document tag bookmark MUST be the offset of that character.
As a result, the start CPs of structured document tag bookmarks MUST be
unique within their containing PLC.

When a structured document tag bookmark is created, a character
demarcating the end of an arbitrary XML range (see sprmCFSpec) is
inserted into the CP stream at the end of the bookmark range. The CP
defining the limit of a structured document tag bookmark MUST be 1
greater than the CP of that character. As a result, the limit CPs of
structured document tag bookmarks MUST be unique within their containing
PLC, and the CP specifying the start of a structured document tag
bookmark MUST be less than the CP specifying the end of the bookmark by
at least 2.

If the range of text spanned by a structured document tag bookmark’s CPs
contains the CP defining the start or end of another structured document
tag bookmark, then it MUST contain the entire range of text spanned by
that other bookmark. If the range of text spanned by a structured
document tag bookmark’s CPs contains content from inside a table and
content from outside that table, then it MUST contain the entire table,
with possible omission of the table’s final [**end of cell
mark**](#gt_2dfdaa55-39fd-4dc0-a630-dae1c4c09c9b) and TTP mark. In such
case, the final end of cell and TTP mark MUST be omitted if and only if
the structured document tag bookmark’s range does not include text
following the table’s final TTP mark.

The largest value that a CP marking the start or end of a structured
document tag bookmark is allowed to have is the CP representing the end
of all document parts.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aBKFD (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs, each indicating the start of a
bookmark in the document.

**aBKFD (variable):** An array of BKFDs (10 bytes each), each of which
specifies additional information about the bookmark starting at the
corresponding CP in **aCP**.

### Plcbkl

A **Plcbkl** is a [PLC](#Section_a649fcc578684245be1204eea89d916b) that
contains only [CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s and no
additional data. It is thus equivalent to a [Plcfbkl](#plcfbkl). Each CP
in the Plcbkl that is not the last CP represents the character position
marking the first character beyond the end of a
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a [Document
Part](#Section_5f0c432987184d678cc760d8968c5127). Additional constraints
upon the CPs inside a Plcbkl can be found in the specification of
[Plcbkf](#plcbkf).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs, each indicating the first character
beyond the end of a bookmark in the document.

### Plcbkld

A **Plcbkld** is a [PLC](#Section_a649fcc578684245be1204eea89d916b)
whose data elements are [BKLD](#bkld) structures (8 bytes each). Each
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) in the Plcbkld, with the
exception of the last CP, represents the character position of the first
character following the end of a
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a [Document
Part](#Section_5f0c432987184d678cc760d8968c5127). Additional constraints
on the CPs inside a Plcbkld can be found in the description of
[Plcbkfd](#plcbkfd).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aBKLD (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. Each CP in the array indicates the
first character following the end of a bookmark in the document.

**aBKLD (variable):** An array of BKLDs (8 bytes each), each of which
specifies additional information about the bookmark ending at the
corresponding CP in **aCP**.

### PlcBteChpx

The **PlcBteChpx** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) that maps the offsets
of text in the [WordDocument
stream](#Section_d7fae142670d4cd5869a708366984a71) to the character
properties of that text. Where most PLCs map
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s to data, the
**PlcBteChpx** maps stream offsets to data instead. A **PlcBteChpx**
MUST NOT contain duplicate stream offsets.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aFC (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aPnBteChpx (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aFC (variable):** An array of unsigned integers. Each element in this
array specifies an offset in the WordDocument stream where text begins.
The end of each range is the beginning of the next range. As with all
PLCs, the elements of **aFC** MUST be sorted in ascending order.

**aPnBteChpx (variable):** An array of [PnFkpChpx](#pnfkpchpx) (4 bytes
each). Each element of this array specifies the location in the
WordDocument stream of a [ChpxFkp](#chpxfkp). That ChpxFkp contains the
character properties for the text at the corresponding offset in
**aFC**.

### PlcBtePapx

The **PlcBtePapx** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) that specifies
paragraph, table row, or table cell properties as described later. Where
most PLCs map [CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s to data,
the **PlcBtePapx** maps stream offsets to data instead. The offsets in
**aFC** partition a portion of the [WordDocument
stream](#Section_d7fae142670d4cd5869a708366984a71) into adjacent ranges.

Consider the collection of paragraphs, table rows, and table cells whose
last character occurs at an offset in the WordDocument stream larger
than or equal to **aFC**\[*i*\] but smaller than **aFC**\[*i*+1\]. Then,
**aPnBtePapx**\[*i*\] specifies the properties of these paragraphs,
table rows, or table cells.

A **PlcBtePapx** MUST NOT contain duplicate stream offsets. Each data
element of **PlcBtePapx** is 4 bytes long.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aFC (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aPnBtePapx (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aFC (variable):** An array of unsigned integers. Each element in this
array specifies an offset in the WordDocument stream. The elements of
**aFC** MUST be sorted in ascending order, and there MUST NOT be any
duplicate entries.

**aPnBtePapx (variable):** An array of [PnFkpPapx](#pnfkppapx). The
*i*th entry in **aPnBtePapx** is a PnFkpPapx that specifies the
properties of all paragraphs, table rows, and table cells whose last
character occurs at an offset in the WordDocument stream larger than or
equal to **aFC**\[*i*\] but smaller than **aFC**\[*i*+1\];
**aPnBtePapx** MUST contain one less entry than **aFC**.

### PlcfandRef

The **PlcfandRef** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[ATRDPre10](#atrdpre10) structures (30 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aATRDPre10 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s, all but the last of
which specify the location of comment references in the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e). All but the last
CP MUST be greater than or equal to zero and less than
**[FibRgLw97](#fibrglw97).ccpText**. Each position in the main document
specified by one of these CPs MUST be character 0x05 and have
[sprmCFSpec](#character-properties) applied with a value of 1. The last
CP MUST be ignored. A **PlcfandRef** MUST NOT contain duplicate CPs.

**aATRDPre10 (variable):** An array of ATRDPre10 structures (30 bytes
each) that associate data with a comment located at the corresponding
CP. Each ATRDPre10 structure contains the initials of the user who made
the comment, an index into a string table of authors, and a
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) index. See
ATRDPre10 and [ATRDPost10](#atrdpost10) for more information about data
associated with comments.

### PlcfandTxt

The **PlcfandTxt** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) that contains only
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s and no additional data.
This means that the size of the data is 0 bytes.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs that specifies positions in the
[comment document](#Section_486f5a89fba5412f8ac61c551654ddcd). Each CP
except the last two specifies the beginning of a range of text to appear
in a comment indicated by the corresponding [PlcfandRef](#plcfandref)
CPs. The range of text MUST begin with character 0x0005 with
[sprmCFSpec](#character-properties) applied with a value of 1, and MUST
end with a paragraph mark
([**Unicode**](#gt_c305d0ab-8b94-461a-bd76-13b40cb8c4d8) 0x000D) at
table depth zero immediately before the next CP. Each range MUST be a
[valid selection](#Section_8d8fece5bdbc42588457916540075e3f). Except for
the last CPs, each CP MUST be greater than or equal to zero and less
than **[FibRgLw97](#fibrglw97).ccpAtn**. The second-to-last CP only ends
the last text range and MUST be equal to **FibRgLw97.ccpAtn**
decremented by 1. The last CP is undefined and MUST be ignored. A
PlcfandTxt MUST NOT contain duplicate CPs.

### PlcfAsumy

The **PlcfAsumy** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[ASUMY](#asumy) (4 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aASUMY(variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the set of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e), but can extend
into any of the document parts.

Each CP specifies the beginning of a range of text to which the
corresponding ASUMY structure applies. The range of text ends
immediately prior to the next CP. A PlcfAsumy MUST NOT contain duplicate
CPs.

The last CP does not begin a new text range; it only terminates the
previous one.

**aASUMY (variable):** An array of ASUMY that indicates the priority of
the corresponding text range for purposes of
[**AutoSummary**](#gt_f4f3be71-a6a0-43a1-974d-cf345372f5bf).

### Plcfbkf

A **Plcfbkf** is a [PLC](#Section_a649fcc578684245be1204eea89d916b)
whose data elements are [FBKF](#fbkf) structures (4 bytes each). Each
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) in the Plcfbkf that is
not the last CP represents the character position of the start of a
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a [document
part](#Section_5f0c432987184d678cc760d8968c5127). For every Plcfbkf,
there is a corresponding [Plcfbkl](#plcfbkl). Each data element in the
Plcfbkf is associated in a one-to-one correlation with a data element in
that Plcfbkl, whose corresponding CP represents the character position
of the end of the same bookmark.

The following constraints apply to CPs in all bookmark PLCs.

The last CP in a bookmark PLC MUST have a value that is one greater than
the largest CP that a bookmark of the type associated with the PLC is
allowed to have and MUST be ignored. Unless otherwise specified by a
particular type of bookmark, bookmark PLCs can contain duplicate CPs
because bookmarks can overlap. The CP defining the start of a bookmark
MUST be less than or equal in value to the CP defining the limit of the
bookmark. The range of text spanned by a bookmark’s (1) CPs MUST obey
all constraints, excluding those concerning tables, upon [valid
selections](#Section_8d8fece5bdbc42588457916540075e3f) defined in
section 2.2.3. The following constraints reference entities defined in
section [2.4.3](#Section_5b45f0e777604fdbaf880146de2feb4c) Overview of
Tables. For bookmark types whose **[BKC](#bkc).fCol** MUST be 0, the
following rule 1 MUST apply. Otherwise, the following rule 2 MUST apply:

1.  If the range of text spanned by a bookmark’s (1) CPs contains a
    table cell mark, then its start CP MUST be less than or equal to the
    CP of the beginning of the cell in question and its limit CP MUST
    either be one less than the CP of a cell mark in that table, one
    greater than the CP of a TTP mark in that table, or outside the
    table. If the range of text spanned by a bookmark’s (1) CPs contains
    a TTP mark in a table, then its start CP MUST be outside the table,
    or the first character of a row in the table. If the range of text
    spanned by a bookmark’s (1) CPs contains a TTP mark in a table, then
    its limit CP MUST be outside the table, or two less than the CP of a
    TTP mark in the table, or one greater than the CP of a TTP mark in
    the table.

2.  If the range of text spanned by a bookmark’s (1) CPs contains
    content from a cell in a table and content from outside that table,
    then it MUST contain only whole rows of the table containing that
    cell. If the range of text spanned by a bookmark’s (1) CPs contains
    a table cell mark or TTP mark, then it MUST NOT span partial rows of
    the table containing that cell or TTP.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFBKF (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs, each indicating the start of a
bookmark (1) in the document.

**aFBKF (variable):** An array of FBKFs (4 bytes each), each of which
specifies additional information about the bookmark starting at the
corresponding CP in **aCP**.

### Plcfbkfd

The **Plcfbkfd** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[FBKFD](#fbkfd) structures (6 bytes each). Each
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) in the Plcfbkfd, with
the exception of the last CP, represents the character position of the
start of a [**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a
[document part](#Section_5f0c432987184d678cc760d8968c5127). For every
Plcfbkfd, there is a corresponding [Plcfbkld](#plcfbkld). Each data
element in the Plcfbkfd is associated in a one-to-one correlation with a
data element in that Plcfbkld, whose corresponding CP represents the
character position of the end of the same bookmark. Constraints on the
CPs inside a Plcfbkfd as they relate to the CPs in its corresponding
Plcfbkld can be found in the description of [Plcfbkf](#plcfbkf), which
shares the same constraints in relation to its corresponding
[Plcfbkl](#plcfbkl).

The only types of bookmark found in a Plcfbkfd are [**format
consistency-checker
bookmarks**](#gt_2f3fbf82-4359-4b12-aeec-1968eb797ee5) and [**smart tag
bookmarks**](#gt_4ce58819-c45f-4bcc-8c3d-36268e1f8f0b). The largest
value that a CP marking the start or end of a format consistency-checker
bookmark or a smart tag bookmark is allowed to have is the CP
representing the end of all document parts.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFBKFD (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. Each CP in the array indicates the
start of a bookmark in the document.

**aFBKFD (variable):** An array of FBKFDs (6 bytes each), each of which
specifies additional information about the bookmark starting at the
corresponding CP in **aCP**.

### Plcfbkl

The **Plcfbkl** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) that contains only
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s and no additional data.
Thus, a **Plcfbkl** is equivalent to a [Plcbkl](#plcbkl). Each CP in the
Plcfbkl, with the exception of the last CP, represents the character
position marking the first character following the end of a
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a [document
part](#Section_5f0c432987184d678cc760d8968c5127). Further constraints on
the CPs inside a Plcfbkl can be found in the description of
[Plcfbkf](#plcfbkf).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. Each CP in the array indicates the
first character following the end of a bookmark in the document.

### Plcfbkld

The **Plcfbkld** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[FBKLD](#fbkld) structures (4 bytes each). Each
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) in the Plcfbkld that is
not the last CP represents the character position of the first character
following the end of a
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) in a [document
part](#Section_5f0c432987184d678cc760d8968c5127). Further constraints on
the CPs inside a Plcfbkld can be found in the description of
[Plcfbkfd](#plcfbkfd).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFBKLD (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. Each CP in the array indicates the
first character following the end of a bookmark in the document.

**aFBKLD (variable):** An array of FBKLDs (4 bytes each), each of which
specifies additional information about the bookmark ending at the
corresponding CP in **aCP**.

### Plcfcookie

The **Plcfcookie** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[FCKS](#fcks) structures (10 bytes).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFCKS (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s specifying the starting
points of text ranges associated with [**grammar checker
cookie**](#gt_69c5a114-8e6b-4003-b8e4-a06577cfc226) data. The last CP in
the array MUST be ignored. CPs are positions in the set of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e), but can extend
into any of the document parts. A **Plcfcookie** MAY contain duplicate
CP values if the corresponding [**grammar
checker**](#gt_19363950-99e9-4f11-a562-96e4dd4ea5ce) chose to store more
than one grammar checker cookie at the same CP.

**aFCKS (variable):** An array of FCKS structures (10 bytes each). Each
**FCKS** specifies information about a grammar checker cookie which
applies to text starting at the corresponding CP value.

### PlcfcookieOld

The **PlcfcookieOld** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) whose data elements
are [**FCKSOLD**](#fcksold) structures (16 bytes).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFCKSOLD (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s specifying the starting
points of text ranges associated with [**grammar checker
cookie**](#gt_69c5a114-8e6b-4003-b8e4-a06577cfc226) data. The last CP in
the array MUST be ignored. CPs are positions in the set of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e), but can extend
into any of the document parts. A **PlcfcookieOld** MAY contain
duplicate CP values if the corresponding [**grammar
checker**](#gt_19363950-99e9-4f11-a562-96e4dd4ea5ce) chose to store more
than one grammar checker cookie at the same CP.

**aFCKSOLD (variable):** An array of FCKSOLD structures (16 bytes each).
Each FCKSOLD specifies information about a grammar checker cookie which
applies to text starting at the corresponding CP value.

### PlcfendRef

The **PlcfendRef** is a [PLC](#Section_a649fcc578684245be1204eea89d916b)
whose data elements are integers of 2 bytes each.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aEndIdx (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s, all but the last of
which specify the location of endnote references in the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e). All but the last
CP MUST be greater than or equal to zero and less than
**[FibRgLw97](#fibrglw97).ccpText**. The last CP MUST be ignored. A
**PlcfendRef** MUST NOT contain duplicate CPs.

**aEndIdx (variable):** An array of 2-byte integers that specifies
whether each endnote is automatically numbered or uses a custom symbol.
If equal to zero, the endnote reference uses a custom symbol; otherwise,
it is automatically numbered. If the endnote reference is automatically
numbered, the character in the main document at the position specified
by the corresponding CP MUST equal 0x02 and have
[sprmCFSpec](#character-properties) applied with a value of 1. See
sprmCSymbol for more information about custom symbols and
[sprmSRncEdn](#section-properties), sprmSNEdn, and sprmSNfcEdnRef for
more information about automatically numbered endnotes.

### PlcfendTxt

The **PlcfendTxt** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) that contains only
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s and no additional data.
The data thus has a size of zero bytes.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs that specifies offsets into the
[endnote document](#Section_13659f756a694a5f8e035f9bced90faa). Each CP
except the last two specifies the beginning of a range of text to appear
in an endnote. The range of text MUST end in character 0x0D immediately
before the next CP. Except for the last CP, each CP MUST be greater than
or equal to zero and less than **[FibRgLw97](#fibrglw97).ccpEdn**. The
second-to-last CP only ends the last text range and MUST be equal to
**FibRgLw97.ccpEdn** – 1. The last CP is undefined and MUST be ignored.
A **PlcfendTxt** MUST NOT contain duplicate CPs.

### Plcffactoid

The **Plcffactoid** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) structure where the
data elements are [FactoidSpls](#sed) structures of 2 bytes each.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFactoidSpls (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the set of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e), but can extend
into any of the document parts.

Each CP specifies the beginning of a range of text where the state in
the corresponding [FactoidSpls](#factoidspls) structure applies. The
range of text ends immediately prior to the next CP.

A **Plcffactoid** can contain duplicate CPs. Duplicate CPs specify an
[**insertion point**](#gt_fad7dafb-1cf1-455e-820b-e2b34586a6f3) or a
[**deletion point**](#gt_c2ecfc06-8cce-4183-88d4-b34aaea78850) at that
CP and the corresponding FactoidSpls state applies to that point.

The last CP does not begin a new text range; it only terminates the
previous one.

**aFactoidSpls (variable):** An array of 2-byte FactoidSpls structures.
Each FactoidSpls structure contains the state of the [**smart tag
recognizer**](#gt_31f2a874-4490-4c2c-9e2c-6267f373bf5c) for the
corresponding text range.

### PlcffndRef

The **PlcffndRef** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
integers of 2 bytes each.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFtnIdx (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s, all but the last of
which specify the location of footnote references in the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e). All but the last
CP MUST be greater than or equal to zero and less than
**[FibRgLw97](#fibrglw97).ccpText**. The last CP MUST be ignored. A
**PlcffndRef** MUST NOT contain duplicate CPs.

**aFtnIdx (variable):** An array of 2-byte integers that specifies
whether each footnote is automatically numbered or uses a custom symbol.
If equal to zero, the footnote reference uses a custom symbol;
otherwise, it is automatically numbered. If the footnote reference is
automatically numbered, the character in the main document at the
position specified by the corresponding CP MUST equal 0x02 and have
[sprmCFSpec](#character-properties) applied with a value of 1. See
sprmCSymbol for more information about custom symbols and
[sprmSRncFtn](#section-properties), sprmSNFtn, and sprmSNfcFtnRef for
more information about automatically numbered footnotes.

### PlcffndTxt

The **PlcffndTxt** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) that contains only
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s and no additional data.
The data thus has a size of 0 bytes.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs that specifies offsets into the
[footnote document](#Section_f7e96a05aad74acba06dbfa430ac1fcc). Each CP
except the last two specifies the beginning of a range of text to appear
in a footnote. The range of text MUST end in character 0x0D immediately
before the next CP. Except for the last CP, each CP MUST be greater than
or equal to zero and less than **[FibRgLw97](#fibrglw97).ccpFtn**. The
second-to-last CP only ends the last text range and MUST be equal to
**FibRgLw97.ccpFtn** – 1. The last CP is undefined and MUST be ignored.
A **PlcffndTxt** MUST NOT contain duplicate CPs.

### Plcfgram

The **Plcfgram** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) structure where the
data elements are [GrammarSpls](#grammarspls) structures (2 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aGrammarSpls (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the set of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e) but can extend into
any of the document parts.

Each CP specifies the beginning of a range of text where the state in
the corresponding GrammarSpls structure applies. The range of text ends
immediately prior to the next CP.

A **Plcfgram** can contain duplicate CPs. Duplicate CPs specify an
[**insertion point**](#gt_fad7dafb-1cf1-455e-820b-e2b34586a6f3) or a
[**deletion point**](#gt_c2ecfc06-8cce-4183-88d4-b34aaea78850) at that
CP and the corresponding GrammarSpls state applies to that point.

The last CP does not begin a new text range; it only terminates the
previous one.

**aGrammarSpls (variable):** An array of 2-byte GrammarSpls structures.
Each GrammarSpls structure contains the state of the grammar checker for
the corresponding text range.

### Plcfhdd

The **Plcfhdd** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) that contains only
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s and no additional data.
It specifies where [header
document](#Section_8465bee76c7945a9812e58b0c5fd6cdc) stories begin and
end.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. Each CP except the last two
specifies the beginning of a story in the header document. Each story
ends immediately prior to the next CP. If the next CP in **Plcfhdd** has
the same value as a CP specifying the beginning of a story, then the
story is considered empty.

Except for the last CP, each CP of **Plcfhdd** MUST be greater than or
equal to 0 and less than [FibRgLw97](#fibrglw97).**ccpHdd**. The
second-to-last CP only ends the last story and MUST be equal to
FibRgLw97.**ccpHdd** minus 1. The last CP is undefined and MUST be
ignored.

### PlcfHdrtxbxTxt

The **PlcfHdrtxbxTxt** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) structure in which the
data elements are [FTXBXS](#ftxbxs) structures (22 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFTXBXS (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the [header textboxes
document](#Section_7392319674e14e6988b8d2cc9ac8093b).

Each CP specifies the beginning of a range of text to appear in a text
box indicated by the corresponding FTXBXS structure. The range of text
ends immediately prior to the next CP. The last CP does not begin a new
text range; it only terminates the previous one.

A **PlcfHdrtxbxTxt** MUST NOT contain duplicate CPs. The text ranges for
each FTXBXS structure are separated by 0x0D characters that MUST be the
last character in each range. The last text range is an exception. The
text in the last range is ignored, and the 0x0D character is not
required.

**aFTXBXS (variable):** An array of FTXBXS (22 bytes each) structures
that associate the text ranges with shape objects.

### Plcflad

The **Plcflad** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) structure where the
data elements are [**LadSpls**](#ladspls) structures (2 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aLadSpls (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the set of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e), but can extend
into any of the document parts.

Each CP specifies the beginning of a range of text where the state in
the corresponding LadSpls structure applies. The range of text ends
immediately prior to the next CP.

A **Plcflad** can contain duplicate CPs. Duplicate CPs specify an
[**insertion point**](#gt_fad7dafb-1cf1-455e-820b-e2b34586a6f3) or a
[**deletion point**](#gt_c2ecfc06-8cce-4183-88d4-b34aaea78850) at that
CP and the corresponding LadSpls state applies to that point.

The last CP does not begin a new text range; it only terminates the
previous one.

**aLadSpls (variable):** An array of 2-byte LadSpls structures. Each
LadSpls structure contains the state of [**language
auto-detection**](#gt_a75c76d8-cf01-4540-a8e7-24b367b28370) for the
corresponding text range.

### Plcfld

The **Plcfld** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[Fld](#fld)s (2 bytes each). It specifies the location of
[**field**](#gt_f819dd42-7f44-4613-8231-d5ad47f2bbcc)s in the document.

A field consists of two parts: field instructions and, optionally, a
result. All fields MUST begin with
[**Unicode**](#gt_c305d0ab-8b94-461a-bd76-13b40cb8c4d8) character 0x0013
with [sprmCFSpec](#character-properties) applied with a value of 1. This
is the *field begin character*. All fields MUST end with a Unicode
character 0x0015 with sprmCFSpec applied with a value of 1. This is the
*field end character*. If the field has a result, then there MUST be a
Unicode character 0x0014 with sprmCFSpec applied with a value of 1
somewhere between the field begin character and the field end character.
This is the *field separator*. The *field result* is the content between
the field separator and the field end character. The *field
instructions* are the content between the field begin character and the
field separator, if one is present, or between the field begin character
and the field end character if no separator is present. The field begin
character, field end character, and field separator are collectively
referred to as *field characters*.

The field instructions and field result MUST each be a [valid
selection](#Section_8d8fece5bdbc42588457916540075e3f).

The [CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s of a **Plcfld**
specify the location of the field characters. A **Plcfld** MUST NOT
contain duplicate CPs. Each [document
part](#Section_5f0c432987184d678cc760d8968c5127) has its own **Plcfld**,
with CPs relative to the start of that document part.

The last CP in **aCP** does not specify the location of a field
character. Because a **Plcfld** is a PLC, **aCP** MUST be sorted.
Because **aCP** MUST NOT contain duplicate CPs, the last CP MUST be the
largest in **aCP**. Other than those constraints, the last CP in **aCP**
is undefined and MUST be ignored.

The Flds MUST be arranged such that the sequence of
Fld.[fldch](#fldch).ch is a valid **FieldList** according to the
following [**Augmented Backus-Naur Form
(ABNF)**](#gt_24ddbbb4-b79e-4419-96ec-0fdd229c9ebf) rulelist. ABNF is
specified in
[\[RFC4234\]](https://go.microsoft.com/fwlink/?LinkId=90462).

| Begin     | =   | 0x13        |             |         |             |         |
|-----------|-----|-------------|-------------|---------|-------------|---------|
| Sep       | =   | 0x14        |             |         |             |         |
| End       | =   | 0x15        |             |         |             |         |
| Field     | =   | \<Begin\>   | \*\<Field\> | \[Sep\] | \*\<Field\> | \<End\> |
| FieldList | =   | \*\<Field\> |             |         |             |         |

Additionally, the field characters of the following five field types
MUST NOT appear in **aFld**.

1.  XE, as specified in
    [\[ECMA-376\]](https://go.microsoft.com/fwlink/?LinkId=200054) Part
    1, Section 17.16.5.72

2.  TC, as specified in \[ECMA-376\] Part 1, Section 17.16.5.63

3.  RD, as specified in \[ECMA-376\] Part 1, Section 17.16.5.50

4.  TA, as specified in \[ECMA-376\] Part 1, Section 17.16.5.62

5.  PRIVATE, as specified in \[ECMA-376\] Part 1, Section 17.16.5.48


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFld (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. Specifies the positions of field
characters in the document.

**aFld (variable):** An array of **Fld**. Specifies properties for the
field character at the corresponding CP. Fldch.ch of each **Fld** MUST
be equal to the character at the corresponding CP.

### PlcfSed

The **PlcfSed** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) structure where the
data elements are [**Sed**](#sed) structures (12 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aSed (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. Each CP specifies the
beginning of a range of text in the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e) that constitutes a
[**section**](#gt_49a2b98a-d101-4889-9108-87f567e758cf). The range of
text ends immediately prior to the next CP. A **PlcfSed** MUST NOT
contain duplicate CPs. There MUST also be an end-of-section character
(0x0C) as the final character in the text range of all but the last
section. An end-of-section character (0x0C) which occurs at a CP and
which is not the last character in a section specifies a manual page
break.

The last CP does not begin a new section. It MUST be at or beyond the
end of the main document. Sections only contain text from the main
document, so even when the last CP comes after text in other [document
parts](#Section_5f0c432987184d678cc760d8968c5127), that text is not part
of the last section.

**aSed (variable):** An array of 12-byte Sed structures. Each Sed
structure contains the location of properties pertaining to the section
that begins at the corresponding CP.

### PlcfSpa

The **PlcfSpa** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) structure in which
the data elements are [**SPA**](#spa) structures (26 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aSpa (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. Each CP specifies the
position in the [document
part](#Section_5f0c432987184d678cc760d8968c5127) of the anchor for a
shape. This array MUST NOT contain duplicate CPs. The characters at all
but the last CP MUST be 0x08 and MUST have
[sprmCFSpec](#character-properties) applied with a value of 1. See
sprmCFSpec for more information.

**aSpa (variable):** An array of SPAs (26 bytes each) that specify
properties for the shape at the corresponding CP.

### Plcfspl

The **Plcfspl** structure is a
[Plc](#Section_a649fcc578684245be1204eea89d916b) structure whose data
elements are [SpellingSpls](#spellingspls) structures (2 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aSpellingSpls (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the set of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e) but can extend into
any of the document parts.

Each CP specifies the beginning of a range of text where the state in
the corresponding SpellingSpls structure applies. The range of text ends
immediately prior to the next CP.

A **Plcfspl** can contain duplicate CPs. Duplicate CPs specify an
[**insertion point**](#gt_fad7dafb-1cf1-455e-820b-e2b34586a6f3) or a
[**deletion point**](#gt_c2ecfc06-8cce-4183-88d4-b34aaea78850) at that
CP and the corresponding SpellingSpls state applies to that point.

The last CP does not begin a new text range; it only terminates the
previous one.

**aSpellingSpls (variable):** An array of 2-byte SpellingSpls
structures. Each SpellingSpls structure contains the state of the
spelling checker for the corresponding text range.

### PlcfTch

The **PlcfTch** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) whose data elements
are [**Tch**](#tch) structures (4 bytes each). The count of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s MUST be equal to one
more than the count of **Tch**. Each pair of CPs represents a range of
text in the [main document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e)
described by the corresponding **Tch**.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aTCH (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



This information is a deprecated cache of table characters that
SHOULD<span id="Appendix_A_Target_201"
class="anchor"></span>[\<201\>](#Appendix_A_201) be ignored. The
following three CPs and the following two **Tch** structures
SHOULD<span id="Appendix_A_Target_202"
class="anchor"></span>[\<202\>](#Appendix_A_202) be written to specify
that this cache is undefined.

| CP                                     |
|----------------------------------------|
| 0                                      |
| [FibRgLw97](#fibrgfclcb97)**.ccpText** |
| FibRgLw97**.ccpText** + 2              |

The following specifies the values for the fields of the first **Tch**
structure.

| Field   | Value |
|---------|-------|
| fUnk    | 0     |
| fUnused | 0     |

The following specifies the values for the fields of the second **Tch**
structure.

| Field   | Value |
|---------|-------|
| fUnk    | 1     |
| fUnused | 0     |

**aCP (variable):** An array of CPs. Each CP specifies the beginning of
a range of text where a table character cache is stored. The last CP
denotes the end of the last range of text. The range of text ends
immediately prior to the next CP. MUST NOT contain duplicate CPs.

**aTCH (variable):** An array of Tch structures (4 bytes each) that each
specifies a table character cache at the corresponding CP in **aCP**.

### PlcfTxbxBkd

The **PlcfTxbxBkd** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) structure where the
data elements are [**Tbkd**](#tbkd) structures (6 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aTbkd (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the [textboxes document](#Section_f87b35602c234d109751ff141d307308).

Each CP specifies the beginning of a range of text to appear in a
textbox specified in the corresponding **Tbkd** structure. The range of
text ends immediately prior to the next CP. The last CP does not begin a
new text range; it only terminates the previous one.

A **PlcfTxbxBkd** MUST NOT contain duplicate CPs.

**aTbkd (variable):** An array of 6-byte **Tbkd** structures that
associate the text ranges with [**FTXBXS**](#ftxbxs) objects from
[**PlcftxbxTxt**](#plcftxbxtxt).

### PlcfTxbxHdrBkd

The **PlcfTxbxHdrBkd** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) structure where the
data elements are [Tbkd](#tbkd) structures (6 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aTbkd (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the [header textboxes
document](#Section_7392319674e14e6988b8d2cc9ac8093b).

Each CP specifies the beginning of a range of text to appear in a
textbox specified in the corresponding Tbkd structure. The range of text
ends immediately prior to the next CP. The last CP does not begin a new
text range; it only terminates the previous one.

A **PlcfTxbxHdrBkd** MUST NOT contain duplicate CPs.

**aTbkd (variable):** An array of 6-byte Tbkd structures that associates
the text ranges with [FTXBXS](#ftxbxs) objects from
[PlcfHdrtxbxTxt](#plcfhdrtxbxtxt).

### PlcftxbxTxt

The **PlcftxbxTxt** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) structure where the
data elements are [**FTXBXS**](#ftxbxs) structures (22 bytes each).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aFTXBXS (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are positions in
the [textboxes document](#Section_f87b35602c234d109751ff141d307308).

Each CP specifies the beginning of a range of text to appear in a
textbox indicated by the corresponding FTXBXS structure. The range of
text ends immediately prior to the next CP. The last CP does not begin a
new text range. It only terminates the previous one.

A **PlcftxbxTxt** MUST NOT contain duplicate CPs. The text ranges for
each FTXBXS structure are separated by 0x0D characters that MUST be the
last character in each range. The last text range is an exception. The
text in the last range is ignored, and the 0x0D character is not
required.

**aFTXBXS (variable):** An array of FTXBXS structures (22-bytes each)
that associates the text ranges with shape objects.

### Plcfuim

A **Plcfuim** structure is a
[**PLC**](#Section_a649fcc578684245be1204eea89d916b) whose data elements
are [**UIM**](#uim)s (20 bytes each), with the exception that the
elements are not sorted according to their
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aUIM (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs. CPs are positions in the set of all
[document parts](#Section_5f0c432987184d678cc760d8968c5127). CPs are
relative to the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e) but can extend into
any of the document parts. Each CP in the **Plcfuim**, except the last
one, represents the starting position of a range of text specified in
the corresponding UIM. The last CP is undefined and MUST be ignored.
Duplicate CPs are valid in a **Plcfuim**.

**aUIM (variable):** An array of UIMs.

### PlcfWKB

The **PlcfWKB** is a [PLC](#Section_a649fcc578684245be1204eea89d916b)
whose data elements are [WKB](#wkb) structures (12 bytes each). Each
[**subdocument**](#gt_30c0248a-accc-4ae5-b3b7-9c3c97f94d73) is assigned
one **WKB** structure.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aWKB (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. CPs are relative to
the start of the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e). Each CP in the
**PlcfWKB**, except the last, specifies the location in the main
document where a subdocument begins. The CPs, except for the last, MUST
be unique, greater than or equal to zero, and less than
[**FibBase**](#fibbase).**ccpText**. The last CP MUST be
**FibBase**.**ccpText** incremented by 2.

**aWKB (variable):** An array of WKBs. Each WKB contains information
about a subdocument.

### PlcPcd

The **PlcPcd** structure is a
[PLC](#Section_a649fcc578684245be1204eea89d916b) whose data elements are
[Pcd](#pcd)s (8 bytes each). A **PlcPcd** MUST NOT contain duplicate
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aPcd (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable):** An array of CPs that specifies the starting points
of text ranges. The end of each range is the beginning of the next
range. All CPs MUST be greater than or equal to zero. If any of the
fields **ccpFtn**, **ccpHdd**, **ccpAtn**, **ccpEdn**, **ccpTxbx**, or
**ccpHdrTxbx** from [FibRgLw97](#fibrglw97) are nonzero, then the last
CP MUST be equal to the sum of those fields plus **ccpText**+1.
Otherwise, the last CP MUST be equal to **ccpText**.

**aPcd (variable):** An array of Pcds (8 bytes each) that specify the
location of text in the [WordDocument
stream](#Section_d7fae142670d4cd5869a708366984a71) and any additional
properties of the text. If **aPcd\[***i***\].fc.fCompressed** is 1, then
the byte offset of the last character of the text referenced by
**aPcd\[***i***\]** is given by the following.

<embed src="media/media/image10.bin"
title="Byte offset of last character if APCD I dot fc dot fcompressed is 1."
style="width:3.35417in;height:0.63542in" />

Otherwise, the byte offset of the last character of the text referenced
by **aPcd\[***i***\]** is given by the following.

<embed src="media/media/image11.bin"
title="Byte offset of last character if APCD I dot fc dot fcompressed is not 1."
style="width:3.46875in;height:0.39583in" />

Because **aCP** MUST be sorted in ascending order and MUST NOT contain
duplicate CPs, (**aCP**\[*i*+1\]-**aCP**\[*i*\])\>0, for all valid
indexes *i* of **aPcd**. Because a PLC MUST contain one more CP than a
data element, *i*+1 is a valid index of **aCP** if *i* is a valid index
of **aPcd**.
