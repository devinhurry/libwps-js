# Structures

## The File Information Block

### Fib

The **Fib** structure contains information about the document and
specifies the file pointers to various portions that make up the
document.

The **Fib** is a variable length structure. With the exception of the
base portion which is fixed in size, every section is preceded with a
count field that specifies the size of the next section.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| base (32 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| csw |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | fibRgW (28 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cslw |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fibRgLw (88 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cbRgFcLcb |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | fibRgFcLcbBlob (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cswNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | fibRgCswNew (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**base (32 bytes):** The [**FibBase**](#fibbase).

**csw (2 bytes):** An unsigned integer that specifies the count of
16-bit values corresponding to **fibRgW** that follow. MUST be 0x000E.

**fibRgW (28 bytes):** The [**FibRgW97**](#fibrgw97).

**cslw (2 bytes):** An unsigned integer that specifies the count of
32-bit values corresponding to **fibRgLw** that follow. MUST be 0x0016.

**fibRgLw (88 bytes):** The [**FibRgLw97**](#fibrglw97).

**cbRgFcLcb (2 bytes):** An unsigned integer that specifies the count of
64-bit values corresponding to **fibRgFcLcbBlob** that follow. This MUST
be one of the following values, depending on the value of
[**nFib**](#Section_fe6610529c884ae1aec444799b2b4777).

| Value of nFib | cbRgFcLcb |
|---------------|-----------|
| 0x00C1        | 0x005D    |
| 0x00D9        | 0x006C    |
| 0x0101        | 0x0088    |
| 0x010C        | 0x00A4    |
| 0x0112        | 0x00B7    |

**fibRgFcLcbBlob (variable):** The [**FibRgFcLcb**](#fibrgfclcb).

**cswNew (2 bytes):** An unsigned integer that specifies the count of
16-bit values corresponding to **fibRgCswNew** that follow. This MUST be
one of the following values, depending on the value of **nFib**.

| Value of nFib | cswNew |
|---------------|--------|
| 0x00C1        | 0      |
| 0x00D9        | 0x0002 |
| 0x0101        | 0x0002 |
| 0x010C        | 0x0002 |
| 0x0112        | 0x0005 |

**fibRgCswNew (variable):** Optional. If **cswNew** is nonzero, this is
[**fibRgCswNew**](#fibrgcswnew). Otherwise, it is not present in the
file.

### FibBase

The **FibBase** structure is the fixed-size portion of the [Fib](#fib).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| wIdent |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | nFib |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| unused |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | lid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pnNext |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | A | B | C | D | E |  |  |  | F | G | H | I | J | K | L | M |
| nFibBack |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | lKey |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | envr |  |  |  |  |  |  |  | N | O | P | Q | R | S |  |  |
| reserved3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**wIdent (2 bytes):** An unsigned integer that specifies that this is a
Word Binary File. This value MUST be 0xA5EC.

**nFib (2 bytes):** An unsigned integer that specifies the version
number of the file format used. Superseded by
[**FibRgCswNew**](#fibrgcswnew).**nFibNew** if it is present. This value
SHOULD<span id="Appendix_A_Target_11"
class="anchor"></span>[\<11\>](#Appendix_A_11) be 0x00C1.

**unused (2 bytes):** This value is undefined and MUST be ignored.

**lid (2 bytes):** A [**LID**](#lid) that specifies the install language
of the application that is producing the document. If
[nFib](#Section_fe6610529c884ae1aec444799b2b4777) is 0x00D9 or greater,
then any East Asian install lid or any install lid with a base language
of Spanish, German or French MUST be recorded as 0x0409. If the nFib is
0x0101 or greater, then any install lid with a base language of
Vietnamese, Thai, or Hindi MUST be recorded as 0x0409.

**pnNext (2 bytes):** An unsigned integer that specifies the offset in
the [WordDocument stream](#Section_d7fae142670d4cd5869a708366984a71) of
the **FIB** for the document which contains all the
[**AutoText**](#gt_90dc5ce2-c9bd-43be-8104-935d905c2a7a) items. If this
value is 0, there are no AutoText items attached. Otherwise the **FIB**
is found at file location **pnNext**×512. If **fGlsy** is 1 or **fDot**
is 0, this value MUST be 0. If **pnNext** is not 0, each **FIB** MUST
share the same values for
[**FibRgFcLcb97**](#fibrgfclcb97).**fcPlcfBteChpx,
FibRgFcLcb97**.**lcbPlcfBteChpx, FibRgFcLcb97.fcPlcfBtePapx,
FibRgFcLcb97.lcbPlcfBtePapx,** and
[**FibRgLw97**](#fibrglw97).**cbMac**.

**A - fDot (1 bit):** Specifies whether this is a [**document
template**](#gt_20e70600-75a3-424c-b1ae-ce3b9f6047ff).

**B - fGlsy (1 bit):** Specifies whether this is a document that
contains only AutoText items (see **FibRgFcLcb97**.**fcSttbfGlsy**,
**FibRgFcLcb97**.**fcPlcfGlsy** and
**FibRgFcLcb97**.**fcSttbGlsyStyle**).

**C - fComplex (1 bit):** Specifies that the last save operation that
was performed on this document was an [**incremental
save**](#gt_1aa4deeb-8e50-4699-8e40-2c0719250cbb) operation.

**D - fHasPic (1 bit):** When set to 0, there
SHOULD<span id="Appendix_A_Target_12"
class="anchor"></span>[\<12\>](#Appendix_A_12) be no pictures in the
document.

**E - cQuickSaves (4 bits):** An unsigned integer. If nFib is less than
0x00D9, then **cQuickSaves** specifies the number of consecutive times
this document was incrementally saved. If nFib is 0x00D9 or greater,
then **cQuickSaves** MUST be 0xF.

**F - fEncrypted (1 bit):** Specifies whether the document is encrypted
or obfuscated as specified in [Encryption and
Obfuscation](#Section_376393976451427b9cf201d56e927f25).

**G - fWhichTblStm (1 bit):** Specifies the [Table
stream](#Section_44f62054d9114989946ca42100c26a15) to which the **FIB**
refers. When this value is set to 1, use 1Table; when this value is set
to 0, use 0Table.

**H - fReadOnlyRecommended (1 bit):** Specifies whether the document
author recommended that the document be opened in read-only mode.

**I - fWriteReservation (1 bit):** Specifies whether the document has a
[**write-reservation
password**](#gt_eb7d2c26-ca89-46e7-b552-f341f18076c9).

**J - fExtChar (1 bit):** This value MUST be 1.

**K - fLoadOverride (1 bit):** Specifies whether to override the
language information and font that are specified in the paragraph style
at [**istd**](#Section_9258b41cff0a4c96a3a9610664dabbeb) 0 (the normal
style) with the defaults that are appropriate for the installation
language of the application.

**L - fFarEast (1 bit):** Specifies whether the installation language of
the application that created the document was an [**East Asian
language**](#gt_12f63b8b-1c85-4855-9ae1-e6b05720bcfc).

**M - fObfuscated (1 bit):** If **fEncrypted** is 1, this bit specifies
whether the document is obfuscated by using XOR obfuscation (section
[2.2.6.1](#Section_79dea1e94dce4fa08c6b56ba37b68351)); otherwise, this
bit MUST be ignored.

**nFibBack (2 bytes):** This value SHOULD<span id="Appendix_A_Target_13"
class="anchor"></span>[\<13\>](#Appendix_A_13) be 0x00BF. This value
MUST be 0x00BF or 0x00C1.

**lKey (4 bytes):** If **fEncrypted** is 1 and **fObfuscated** is 1,
this value specifies the XOR obfuscation (section 2.2.6.1) password
verifier. If **fEncrypted** is 1 and **fObfuscated** is 0, this value
specifies the size of the **EncryptionHeader** that is stored at the
beginning of the Table stream as described in Encryption and
Obfuscation. Otherwise, this value MUST be 0.

**envr (1 byte):** This value MUST be 0, and MUST be ignored.

**N - fMac (1 bit):** This value MUST be 0, and MUST be ignored.

**O - fEmptySpecial (1 bit):** This value
SHOULD<span id="Appendix_A_Target_14"
class="anchor"></span>[\<14\>](#Appendix_A_14) be 0 and
SHOULD<span id="Appendix_A_Target_15"
class="anchor"></span>[\<15\>](#Appendix_A_15) be ignored.

**P - fLoadOverridePage (1 bit):** Specifies whether to override the
section properties for page size, orientation, and margins with the
defaults that are appropriate for the installation language of the
application.

**Q - reserved1 (1 bit):** This value is undefined and MUST be ignored.

**R - reserved2 (1 bit):** This value is undefined and MUST be ignored.

**S - fSpare0 (3 bits):** This value is undefined and MUST be ignored.

**reserved3 (2 bytes):** This value MUST be 0 and MUST be ignored.

**reserved4 (2 bytes):** This value MUST be 0 and MUST be ignored.

**reserved5 (4 bytes):** This value is undefined and MUST be ignored.

**reserved6 (4 bytes):** This value is undefined and MUST be ignored.

### FibRgW97

The **FibRgW97** structure is a variable-length portion of the
[Fib](#fib).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reserved1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved8 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved9 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved11 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | reserved12 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved13 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | lidFE |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**reserved1 (2 bytes):** This value is undefined and MUST be ignored.

**reserved2 (2 bytes):** This value is undefined and MUST be ignored.

**reserved3 (2 bytes):** This value is undefined and MUST be ignored.

**reserved4 (2 bytes):** This value is undefined and MUST be ignored.

**reserved5 (2 bytes):** This value
SHOULD<span id="Appendix_A_Target_16"
class="anchor"></span>[\<16\>](#Appendix_A_16) be zero, and MUST be
ignored.

**reserved6 (2 bytes):** This value SHOULD[\<17\>](#Appendix_A_17) be
zero, and MUST be ignored.

**reserved7 (2 bytes):** This value
SHOULD<span id="Appendix_A_Target_18"
class="anchor"></span>[\<18\>](#Appendix_A_18) be zero, and MUST be
ignored.

**reserved8 (2 bytes):** This value
SHOULD<span id="Appendix_A_Target_19"
class="anchor"></span>[\<19\>](#Appendix_A_19) be zero, and MUST be
ignored.

**reserved9 (2 bytes):** This value
SHOULD<span id="Appendix_A_Target_20"
class="anchor"></span>[\<20\>](#Appendix_A_20) be zero, and MUST be
ignored.

**reserved10 (2 bytes):** This value
SHOULD<span id="Appendix_A_Target_21"
class="anchor"></span>[\<21\>](#Appendix_A_21) be zero, and MUST be
ignored.

**reserved11 (2 bytes):** This value
SHOULD<span id="Appendix_A_Target_22"
class="anchor"></span>[\<22\>](#Appendix_A_22) be zero, and MUST be
ignored.

**reserved12 (2 bytes):** This value SHOULD[\<23\>](#Appendix_A_23) be
zero, and MUST be ignored.

**reserved13 (2 bytes):** This value
SHOULD<span id="Appendix_A_Target_24"
class="anchor"></span>[\<24\>](#Appendix_A_24) be zero, and MUST be
ignored.

**lidFE (2 bytes):** A [**LID**](#lid) whose meaning depends on the
[**nFib**](#Section_fe6610529c884ae1aec444799b2b4777) value, which is
one of the following.


| nFib value | Meaning |
| --- | --- |
| 0x00C1 | If FibBase . fFarEast is "true", this is the LID of the stored style names. Otherwise it MUST be ignored. |
| 0x00D9 / 0x0101 / 0x010C / 0x0112 | The LID of the stored style names ( STD . xstzName ) |



### FibRgLw97

The **FibRgLw97** structure is the third section of the **FIB**. This
contains an array of 4-byte values.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cbMac |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ccpText |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ccpFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ccpHdd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ccpAtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ccpEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ccpTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ccpHdrTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved8 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved9 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved11 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved12 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved13 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reserved14 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**cbMac (4 bytes):** Specifies the count of bytes of those written to
the [WordDocument stream](#Section_d7fae142670d4cd5869a708366984a71) of
the file that have any meaning. All bytes in the WordDocument stream at
offset **cbMac** and greater MUST be ignored.

**reserved1 (4 bytes):** This value is undefined and MUST be ignored.

**reserved2 (4 bytes):** This value is undefined and MUST be ignored.

**ccpText (4 bytes):** A signed integer that specifies the count of
[CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s in the [main
document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e). This value MUST be
0, 1, or greater.

**ccpFtn (4 bytes):** A signed integer that specifies the count of CPs
in the [footnote
subdocument](#Section_f7e96a05aad74acba06dbfa430ac1fcc). This value MUST
be 0, 1, or greater.

**ccpHdd (4 bytes):** A signed integer that specifies the count of CPs
in the [header subdocument](#Section_8465bee76c7945a9812e58b0c5fd6cdc).
This value MUST be 0, 1, or greater.

**reserved3 (4 bytes):** This value MUST be 0 and MUST be ignored.

**ccpAtn (4 bytes):** A signed integer that specifies the count of CPs
in the [comment subdocument](#Section_486f5a89fba5412f8ac61c551654ddcd).
This value MUST be 0, 1, or greater.

**ccpEdn (4 bytes):** A signed integer that specifies the count of CPs
in the [endnote subdocument](#Section_13659f756a694a5f8e035f9bced90faa).
This value MUST be 0, 1, or greater.

**ccpTxbx (4 bytes):** A signed integer that specifies the count of CPs
in the [textbox subdocument of the main
document](#Section_f87b35602c234d109751ff141d307308). This value MUST be
0, 1, or greater.

**ccpHdrTxbx (4 bytes):** A signed integer that specifies the count of
CPs in the [textbox subdocument of the
header](#Section_7392319674e14e6988b8d2cc9ac8093b). This value MUST be
0, 1, or greater.

**reserved4 (4 bytes):** This value is undefined and MUST be ignored.

**reserved5 (4 bytes):** This value is undefined and MUST be ignored.

**reserved6 (4 bytes):** This value MUST be equal or less than the
number of data elements in [**PlcBteChpx**](#plcbtechpx), as specified
by [**FibRgFcLcb97**](#fibrgfclcb97).**fcPlcfBteChpx** and
**FibRgFcLcb97**.**lcbPlcfBteChpx**. This value MUST be ignored.

**reserved7 (4 bytes):** This value is undefined and MUST be ignored

**reserved8 (4 bytes):** This value is undefined and MUST be ignored

**reserved9 (4 bytes):** This value MUST be less than or equal to the
number of data elements in [**PlcBtePapx**](#plcbtepapx), as specified
by **FibRgFcLcb97**.**fcPlcfBtePapx** and
**FibRgFcLcb97**.**lcbPlcfBtePapx**. This value MUST be ignored.

**reserved10 (4 bytes):** This value is undefined and MUST be ignored.

**reserved11 (4 bytes):** This value is undefined and MUST be ignored.

**reserved12 (4 bytes):** This value
SHOULD<span id="Appendix_A_Target_25"
class="anchor"></span>[<sup>\<25\></sup>](#Appendix_A_25) be zero, and
MUST be ignored.

**reserved13 (4 bytes):** This value MUST be 0 and MUST be ignored.

**reserved14 (4 bytes):** This value MUST be 0 and MUST be ignored.

### FibRgFcLcb

The **FibRgFcLcb** structure specifies the file offsets and byte counts
for various portions of the data in the document. The structure of
**FibRgFcLcb** depends on the value of
[**nFib**](#Section_fe6610529c884ae1aec444799b2b4777), which is one of
the following.

| Value  | Meaning                           |
|--------|-----------------------------------|
| 0x00C1 | [fibRgFcLcb97](#fibrgfclcb97)     |
| 0x00D9 | [fibRgFcLcb2000](#fibrgfclcb2000) |
| 0x0101 | [fibRgFcLcb2002](#fibrgfclcb2002) |
| 0x010C | [fibRgFcLcb2003](#fibrgfclcb2003) |
| 0x0112 | [fibRgFcLcb2007](#fibrgfclcb2007) |

### FibRgFcLcb97

The **FibRgFcLcb97** structure is a variable-length portion of the
[Fib](#fib).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fcStshfOrig |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbStshfOrig |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcStshf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbStshf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcffndRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcffndRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcffndTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcffndTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfandRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfandRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfandTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfandTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfSed |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfSed |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcPad |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcPad |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfPhe |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfPhe |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfGlsy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfGlsy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfGlsy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfGlsy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfHdd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfHdd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBteChpx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBteChpx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBtePapx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBtePapx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfSea |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfSea |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfFfn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfFfn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfFldMom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfFldMom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfFldHdr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfFldHdr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfFldFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfFldFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfFldAtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfFldAtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfFldMcr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfFldMcr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmk |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmk |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcCmds |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbCmds |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfMcr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfMcr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPrDrvr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPrDrvr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPrEnvPort |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPrEnvPort |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPrEnvLand |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPrEnvLand |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcWss |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbWss |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcDop |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbDop |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfAssoc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfAssoc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcClx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbClx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfPgdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfPgdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcAutosaveSource |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbAutosaveSource |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcGrpXstAtnOwners |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbGrpXstAtnOwners |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfAtnBkmk |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfAtnBkmk |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcSpaMom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcSpaMom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcSpaHdr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcSpaHdr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfAtnBkf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfAtnBkf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfAtnBkl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfAtnBkl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPms |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPms |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcFormFldSttbs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbFormFldSttbs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfendRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfendRef |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfendTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfendTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfFldEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfFldEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcDggInfo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbDggInfo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfRMark |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfRMark |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfCaption |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfCaption |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfAutoCaption |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfAutoCaption |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfWkb |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfWkb |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfSpl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfSpl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcftxbxTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcftxbxTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfFldTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfFldTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfHdrtxbxTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfHdrtxbxTxt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcffldHdrTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcffldHdrTxbx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcStwUser |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbStwUser |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbTtmbd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbTtmbd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcCookieData |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbCookieData |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdMotherOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdMotherOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdMotherOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdMotherOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdFtnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdFtnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdFtnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdFtnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdEdnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdEdnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdEdnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdEdnOldOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfIntlFld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfIntlFld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcRouteSlip |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbRouteSlip |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbSavedBy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbSavedBy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbFnm |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbFnm |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlfLst |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlfLst |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlfLfo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlfLfo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfTxbxBkd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfTxbxBkd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfTxbxHdrBkd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfTxbxHdrBkd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcDocUndoWord9 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbDocUndoWord9 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcRgbUse |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbRgbUse |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUsp |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUsp |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUskf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUskf |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcupcRgbUse |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcupcRgbUse |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcupcUsp |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcupcUsp |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbGlsyStyle |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbGlsyStyle |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlgosl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlgosl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcocx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcocx |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBteLvc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBteLvc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dwLowDateTime |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| dwHighDateTime |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfLvcPre10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfLvcPre10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfAsumy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfAsumy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfGram |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfGram |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbListNames |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbListNames |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfUssr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfUssr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**fcStshfOrig (4 bytes):** This value is undefined and MUST be ignored.

**lcbStshfOrig (4 bytes):** This value is undefined and MUST be ignored.

**fcStshf (4 bytes):** An unsigned integer that specifies an offset in
the [Table Stream](#Section_44f62054d9114989946ca42100c26a15). An
[**STSH**](#stsh) that specifies the style sheet for this document
begins at this offset.

**lcbStshf (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **STSH** that begins at offset **fcStshf** in the Table
Stream. This MUST be a nonzero value.

**fcPlcffndRef (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcffndRef**](#plcffndref) begins at this
offset and specifies the locations of footnote references in the [Main
Document](#Section_f426d9a2004d418e8d8ce7fd88e7c48e), and whether those
references use auto-numbering or custom symbols. If **lcbPlcffndRef** is
zero, **fcPlcffndRef** is undefined and MUST be ignored.

**lcbPlcffndRef (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcffndRef** that begins at offset
**fcPlcffndRef** in the Table Stream.

**fcPlcffndTxt (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcffndTxt**](#plcffndtxt) begins at this
offset and specifies the locations of each block of footnote text in the
[Footnote Document](#Section_f7e96a05aad74acba06dbfa430ac1fcc). If
**lcbPlcffndTxt** is zero, **fcPlcffndTxt** is undefined and MUST be
ignored.

**lcbPlcffndTxt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcffndTxt** that begins at offset
**fcPlcffndTxt** in the Table Stream.

**lcbPlcffndTxt** MUST be zero if **[FibRgLw97](#fibrglw97).ccpFtn** is
zero, and MUST be nonzero if **FibRgLw97.ccpFtn** is nonzero.

**fcPlcfandRef (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcfandRef**](#plcfandref) begins at this
offset and specifies the dates, user initials, and locations of comments
in the Main Document. If **lcbPlcfandRef** is zero, **fcPlcfandRef** is
undefined and MUST be ignored.

**lcbPlcfandRef (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfandRef** at offset **fcPlcfandRef** in the
Table Stream.

**fcPlcfandTxt (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcfandTxt**](#plcfandtxt) begins at this
offset and specifies the locations of comment text ranges in the
[Comment Document](#Section_486f5a89fba5412f8ac61c551654ddcd). If
**lcbPlcfandTxt** is zero, **fcPlcfandTxt** is undefined, and MUST be
ignored.

**lcbPlcfandTxt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfandTxt** at offset **fcPlcfandTxt** in the
Table Stream.

**lcbPlcfandTxt** MUST be zero if **FibRgLw97.ccpAtn** is zero, and MUST
be nonzero if **FibRgLw97.ccpAtn** is nonzero.

**fcPlcfSed (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**PlcfSed**](#plcfsed) begins at this offset and
specifies the locations of property lists for each section in the Main
Document. If **lcbPlcfSed** is zero, **fcPlcfSed** is undefined and MUST
be ignored.

**lcbPlcfSed (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PlcfSed** that begins at offset **fcPlcfSed** in the
Table Stream.

**fcPlcPad (4 bytes):** This value is undefined and MUST be ignored.

**lcbPlcPad (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcPlcfPhe (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**Plc**](#Section_a649fcc578684245be1204eea89d916b)
begins at this offset and specifies version-specific information about
paragraph height. This **Plc** SHOULD NOT<span id="Appendix_A_Target_26"
class="anchor"></span>[\<26\>](#Appendix_A_26) be emitted and
SHOULD<span id="Appendix_A_Target_27"
class="anchor"></span>[\<27\>](#Appendix_A_27) be ignored.

**lcbPlcfPhe (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plc** at offset **fcPlcfPhe** in the Table Stream.

**fcSttbfGlsy (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**SttbfGlsy**](#sttbfglsy) that contains
information about the
[**AutoText**](#gt_90dc5ce2-c9bd-43be-8104-935d905c2a7a) items that are
defined in this document begins at this offset.

**lcbSttbfGlsy (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **SttbfGlsy** at offset **fcSttbfGlsy** in the Table
Stream. If **base.fGlsy** of the **Fib** that contains this
**FibRgFcLcb97** is zero, this value MUST be 0.

**fcPlcfGlsy (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcfGlsy**](#plcfglsy) that contains
information about the AutoText items that are defined in this document
begins at this offset.

**lcbPlcfGlsy (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PlcfGlsy** at offset **fcPlcfGlsy** in the Table
Stream. If **base.fGlsy** of the **Fib** that contains this
**FibRgFcLcb97** is zero, this value MUST be 0.

**fcPlcfHdd (4 bytes):** An unsigned integer that specifies the offset
in the Table Stream where a [**Plcfhdd**](#plcfhdd) begins. The
**Plcfhdd** specifies the locations of each block of header/footer text
in the [WordDocument Stream](#Section_d7fae142670d4cd5869a708366984a71).
If **lcbPlcfHdd** is 0, **fcPlcfHdd** is undefined and MUST be ignored.

**lcbPlcfHdd (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plcfhdd** at offset **fcPlcfHdd** in the Table
Stream. If there is no **Plcfhdd**, this value MUST be 0. A **Plcfhdd**
MUST exist if **FibRgLw97**.**ccpHdd** indicates that there are
characters in the [Header
Document](#Section_8465bee76c7945a9812e58b0c5fd6cdc) (that is, if
**FibRgLw97**.**ccpHdd** is greater than 0). Otherwise, the **Plcfhdd**
MUST NOT exist.

**fcPlcfBteChpx (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**PlcBteChpx**](#plcbtechpx) begins at
the offset. **fcPlcfBteChpx** MUST be greater than zero, and MUST be a
valid offset in the Table Stream.

**lcbPlcfBteChpx (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcBteChpx** at offset **fcPlcfBteChpx** in the
Table Stream. **lcbPlcfBteChpx** MUST be greater than zero.

**fcPlcfBtePapx (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**PlcBtePapx**](#plcbtepapx) begins at
the offset. **fcPlcfBtePapx** MUST be greater than zero, and MUST be a
valid offset in the Table Stream.

**lcbPlcfBtePapx (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcBtePapx** at offset **fcPlcfBtePapx** in the
Table Stream. **lcbPlcfBteChpx** MUST be greater than zero.

**fcPlcfSea (4 bytes):** This value is undefined and MUST be ignored.

**lcbPlcfSea (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcSttbfFfn (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. An [**SttbfFfn**](#sttbfffn) begins at this offset.
This table specifies the fonts that are used in the document. If
**lcbSttbfFfn** is 0, **fcSttbfFfn** is undefined and MUST be ignored.

**lcbSttbfFfn (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **SttbfFfn** at offset **fcSttbfFfn** in the Table
Stream.

**fcPlcfFldMom (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**Plcfld**](#plcfld) begins at this offset and
specifies the locations of field characters in the Main Document. All
CPs in this **Plcfld** MUST be greater than or equal to 0 and less than
or equal to **FibRgLw97.ccpText**. If **lcbPlcfFldMom** is zero,
**fcPlcfFldMom** is undefined and MUST be ignored.

**lcbPlcfFldMom (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfld** at offset **fcPlcfFldMom** in the
Table Stream.

**fcPlcfFldHdr (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfld** begins at this offset and specifies
the locations of field characters in the Header Document. All CPs in
this **Plcfld** are relative to the starting position of the Header
Document. All CPs in this **Plcfld** MUST be greater than or equal to
zero and less than or equal to **FibRgLw97**.**ccpHdd**. If
**lcbPlcfFldHdr** is zero, **fcPlcfFldHdr** is undefined and MUST be
ignored.

**lcbPlcfFldHdr (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfld** at offset **fcPlcfFldHdr** in the
Table Stream.

**fcPlcfFldFtn (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfld** begins at this offset and specifies
the locations of field characters in the Footnote Document. All CPs in
this **Plcfld** are relative to the starting position of the Footnote
Document. All CPs in this **Plcfld** MUST be greater than or equal to
zero and less than or equal to **FibRgLw97.ccpFtn**. If
**lcbPlcfFldFtn** is zero, **fcPlcfFldFtn** is undefined, and MUST be
ignored.

**lcbPlcfFldFtn (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfld** at offset **fcPlcfFldFtn** in the
Table Stream.

**fcPlcfFldAtn (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfld** begins at this offset and specifies
the locations of field characters in the Comment Document. All CPs in
this **Plcfld** are relative to the starting position of the Comment
Document. All CPs in this **Plcfld** MUST be greater than or equal to
zero and less than or equal to **FibRgLw97.ccpAtn**. If
**lcbPlcfFldAtn** is zero, **fcPlcfFldAtn** is undefined and MUST be
ignored.

**lcbPlcfFldAtn (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfld** at offset **fcPlcfFldAtn** in the
Table Stream.

**fcPlcfFldMcr (4 bytes):** This value is undefined and MUST be ignored.

**lcbPlcfFldMcr (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcSttbfBkmk (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. An [**SttbfBkmk**](#sttbfbkmk) that contains the
names of the [**bookmarks**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c)
in the document begins at this offset. If **lcbSttbfBkmk** is zero,
**fcSttbfBkmk** is undefined and MUST be ignored.

This **SttbfBkmk** is parallel to the [**Plcfbkf**](#plcfbkf) at offset
**fcPlcfBkf** in the Table Stream. Each string specifies the name of the
bookmark that is associated with the data element which is located at
the same offset in that **Plcfbkf**. For this reason, the **SttbfBkmk**
that begins at offset **fcSttbfBkmk**, and the **Plcfbkf** that begins
at offset **fcPlcfBkf**, MUST contain the same number of elements.

**lcbSttbfBkmk (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **SttbfBkmk** at offset **fcSttbfBkmk**.

**fcPlcfBkf (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A **Plcfbkf** that contains information about the
standard bookmarks in the document begins at this offset. If
**lcbPlcfBkf** is zero, **fcPlcfBkf** is undefined and MUST be ignored.

Each data element in the **Plcfbkf** is associated, in a one-to-one
correlation, with a data element in the [**Plcfbkl**](#plcfbkl) at
offset **fcPlcfBkl**. For this reason, the **Plcfbkf** that begins at
offset **fcPlcfBkf**, and the Plcfbkl that begins at offset
**fcPlcfBkl**, MUST contain the same number of data elements. This
**Plcfbkf** is parallel to the **SttbfBkmk** at offset **fcSttbfBkmk**
in the Table Stream. Each data element in the **Plcfbkf** specifies
information about the bookmark that is associated with the element which
is located at the same offset in that **SttbfBkmk**. For this reason,
the **Plcfbkf** that begins at offset **fcPlcfBkf**, and the
**SttbfBkmk** that begins at offset **fcSttbfBkmk**, MUST contain the
same number of elements.

The largest value that a [CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)
marking the start or end of a standard bookmark is allowed to have is
the CP representing the end of all [document
parts](#Section_5f0c432987184d678cc760d8968c5127).

**lcbPlcfBkf (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plcfbkf** at offset **fcPlcfBkf**.

**fcPlcfBkl (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A **Plcfbkl** that contains information about the
standard bookmarks in the document begins at this offset. If
**lcbPlcfBkl** is zero, **fcPlcfBkl** is undefined and MUST be ignored.

Each data element in the **Plcfbkl** is associated, in a one-to-one
correlation, with a data element in the **Plcfbkf** at offset
**fcPlcfBkf**. For this reason, the **Plcfbkl** that begins at offset
**fcPlcfBkl**, and the **Plcfbkf** that begins at offset **fcPlcfBkf**,
MUST contain the same number of data elements.

The largest value that a CP marking the start or end of a standard
bookmark is allowed to have is the value of the CP representing the end
of all document parts.

**lcbPlcfBkl (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plcfbkl** at offset **fcPlcfBkl**.

**fcCmds (4 bytes):** An unsigned integer that specifies the offset in
the Table Stream of a [**Tcg**](#tcg) that specifies command-related
customizations. If **lcbCmds** is zero, **fcCmds** is undefined and MUST
be ignored.

**lcbCmds (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **Tcg** at offset **fcCmds**.

**fcUnused1 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused1 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcSttbfMcr (4 bytes):** This value is undefined and MUST be ignored.

**lcbSttbfMcr (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcPrDrvr (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. The [**PrDrvr**](#prdrvr), which contains printer
driver information (the names of drivers, port, and so on), begins at
this offset. If **lcbPrDrvr** is zero, **fcPrDrvr** is undefined and
MUST be ignored.

**lcbPrDrvr (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **PrDrvr** at offset **fcPrDrvr**.

**fcPrEnvPort (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. The [**PrEnvPort**](#prenvport) that is the print
environment in portrait mode begins at this offset. If **lcbPrEnvPort**
is zero, **fcPrEnvPort** is undefined and MUST be ignored.

**lcbPrEnvPort (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PrEnvPort** at offset **fcPrEnvPort**.

**fcPrEnvLand (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. The [**PrEnvLand**](#prenvland) that is the print
environment in landscape mode begins at this offset. If **lcbPrEnvLand**
is zero, **fcPrEnvLand** is undefined and MUST be ignored.

**lcbPrEnvLand (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PrEnvLand** at offset **fcPrEnvLand**.

**fcWss (4 bytes):** An unsigned integer that specifies an offset in the
Table Stream. A [**Selsf**](#selsf) begins at this offset and specifies
the last selection that was made in the Main Document. If **lcbWss** is
zero, **fcWss** is undefined and MUST be ignored.

**lcbWss (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **Selsf** at offset **fcWss**.

**fcDop (4 bytes):** An unsigned integer that specifies an offset in the
Table Stream. A [**Dop**](#dop) begins at this offset.

**lcbDop (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **Dop** at **fcDop**. This value MUST NOT be zero.

**fcSttbfAssoc (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. An [**SttbfAssoc**](#sttbfassoc) that contains
strings that are associated with the document begins at this offset.

**lcbSttbfAssoc (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbfAssoc** at offset **fcSttbfAssoc**. This
value MUST NOT be zero.

**fcClx (4 bytes):** An unsigned integer that specifies an offset in the
Table Stream. A [**Clx**](#clx) begins at this offset.

**lcbClx (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **Clx** at offset **fcClx** in the Table Stream. This
value MUST be greater than zero.

**fcPlcfPgdFtn (4 bytes):** This value is undefined and MUST be ignored.

**lcbPlcfPgdFtn (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcAutosaveSource (4 bytes):** This value is undefined and MUST be
ignored.

**lcbAutosaveSource (4 bytes):** This value MUST be 0 and MUST be
ignored.

**fcGrpXstAtnOwners (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An array of [XST](#xst)s begins at this
offset. The value of **cch** for all XSTs in this array MUST be less
than 56. The number of entries in this array is limited to 0x7FFF. This
array contains the names of authors of comments in the document. The
names in this array MUST be unique. If no comments are defined,
**lcbGrpXstAtnOwners** and **fcGrpXstAtnOwners** MUST be zero and MUST
be ignored. If any comments are in the document, **fcGrpXstAtnOwners**
MUST point to a valid array of XSTs.

**lcbGrpXstAtnOwners (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the XST array at offset **fcGrpXstAtnOwners** in the
Table Stream.

**fcSttbfAtnBkmk (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An [SttbfAtnBkmk](#sttbfatnbkmk) that
contains information about the [**annotation
bookmarks**](#gt_0a40ee6b-0144-44fd-b4de-d3f1aa29d008) in the document
begins at this offset. If **lcbSttbfAtnBkmk** is zero,
**fcSttbfAtnBkmk** is undefined and MUST be ignored.

The SttbfAtnBkmk is parallel to the Plcfbkf at offset **fcPlcfAtnBkf**
in the Table Stream. Each element in the SttbfAtnBkmk specifies
information about the bookmark which is associated with the data element
that is located at the same offset in that Plcfbkf, so the SttbfAtnBkmk
beginning at offset **fcSttbfAtnBkmk** and the Plcfbkf beginning at
offset **fcPlcfAtnBkf** MUST contain the same number of elements. An
additional constraint upon the number of elements in the SttbfAtnBkmk is
specified in the description of **fcPlcfAtnBkf**.

**lcbSttbfAtnBkmk (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the SttbfAtnBkmk at offset **fcSttbfAtnBkmk**.

**fcUnused2 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused2 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcUnused3 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused3 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcPlcSpaMom (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [PlcfSpa](#plcfspa) begins at this offset. The
PlcfSpa contains shape information for the Main Document. All CPs in
this PlcfSpa are relative to the starting position of the Main Document
and MUST be greater than or equal to zero and less than or equal to
**ccpText** in FibRgLw97. The final CP is undefined and MUST be ignored,
though it MUST be greater than the previous entry. If there are no
shapes in the Main Document, **lcbPlcSpaMom** and **fcPlcSpaMom** MUST
be zero and MUST be ignored. If there are shapes in the Main Document,
**fcPlcSpaMom** MUST point to a valid PlcfSpa structure.

**lcbPlcSpaMom (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the PlcfSpa at offset **fcPlcSpaMom**.

**fcPlcSpaHdr (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A PlcfSpa begins at this offset. The PlcfSpa
contains shape information for the Header Document. All CPs in this
PlcfSpa are relative to the starting position of the Header Document and
MUST be greater than or equal to zero and less than or equal to
**ccpHdd** in FibRgLw97. The final CP is undefined and MUST be ignored,
though this value MUST be greater than the previous entry. If there are
no shapes in the Header Document, **lcbPlcSpaHdr** and **fcPlcSpaHdr**
MUST both be zero and MUST be ignored. If there are shapes in the Header
Document, **fcPlcSpaHdr** MUST point to a valid PlcfSpa structure.

**lcbPlcSpaHdr (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the PlcfSpa at the offset **fcPlcSpaHdr**.

**fcPlcfAtnBkf (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfbkf** that contains information about
annotation bookmarks in the document begins at this offset. If
**lcbPlcfAtnBkf** is zero, **fcPlcfAtnBkf** is undefined and MUST be
ignored.

Each data element in the **Plcfbkf** is associated, in a one-to-one
correlation, with a data element in the **Plcfbkl** at offset
**fcPlcfAtnBkl**. For this reason, the **Plcfbkf** that begins at offset
**fcPlcfAtnBkf**, and the **Plcfbkl** that begins at offset
**fcPlcfAtnBkl**, MUST contain the same number of data elements. The
**Plcfbkf** is parallel to the **SttbfAtnBkmk** at offset
**fcSttbfAtnBkmk** in the Table Stream. Each data element in the
**Plcfbkf** specifies information about the bookmark which is associated
with the element that is located at the same offset in that
SttbfAtnBkmk. For this reason, the **Plcfbkf** that begins at offset
**fcPlcfAtnBkf**, and the SttbfAtnBkmk that begins at offset
**fcSttbfAtnBkmk**, MUST contain the same number of elements.

The CP range of an annotation bookmark MUST be in the Main Document
part.

**lcbPlcfAtnBkf (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfbkf** at offset **fcPlcfAtnBkf**.

**fcPlcfAtnBkl (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfbkl** that contains information about
annotation bookmarks in the document begins at this offset. If
**lcbPlcfAtnBkl** is zero, then **fcPlcfAtnBkl** is undefined and MUST
be ignored.

Each data element in the **Plcfbkl** is associated, in a one-to-one
correlation, with a data element in the **Plcfbkf** at offset
**fcPlcfAtnBkf**. For this reason, the **Plcfbkl** that begins at offset
**fcPlcfAtnBkl**, and the **Plcfbkf** that begins at offset
**fcPlcfAtnBkf**, MUST contain the same number of data elements.

The CP range of an annotation bookmark MUST be in the Main Document
part.

**lcbPlcfAtnBkl (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfbkl** at offset **fcPlcfAtnBkl**.

**fcPms (4 bytes):** An unsigned integer that specifies an offset in the
Table Stream. A [**Pms**](#pms), which contains the current state of a
print merge operation, begins at this offset. If **lcbPms** is zero,
**fcPms** is undefined and MUST be ignored.

**lcbPms (4 bytes):** An unsigned integer which specifies the size, in
bytes, of the **Pms** at offset **fcPms**.

**fcFormFldSttbs (4 bytes):** This value is undefined and MUST be
ignored.

**lcbFormFldSttbs (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcPlcfendRef (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcfendRef**](#plcfendref) that begins at this
offset specifies the locations of endnote references in the Main
Document and whether those references use auto-numbering or custom
symbols. If **lcbPlcfendRef** is zero, **fcPlcfendRef** is undefined and
MUST be ignored.

**lcbPlcfendRef (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfendRef** that begins at offset
**fcPlcfendRef** in the Table Stream.

**fcPlcfendTxt (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcfendTxt**](#plcfendtxt) begins at this
offset and specifies the locations of each block of endnote text in the
[Endnote Document](#Section_13659f756a694a5f8e035f9bced90faa). If
**lcbPlcfendTxt** is zero, **fcPlcfendTxt** is undefined and MUST be
ignored.

**lcbPlcfendTxt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfendTxt** that begins at offset
**fcPlcfendTxt** in the Table Stream.

**lcbPlcfendTxt** MUST be zero if **FibRgLw97.ccpEdn** is zero, and MUST
be nonzero if **FibRgLw97.ccpEdn** is nonzero.

**fcPlcfFldEdn (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfld** begins at this offset and specifies
the locations of field characters in the Endnote Document. All CPs in
this **Plcfld** are relative to the starting position of the Endnote
Document. All CPs in this **Plcfld** MUST be greater than or equal to
zero and less than or equal to **FibRgLw97.ccpEdn**. If
**lcbPlcfFldEdn** is zero, **fcPlcfFldEdn** is undefined and MUST be
ignored.

**lcbPlcfFldEdn (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfld** at offset **fcPlcfFldEdn** in the
Table Stream.

**fcUnused4 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused4 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcDggInfo (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. An [OfficeArtContent](#officeartcontent) that contains
information about the drawings in the document begins at this offset.

**lcbDggInfo (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the OfficeArtContent at the offset **fcDggInfo**. If
**lcbDggInfo** is zero, there MUST NOT be any drawings in the document.

**fcSttbfRMark (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. An [**SttbfRMark**](#sttbfrmark) that contains the
names of authors who have added revision marks or comments to the
document begins at this offset. If **lcbSttbfRMark** is zero,
**fcSttbfRMark** is undefined and MUST be ignored.

**lcbSttbfRMark (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbfRMark** at the offset **fcSttbfRMark**.

**fcSttbfCaption (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An [SttbfCaption](#sttbfcaption) that
contains information about the
[**captions**](#gt_81d81412-1575-4084-ba61-742de406b418) that are
defined in this [**document**](#gt_7b9a05f4-888b-4176-b00a-115046299e1b)
begins at this offset. If **lcbSttbfCaption** is zero,
**fcSttbfCaption** is undefined and MUST be ignored. If this document is
not the [**Normal template**](#gt_23ed698e-1978-4142-945a-5ecd018ba4a6),
this value MUST be ignored.

**lcbSttbfCaption (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the SttbfCaption at offset **fcSttbfCaption** in the
Table Stream. If **base.fDot** of the Fib that contains this
FibRgFcLcb97 is zero, this value MUST be 0.

**fcSttbfAutoCaption (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [SttbfAutoCaption](#sttbfautocaption) that
contains information about the
[**AutoCaption**](#gt_7df2d57b-8f21-4a9f-8f78-5186d57f09f3) strings
defined in this document begins at this offset. If
**lcbSttbfAutoCaption** is zero, **fcSttbfAutoCaption** is undefined and
MUST be ignored. If this document is not the Normal template, this value
MUST be ignored.

**lcbSttbfAutoCaption (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the **SttbfAutoCaption** at offset
**fcSttbfAutoCaption** in the Table Stream. If **base.fDot** of the
**Fib** that contains this **FibRgFcLcb97** is zero, this MUST be zero.

**fcPlcfWkb (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**PlcfWKB**](#plcfwkb) that contains information
about all master documents and subdocuments begins at this offset.

**lcbPlcfWkb (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PlcfWKB** at offset **fcPlcfWkb** in the Table
Stream. If **lcbPlcfWkb** is zero, **fcPlcfWkb** is undefined and MUST
be ignored.

**fcPlcfSpl (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**Plcfspl**](#plcfspl), which specifies the state
of the spell checker for each text range, begins at this offset. If
**lcbPlcfSpl** is zero, then **fcPlcfSpl** is undefined and MUST be
ignored.

**lcbPlcfSpl (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plcfspl** that begins at offset **fcPlcfSpl** in the
Table Stream.

**fcPlcftxbxTxt (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**PlcftxbxTxt**](#plcftxbxtxt) begins at
this offset and specifies which ranges of text are contained in which
textboxes. If **lcbPlcftxbxTxt** is zero, **fcPlcftxbxTxt** is undefined
and MUST be ignored.

**lcbPlcftxbxTxt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcftxbxTxt** that begins at offset
**fcPlcftxbxTxt** in the Table Stream.

**lcbPlcftxbxTxt** MUST be zero if **FibRgLw97.ccpTxbx** is zero, and
MUST be nonzero if **FibRgLw97.ccpTxbx** is nonzero.

**fcPlcfFldTxbx (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcfld** begins at this offset and
specifies the locations of field characters in the [Textbox
Document](#Section_f87b35602c234d109751ff141d307308). All CPs in this
**Plcfld** are relative to the starting position of the Textbox
Document. All CPs in this **Plcfld** MUST be greater than or equal to
zero and less than or equal to **FibRgLw97.ccpTxbx**. If
**lcbPlcfFldTxbx** is zero, **fcPlcfFldTxbx** is undefined and MUST be
ignored.

**lcbPlcfFldTxbx (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfld** at offset **fcPlcfFldTxbx** in the
Table Stream.

**fcPlcfHdrtxbxTxt (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**PlcfHdrtxbxTxt**](#plcfhdrtxbxtxt)
begins at this offset and specifies which ranges of text are contained
in which [header textboxes](#Section_7392319674e14e6988b8d2cc9ac8093b).

**lcbPlcfHdrtxbxTxt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfHdrtxbxTxt** that begins at offset
**fcPlcfHdrtxbxTxt** in the Table Stream.

**lcbPlcfHdrtxbxTxt** MUST be zero if **FibRgLw97.ccpHdrTxbx** is zero,
and MUST be nonzero if **FibRgLw97.ccpHdrTxbx** is nonzero.

**fcPlcffldHdrTxbx (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcfld** begins at this offset and
specifies the locations of field characters in the Header Textbox
Document. All CPs in this **Plcfld** are relative to the starting
position of the Header Textbox Document. All CPs in this **Plcfld** MUST
be greater than or equal to zero and less than or equal to
**FibRgLw97.ccpHdrTxbx**. If **lcbPlcffldHdrTxbx** is zero,
**fcPlcffldHdrTxbx** is undefined, and MUST be ignored.

**lcbPlcffldHdrTxbx (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfld** at offset **fcPlcffldHdrTxbx** in the
Table Stream.

**fcStwUser (4 bytes):** An unsigned integer that specifies an offset
into the Table Stream. An [**StwUser**](#stwuser) that specifies the
user-defined variables and
[**VBA**](#gt_bc3968c6-4bd2-40a2-8619-5cd7695b3e4f) [**digital
signature**](#gt_ad0cf6e3-05c3-482d-ab0f-617f91871189), as specified by
[\[MS-OSHARED\]](%5bMS-OSHARED%5d.pdf#Section_d93502fa5b8f4f47a3fe5574046f4b8d)
section 2.3.2, begins at this offset. If **lcbStwUser** is zero,
**fcStwUser** is undefined and MUST be ignored.

**lcbStwUser (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **StwUser** at offset **fcStwUser**.

**fcSttbTtmbd (4 bytes):** An unsigned integer that specifies an offset
into the Table Stream. A [**SttbTtmbd**](#sttbttmbd) begins at this
offset and specifies information about the [**TrueType
font**](#gt_f2f46046-d233-4083-8a96-1b72a89f9583)s that are embedded in
the document. If **lcbSttbTtmbd** is zero, **fcSttbTtmbd** is undefined
and MUST be ignored.

**lcbSttbTtmbd (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **SttbTtmbd** at offset **fcSttbTtmbd**.

**fcCookieData (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. An [**RgCdb**](#rgcdb) begins at this offset. If
**lcbCookieData** is zero, **fcCookieData** is undefined and MUST be
ignored. Otherwise, **fcCookieData** MAY<span id="Appendix_A_Target_28"
class="anchor"></span>[\<28\>](#Appendix_A_28) be ignored.

**lcbCookieData (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **RgCdb** at offset **fcCookieData** in the Table
Stream.

**fcPgdMotherOldOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated document page layout cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_29"
class="anchor"></span>[\<29\>](#Appendix_A_29) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_30"
class="anchor"></span>[\<30\>](#Appendix_A_30) be ignored. If
**lcbPgdMotherOldOld** is zero, **fcPgdMotherOldOld** is undefined and
MUST be ignored.

**lcbPgdMotherOldOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated document page layout cache at offset
**fcPgdMotherOldOld** in the Table Stream.

**fcBkdMotherOldOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. Deprecated document text flow break cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_31"
class="anchor"></span>[\<31\>](#Appendix_A_31) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_32" class="anchor"></span>\<32\>
be ignored. If **lcbBkdMotherOldOld** is zero, **fcBkdMotherOldOld** is
undefined and MUST be ignored.

**lcbBkdMotherOldOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated document text flow break cache at
offset **fcBkdMotherOldOld** in the Table Stream.

**fcPgdFtnOldOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. Deprecated footnote layout cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_33"
class="anchor"></span>\<33\> be emitted at this offset and
SHOULD<span id="Appendix_A_Target_34"
class="anchor"></span>[\<34\>](#Appendix_A_34) be ignored. If
**lcbPgdFtnOldOld** is zero, **fcPgdFtnOldOld** is undefined and MUST be
ignored.

**lcbPgdFtnOldOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated footnote layout cache at offset
**fcPgdFtnOldOld** in the Table Stream.

**fcBkdFtnOldOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated footnote text flow break
cache begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_35"
class="anchor"></span>[\<35\>](#Appendix_A_35) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_36"
class="anchor"></span>[\<36\>](#Appendix_A_36) be ignored. If
**lcbBkdFtnOldOld** is zero, **fcBkdFtnOldOld** is undefined and MUST be
ignored.

**lcbBkdFtnOldOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated footnote text flow break cache at
offset **fcBkdFtnOldOld** in the Table Stream.

**fcPgdEdnOldOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated endnote layout cache begins
at this offset. Information SHOULD NOT<span id="Appendix_A_Target_37"
class="anchor"></span>[\<37\>](#Appendix_A_37) be emitted at this offset
and SHOULD[\<38\>](#Appendix_A_38) be ignored. If **lcbPgdEdnOldOld** is
zero, **fcPgdEdnOldOld** is undefined and MUST be ignored.

**lcbPgdEdnOldOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated endnote layout cache at offset
**fcPgdEdnOldOld** in the Table Stream.

**fcBkdEdnOldOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated endnote text flow break cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_39"
class="anchor"></span>[\<39\>](#Appendix_A_39) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_40"
class="anchor"></span>[\<40\>](#Appendix_A_40) be ignored. If
**lcbBkdEdnOldOld** is zero, **fcBkdEdnOldOld** is undefined and MUST be
ignored.

**lcbBkdEdnOldOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated endnote text flow break cache at
offset **fcBkdEdnOldOld** in the Table Stream.

**fcSttbfIntlFld (4 bytes):** This value is undefined and MUST be
ignored.

**lcbSttbfIntlFld (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcRouteSlip (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**RouteSlip**](#routeslip) that specifies the
route slip for this document begins at this offset. This value
SHOULD<span id="Appendix_A_Target_41"
class="anchor"></span>[\<41\>](#Appendix_A_41) be ignored.

**lcbRouteSlip (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **RouteSlip** at offset **fcRouteSlip** in the Table
Stream.

**fcSttbSavedBy (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**SttbSavedBy**](#sttbsavedby) that
specifies the save history of this document begins at this offset. This
value SHOULD<span id="Appendix_A_Target_42"
class="anchor"></span>[\<42\>](#Appendix_A_42) be ignored.

**lcbSttbSavedBy (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbSavedBy** at the offset **fcSttbSavedBy**.
This value SHOULD<span id="Appendix_A_Target_43"
class="anchor"></span>[\<43\>](#Appendix_A_43) be zero.

**fcSttbFnm (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. An [**SttbFnm**](#sttbfnm) that contains information
about the external files that are referenced by this document begins at
this offset. If **lcbSttbFnm** is zero, **fcSttbFnm** is undefined and
MUST be ignored.

**lcbSttbFnm (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **SttbFnm** at the offset **fcSttbFnm**.

**fcPlfLst (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**PlfLst**](#plflst) that contains list formatting
information begins at this offset. An array of [**LVL**](#lvl)s is
appended to the **PlfLst**. **lcbPlfLst** does not account for the array
of **LVL**s. The size of the array of **LVL**s is specified by the
[**LSTF**](#lstf)s in **PlfLst**. For each **LSTF** whose
**fSimpleList** is set to 0x1, there is one **LVL** in the array of
**LVL**s that specifies the level formatting of the single level in the
list which corresponds to the **LSTF**. And, for each **LSTF** whose
**fSimpleList** is set to 0x0, there are 9 **LVL**s in the array of
**LVL**s that specify the level formatting of the respective levels in
the list which corresponds to the **LSTF**. This array of **LVL**s is in
the same respective order as the **LSTF**s in **PlfLst**. If
**lcbPlfLst** is 0, **fcPlfLst** is undefined and MUST be ignored.

**lcbPlfLst (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **PlfLst** at the offset **fcPlfLst**. This does not
include the size of the array of **LVL**s that are appended to the
**PlfLst**.

**fcPlfLfo (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**PlfLfo**](#plflfo) that contains list formatting
override information begins at this offset. If **lcbPlfLfo** is zero,
**fcPlfLfo** is undefined and MUST be ignored.

**lcbPlfLfo (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **PlfLfo** at the offset **fcPlfLfo**.

**fcPlcfTxbxBkd (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**PlcfTxbxBkd**](#plcftxbxbkd) begins at
this offset and specifies which ranges of text go inside which
textboxes.

**lcbPlcfTxbxBkd (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfTxbxBkd** that begins at offset
**fcPlcfTxbxBkd** in the Table Stream.

**lcbPlcfTxbxBkd** MUST be zero if **FibRgLw97.ccpTxbx** is zero, and
MUST be nonzero if **FibRgLw97.ccpTxbx** is nonzero.

**fcPlcfTxbxHdrBkd (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**PlcfTxbxHdrBkd**](#plcftxbxhdrbkd)
begins at this offset and specifies which ranges of text are contained
inside which header textboxes.

**lcbPlcfTxbxHdrBkd (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfTxbxHdrBkd** that begins at offset
**fcPlcfTxbxHdrBkd** in the Table Stream.

**lcbPlcfTxbxHdrBkd** MUST be zero if **FibRgLw97.ccpHdrTxbx** is zero,
and MUST be nonzero if **FibRgLw97.ccpHdrTxbx** is nonzero.

**fcDocUndoWord9 (4 bytes):** An unsigned integer that specifies an
offset in the WordDocument Stream. Version-specific undo information
begins at this offset. This information SHOULD
NOT<span id="Appendix_A_Target_44"
class="anchor"></span>[\<44\>](#Appendix_A_44) be emitted and
SHOULD<span id="Appendix_A_Target_45"
class="anchor"></span>[\<45\>](#Appendix_A_45) be ignored.

**lcbDocUndoWord9 (4 bytes):** An unsigned integer. If this is nonzero,
version-specific undo information exists at offset **fcDocUndoWord9** in
the WordDocument Stream.

**fcRgbUse (4 bytes):** An unsigned integer that specifies an offset in
the WordDocument Stream. Version-specific undo information begins at
this offset. This information SHOULD NOT<span id="Appendix_A_Target_46"
class="anchor"></span>[\<46\>](#Appendix_A_46) be emitted and
SHOULD<span id="Appendix_A_Target_47"
class="anchor"></span>[\<47\>](#Appendix_A_47) be ignored.

**lcbRgbUse (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the version-specific undo information at offset **fcRgbUse**
in the WordDocument Stream.

**fcUsp (4 bytes):** An unsigned integer that specifies an offset in the
WordDocument Stream. Version-specific undo information begins at this
offset. This information SHOULD NOT<span id="Appendix_A_Target_48"
class="anchor"></span>[\<48\>](#Appendix_A_48) be emitted and
SHOULD<span id="Appendix_A_Target_49"
class="anchor"></span>[\<49\>](#Appendix_A_49) be ignored.

**lcbUsp (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the version-specific undo information at offset **fcUsp** in
the WordDocument Stream.

**fcUskf (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. Version-specific undo information begins at this
offset. This information SHOULD NOT<span id="Appendix_A_Target_50"
class="anchor"></span>[\<50\>](#Appendix_A_50) be emitted and
SHOULD<span id="Appendix_A_Target_51"
class="anchor"></span>[\<51\>](#Appendix_A_51) be ignored.

**lcbUskf (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the version-specific undo information at offset **fcUskf** in
the Table Stream.

**fcPlcupcRgbUse (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plc** begins at this offset and contains
version-specific undo information. This information SHOULD
NOT<span id="Appendix_A_Target_52"
class="anchor"></span>[\<52\>](#Appendix_A_52) be emitted and
SHOULD<span id="Appendix_A_Target_53"
class="anchor"></span>[\<53\>](#Appendix_A_53) be ignored.

**lcbPlcupcRgbUse (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plc** at offset **fcPlcupcRgbUse** in the Table
Stream.

**fcPlcupcUsp (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plc** begins at this offset and contains
version-specific undo information. This information SHOULD
NOT<span id="Appendix_A_Target_54"
class="anchor"></span>[\<54\>](#Appendix_A_54) be emitted and
SHOULD<span id="Appendix_A_Target_55"
class="anchor"></span>[\<55\>](#Appendix_A_55) be ignored.

**lcbPlcupcUsp (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plc** at offset **fcPlcupcUsp** in the Table Stream.

**fcSttbGlsyStyle (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**SttbGlsyStyle**](#sttbglsystyle), which
contains information about the
[**style**](#gt_b1e1f096-9da0-411f-909a-f69b92c17633)s that are used by
the AutoText items which are defined in this document, begins at this
offset.

**lcbSttbGlsyStyle (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbGlsyStyle** at offset **fcSttbGlsyStyle**
in the Table Stream. If **base.fGlsy** of the **Fib** that contains this
**FibRgFcLcb97** is zero, this value MUST be 0.

**fcPlgosl (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**PlfGosl**](#plfgosl) begins at the offset. If
**lcbPlgosl** is zero, **fcPlgosl** is undefined and MUST be ignored.

**lcbPlgosl (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **PlfGosl** at offset **fcPlgosl** in the Table Stream.

**fcPlcocx (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**RgxOcxInfo**](#rgxocxinfo) that specifies
information about the [**OLE
controls**](#gt_bc9725db-119f-415d-825c-ece4d5cd8b29) in the document
begins at this offset. When there are no OLE controls in the document,
**fcPlcocx** and **lcbPlcocx** MUST be zero and MUST be ignored. If
there are any OLE controls in the document, **fcPlcocx** MUST point to a
valid **RgxOcxInfo**.

**lcbPlcocx (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **RgxOcxInfo** at the offset **fcPlcocx**.

**fcPlcfBteLvc (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A deprecated numbering field cache begins at this
offset. This information SHOULD NOT[\<56\>](#Appendix_A_56) be emitted
and SHOULD<span id="Appendix_A_Target_57"
class="anchor"></span>[\<57\>](#Appendix_A_57) ignored. If
**lcbPlcfBteLvc** is zero, **fcPlcfBteLvc** is undefined and MUST be
ignored.

**lcbPlcfBteLvc (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated numbering field cache at offset
**fcPlcfBteLvc** in the Table Stream. This value
SHOULD<span id="Appendix_A_Target_58"
class="anchor"></span>[\<58\>](#Appendix_A_58) be zero.

**dwLowDateTime (4 bytes):** The low-order part of a **FILETIME**
structure, as specified by
[\[MS-DTYP\]](%5bMS-DTYP%5d.pdf#Section_cca2742956894a16b2b49325d93e4ba2),
that specifies when the document was last saved.

**dwHighDateTime (4 bytes):** The high-order part of a **FILETIME**
structure, as specified by \[MS-DTYP\], that specifies when the document
was last saved.

**fcPlcfLvcPre10 (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated list level cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_59"
class="anchor"></span>[\<59\>](#Appendix_A_59) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_60"
class="anchor"></span>[\<60\>](#Appendix_A_60) be ignored. If
**lcbPlcfLvcPre10** is zero, **fcPlcfLvcPre10** is undefined and MUST be
ignored.

**lcbPlcfLvcPre10 (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated list level cache at offset
**fcPlcfLvcPre10** in the Table Stream. This value
SHOULD<span id="Appendix_A_Target_61"
class="anchor"></span>[\<61\>](#Appendix_A_61) be zero.

**fcPlcfAsumy (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlcfAsumy**](#plcfasumy) begins at the offset.
If **lcbPlcfAsumy** is zero, **fcPlcfAsumy** is undefined and MUST be
ignored.

**lcbPlcfAsumy (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PlcfAsumy** at offset **fcPlcfAsumy** in the Table
Stream.

**fcPlcfGram (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**Plcfgram**](#plcfgram), which specifies the
state of the grammar checker for each text range, begins at this offset.
If **lcbPlcfGram** is zero, then **fcPlcfGram** is undefined and MUST be
ignored.

**lcbPlcfGram (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plcfgram** that begins at offset **fcPlcfGram** in
the Table Stream.

**fcSttbListNames (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**SttbListNames**](#sttblistnames), which
specifies the [**LISTNUM**](#flt) field names of the lists in the
document, begins at this offset. If **lcbSttbListNames** is zero,
**fcSttbListNames** is undefined and MUST be ignored.

**lcbSttbListNames (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbListNames** at the offset
**fcSttbListNames**.

**fcSttbfUssr (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. The deprecated, version-specific undo information
begins at this offset. This information SHOULD
NOT<span id="Appendix_A_Target_62"
class="anchor"></span>[\<62\>](#Appendix_A_62) be emitted and
SHOULD<span id="Appendix_A_Target_63"
class="anchor"></span>[\<63\>](#Appendix_A_63) be ignored.

**lcbSttbfUssr (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated, version-specific undo information at offset
**fcSttbfUssr** in the Table Stream.

### FibRgFcLcb2000

The **FibRgFcLcb2000** structure is a variable-sized portion of the
[Fib](#fib). It extends the [FibRgFcLcb97](#fibrgfclcb97).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rgFcLcb97 (744 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfTch |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfTch |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcRmdThreading |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbRmdThreading |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcMid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbMid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbRgtplc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbRgtplc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcMsoEnvelope |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbMsoEnvelope |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfLad |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfLad |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcRgDofr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbRgDofr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcosl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcosl |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfCookieOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfCookieOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdMotherOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdMotherOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdMotherOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdMotherOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdFtnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdFtnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdFtnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdFtnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdEdnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdEdnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdEdnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdEdnOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**rgFcLcb97 (744 bytes):** The contained **FibRgFcLcb97**.

**fcPlcfTch (4 bytes):** An unsigned integer that specifies an offset in
the [Table Stream](#Section_44f62054d9114989946ca42100c26a15). A
[**PlcfTch**](#plcftch) begins at this offset and specifies a cache of
table characters. Information at this offset
SHOULD<span id="Appendix_A_Target_64"
class="anchor"></span>[\<64\>](#Appendix_A_64) be ignored. If
**lcbPlcfTch** is zero, **fcPlcfTch** is undefined and MUST be ignored.

**lcbPlcfTch (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PlcfTch** at offset **fcPlcfTch**.

**fcRmdThreading (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An [**RmdThreading**](#rmdthreading) that
specifies the data concerning the e-mail messages and their authors in
this document begins at this offset.

**lcbRmdThreading (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **RmdThreading** at the offset
**fcRmdThreading**. This value MUST NOT be zero.

**fcMid (4 bytes):** An unsigned integer that specifies an offset in the
Table Stream. A double-byte character
[**Unicode**](#gt_c305d0ab-8b94-461a-bd76-13b40cb8c4d8) string that
specifies the [**message
identifier**](#gt_24c02397-73d4-4bf2-8b93-669ba29d8e94) of the document
begins at this offset. This value MUST be ignored.

**lcbMid (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the double-byte character Unicode string at offset **fcMid**.
This value MUST be ignored.

**fcSttbRgtplc (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**SttbRgtplc**](#sttbrgtplc) that specifies the
styles of lists in the document begins at this offset. If
**lcbSttbRgtplc** is zero, **fcSttbRgtplc** is undefined and MUST be
ignored.

**lcbSttbRgtplc (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbRgtplc** at the offset **fcSttbRgtplc**.

**fcMsoEnvelope (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An **MsoEnvelopeCLSID**, which specifies the
envelope data as specified by
[\[MS-OSHARED\]](%5bMS-OSHARED%5d.pdf#Section_d93502fa5b8f4f47a3fe5574046f4b8d)
section 2.3.8.1, begins at this offset. If **lcbMsoEnvelope** is zero,
**fcMsoEnvelope** is undefined and MUST be ignored.

**lcbMsoEnvelope (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **MsoEnvelopeCLSID** at the offset
**fcMsoEnvelope**.

**fcPlcfLad (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**Plcflad**](#plcflad) begins at this offset and
specifies the language auto-detect state of each text range. If
**lcbPlcfLad** is zero, **fcPlcfLad** is undefined and MUST be ignored.

**lcbPlcfLad (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plcflad** that begins at offset **fcPlcfLad** in the
Table Stream.

**fcRgDofr (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A variable-length array with elements of type
[**Dofrh**](#dofrh) begins at that offset. The elements of this array
are records that support the frame set and list style features. If
**lcbRgDofr** is zero, **fcRgDofr** is undefined and MUST be ignored.

**lcbRgDofr (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the array that begins at offset **fcRgDofr** in the Table
Stream.

**fcPlcosl (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**PlfCosl**](#plfcosl) begins at the offset. If
**lcbPlcosl** is zero, **fcPlcosl** is undefined and MUST be ignored.

**lcbPlcosl (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **PlfCosl** at offset **fcPlcosl** in the Table Stream.

**fcPlcfCookieOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**PlcfcookieOld**](#plcfcookieold) begins
at this offset. If **lcbPlcfcookieOld** is zero, **fcPlcfcookieOld** is
undefined and MUST be ignored. **fcPlcfcookieOld**
MAY<span id="Appendix_A_Target_65"
class="anchor"></span>[\<65\>](#Appendix_A_65) be ignored.

**lcbPlcfCookieOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlcfcookieOld** at offset **fcPlcfcookieOld**
in the Table Stream.

**fcPgdMotherOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated document page layout cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_66"
class="anchor"></span>[<sup>\<66\></sup>](#) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_67"
class="anchor"></span>[<sup>\<67\></sup>](#Appendix_A_67) be ignored. If
**lcbPgdMotherOld** is zero, **fcPgdMotherOld** is undefined and MUST be
ignored.

**lcbPgdMotherOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated document page layout cache at offset
**fcPgdMotherOld** in the Table Stream.

**fcBkdMotherOld (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated document text flow break
cache begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_68"
class="anchor"></span>[<sup>\<68\></sup>](#Appendix_A_68) be emitted at
this offset and SHOULD<span id="Appendix_A_Target_69"
class="anchor"></span>[<sup>\<69\></sup>](#Appendix_A_69) be ignored. If
**lcbBkdMotherOld** is zero, **fcBkdMotherOld** is undefined and MUST be
ignored.

**lcbBkdMotherOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated document text flow break cache at
offset **fcBkdMotherOld** in the Table Stream.

**fcPgdFtnOld (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. The deprecated footnote layout cache begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_70"
class="anchor"></span>[<sup>\<70\></sup>](#Appendix_A_70) be emitted at
this offset and SHOULD<span id="Appendix_A_Target_71"
class="anchor"></span>[<sup>\<71\></sup>](#Appendix_A_71) be ignored. If
**lcbPgdFtnOld** is zero, **fcPgdFtnOld** is undefined and MUST be
ignored.

**lcbPgdFtnOld (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated footnote layout cache at offset
**fcPgdFtnOld** in the Table Stream.

**fcBkdFtnOld (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. The deprecated footnote text flow break cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_72"
class="anchor"></span>[<sup>\<72\></sup>](#Appendix_A_72) be emitted at
this offset and SHOULD[<sup>\<73\></sup>](#Appendix_A_73) be ignored. If
**lcbBkdFtnOld** is zero, **fcBkdFtnOld** is undefined and MUST be
ignored.

**lcbBkdFtnOld (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated footnote text flow break cache at offset
**fcBkdFtnOld** in the Table Stream.

**fcPgdEdnOld (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. The deprecated endnote layout cache begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_74"
class="anchor"></span>[<sup>\<74\></sup>](#Appendix_A_74) be emitted at
this offset and SHOULD<span id="Appendix_A_Target_75"
class="anchor"></span><sup>\<75\></sup> be ignored. If **lcbPgdEdnOld**
is zero, **fcPgdEdnOld** is undefined and MUST be ignored.

**lcbPgdEdnOld (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated endnote layout cache at offset
**fcPgdEdnOld** in the Table Stream.

**fcBkdEdnOld (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. The deprecated endnote text flow break cache begins
at this offset. Information SHOULD NOT<span id="Appendix_A_Target_76"
class="anchor"></span>[<sup>\<76\></sup>](#Appendix_A_76) be emitted at
this offset and SHOULD<span id="Appendix_A_Target_77"
class="anchor"></span>[<sup>\<77\></sup>](#Appendix_A_77) be ignored. If
**lcbBkdEdnOld** is zero, **fcBkdEdnOld** is undefined and MUST be
ignored.

**lcbBkdEdnOld (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated endnote text flow break cache at offset
**fcBkdEdnOld** in the Table Stream.

### FibRgFcLcb2002

The **FibRgFcLcb2002** structure is a variable-sized portion of the
[Fib](#fib). It extends the [FibRgFcLcb2000](#fibrgfclcb2000).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rgFcLcb2000 (864 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfPgp |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfPgp |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfuim |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfuim |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlfguidUim |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlfguidUim |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcAtrdExtra |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbAtrdExtra |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlrsid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlrsid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmkFactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmkFactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkfFactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkfFactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfcookie |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfcookie |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBklFactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBklFactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcFactoidData |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbFactoidData |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcDocUndo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbDocUndo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmkFcc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmkFcc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkfFcc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkfFcc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBklFcc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBklFcc |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfbkmkBPRepairs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfbkmkBPRepairs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfbkfBPRepairs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfbkfBPRepairs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfbklBPRepairs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfbklBPRepairs |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPmsNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPmsNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcODSO |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbODSO |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfpmiOldXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfpmiOldXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfpmiNewXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfpmiNewXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfpmiMixedXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfpmiMixedXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcffactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcffactoid |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcflvcOldXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcflvcOldXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcflvcNewXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcflvcNewXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcflvcMixedXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcflvcMixedXP |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**rgFcLcb2000 (864 bytes):** The contained **FibRgFcLcb2000**.

**fcUnused1 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused1 (4 bytes):** This value MUST be 0, and MUST be ignored

**fcPlcfPgp (4 bytes):** An unsigned integer that specifies an offset in
the [Table Stream](#Section_44f62054d9114989946ca42100c26a15). A
[**PGPArray**](#pgparray) begins at this offset. If **lcbPlcfPgp** is 0,
**fcPlcfPgp** is undefined and MUST be ignored.

**lcbPlcfPgp (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **PGPArray** that is stored at offset **fcPlcfPgp**.

**fcPlcfuim (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**Plcfuim**](#plcfuim) begins at this offset. If
**lcbPlcfuim** is zero, **fcPlcfuim** is undefined and MUST be ignored.

**lcbPlcfuim (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Plcfuim** at offset **fcPlcfuim**.

**fcPlfguidUim (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**PlfguidUim**](#plfguiduim) begins at this
offset. If **lcbPlfguidUim** is zero, **fcPlfguidUim** is undefined and
MUST be ignored.

**lcbPlfguidUim (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **PlfguidUim** at offset **fcPlfguidUim.**

**fcAtrdExtra (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. An [**AtrdExtra**](#atrdextra) begins at this
offset. If **lcbAtrdExtra** is zero, **fcAtrdExtra** is undefined and
MUST be ignored.

**lcbAtrdExtra (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **AtrdExtra** at offset **fcAtrdExtra** in the Table
Stream.

**fcPlrsid (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A [**PLRSID**](#plrsid) begins at this offset. If
**lcbPlrsid** is zero, **fcPlrsid** is undefined and MUST be ignored.

**lcbPlrsid (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the **PLRSID** at offset **fcPlrsid** in the Table Stream.

**fcSttbfBkmkFactoid (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An [**SttbfBkmkFactoid**](#sttbfbkmkfactoid)
containing information about [**smart tag
bookmarks**](#gt_4ce58819-c45f-4bcc-8c3d-36268e1f8f0b) in the document
begins at this offset. If **lcbSttbfBkmkFactoid** is zero,
**fcSttbfBkmkFactoid** is undefined and MUST be ignored.

The **SttbfBkmkFactoid** is parallel to the [**Plcfbkfd**](#plcfbkfd) at
offset **fcPlcfBkfFactoid** in the Table Stream. Each element in the
**SttbfBkmkFactoid** specifies information about the
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) that is
associated with the data element which is located at the same offset in
that **Plcfbkfd**. For this reason, the **SttbfBkmkFactoid** that begins
at offset **fcSttbfBkmkFactoid**, and the **Plcfbkfd** that begins at
offset **fcPlcfBkfFactoid**, MUST contain the same number of elements.

**lcbSttbfBkmkFactoid (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the **SttbfBkmkFactoid** at offset
**fcSttbfBkmkFactoid**.

**fcPlcfBkfFactoid (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcfbkfd** that contains information
about the smart tag bookmarks in the document begins at this offset. If
**lcbPlcfBkfFactoid** is zero, **fcPlcfBkfFactoid** is undefined and
MUST be ignored.

Each data element in the **Plcfbkfd** is associated, in a one-to-one
correlation, with a data element in the [**Plcfbkld**](#plcfbkld) at
offset **fcPlcfBklFactoid**. For this reason, the **Plcfbkfd** that
begins at offset **fcPlcfBkfFactoid**, and the **Plcfbkld** that begins
at offset **fcPlcfBklFactoid**, MUST contain the same number of data
elements. The **Plcfbkfd** is parallel to the **SttbfBkmkFactoid** at
offset **fcSttbfBkmkFactoid** in the Table Stream. Each data element in
the **Plcfbkfd** specifies information about the bookmark that is
associated with the element which is located at the same offset in that
**SttbfBkmkFactoid**. For this reason, the **Plcfbkfd** that begins at
offset **fcPlcfBkfFactoid**, and the **SttbfBkmkFactoid** that begins at
offset **fcSttbfBkmkFactoid**, MUST contain the same number of elements.

**lcbPlcfBkfFactoid (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfbkfd** at offset **fcPlcfBkfFactoid**.

**fcPlcfcookie (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A [**Plcfcookie**](#plcfcookie) begins at this
offset. If **lcbPlcfcookie** is zero, **fcPlcfcookie** is undefined and
MUST be ignored. **fcPlcfcookie** MAY<span id="Appendix_A_Target_78"
class="anchor"></span>[\<78\>](#Appendix_A_78) be ignored.

**lcbPlcfcookie (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfcookie** at offset **fcPlcfcookie** in the
Table Stream.

**fcPlcfBklFactoid (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcfbkld** that contains information
about the smart tag bookmarks in the document begins at this offset. If
**lcbPlcfBklFactoid** is zero, **fcPlcfBklFactoid** is undefined and
MUST be ignored.

Each data element in the **Plcfbkld** is associated, in a one-to-one
correlation, with a data element in the **Plcfbkfd** at offset
**fcPlcfBkfFactoid**. For this reason, the **Plcfbkld** that begins at
offset **fcPlcfBklFactoid**, and the **Plcfbkfd** that begins at offset
**fcPlcfBkfFactoid**, MUST contain the same number of data elements.

**lcbPlcfBklFactoid (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfbkld** at offset **fcPlcfBklFactoid**.

**fcFactoidData (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**SmartTagData**](#smarttagdata) begins
at this offset and specifies information about the [**smart tag
recognizers**](#gt_31f2a874-4490-4c2c-9e2c-6267f373bf5c) that are used
in this document. If **lcbFactoidData** is zero, **fcFactoidData** is
undefined and MUST be ignored.

**lcbFactoidData (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the SmartTagData at offset **fcFactoidData** in the
Table Stream.

**fcDocUndo (4 bytes):** An unsigned integer that specifies an offset in
the [WordDocument Stream](#Section_d7fae142670d4cd5869a708366984a71).
Version-specific undo information begins at this offset. This
information SHOULD NOT<span id="Appendix_A_Target_79"
class="anchor"></span>\<79\> be emitted and
SHOULD<span id="Appendix_A_Target_80"
class="anchor"></span>[\<80\>](#Appendix_A_80) be ignored.

**lcbDocUndo (4 bytes):** An unsigned integer. If this value is nonzero,
version-specific undo information exists at offset **fcDocUndo** in the
WordDocument Stream.

**fcSttbfBkmkFcc (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An [**SttbfBkmkFcc**](#sttbfbkmkfcc) that
contains information about the [**format consistency-checker
bookmark**](#gt_2f3fbf82-4359-4b12-aeec-1968eb797ee5)s in the document
begins at this offset. If **lcbSttbfBkmkFcc** is zero,
**fcSttbfBkmkFcc** is undefined and MUST be ignored.

The **SttbfBkmkFcc** is parallel to the **Plcfbkfd** at offset
**fcPlcfBkfFcc** in the Table Stream. Each element in the
**SttbfBkmkFcc** specifies information about the bookmark that is
associated with the data element which is located at the same offset in
that **Plcfbkfd**. For this reason, the **SttbfBkmkFcc** that begins at
offset **fcSttbfBkmkFcc**, and the **Plcfbkfd** that begins at offset
**fcPlcfBkfFcc**, MUST contain the same number of elements.

**lcbSttbfBkmkFcc (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbfBkmkFcc** at offset **fcSttbfBkmkFcc**.

**fcPlcfBkfFcc (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfbkfd** that contains information about
format consistency-checker bookmarks in the document begins at this
offset. If **lcbPlcfBkfFcc** is zero, **fcPlcfBkfFcc** is undefined and
MUST be ignored.

Each data element in the **Plcfbkfd** is associated, in a one-to-one
correlation, with a data element in the **Plcfbkld** at offset
**fcPlcfBklFcc**. For this reason, the **Plcfbkfd** that begins at
offset **fcPlcfBkfFcc** and the **Plcfbkld** that begins at offset
**fcPlcfBklFcc** MUST contain the same number of data elements. The
**Plcfbkfd** is parallel to the **SttbfBkmkFcc** at offset
**fcSttbfBkmkFcc** in the Table Stream. Each data element in the
**Plcfbkfd** specifies information about the bookmark that is associated
with the element which is located at the same offset in that
**SttbfBkmkFcc**. For this reason, the **Plcfbkfd** that begins at
offset **fcPlcfBkfFcc** and the **SttbfBkmkFcc** that begins at offset
**fcSttbfBkmkFcc** MUST contain the same number of elements.

**lcbPlcfBkfFcc (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfbkfd** at offset **fcPlcfBkfFcc**.

**fcPlcfBklFcc (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcfbkld** that contains information about the
format consistency-checker bookmarks in the document begins at this
offset. If **lcbPlcfBklFcc** is zero, **fcPlcfBklFcc** is undefined and
MUST be ignored.

Each data element in the **Plcfbkld** is associated, in a one-to-one
correlation, with a data element in the **Plcfbkfd** at offset
**fcPlcfBkfFcc**. For this reason, the **Plcfbkld** that begins at
offset **fcPlcfBklFcc**, and the **Plcfbkfd** that begins at offset
**fcPlcfBkfFcc**, MUST contain the same number of data elements.

**lcbPlcfBklFcc (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcfbkld** at offset **fcPlcfBklFcc**.

**fcSttbfbkmkBPRepairs (4 bytes):** An unsigned integer that specifies
an offset in the Table Stream. An
[**SttbfBkmkBPRepairs**](#sttbfbkmkbprepairs) that contains information
about the [**repair
bookmarks**](#gt_c3ad7c96-ac9f-4c5f-9e69-354acf8d0b13) in the document
begins at this offset. If **lcbSttbfBkmkBPRepairs** is zero,
**fcSttbfBkmkBPRepairs** is undefined and MUST be ignored.

The **SttbfBkmkBPRepairs** is parallel to the [**Plcfbkf**](#plcfbkf) at
offset **fcPlcfBkfBPRepairs** in the Table Stream. Each element in the
**SttbfBkmkBPRepairs** specifies information about the bookmark that is
associated with the data element which is located at the same offset in
that **Plcfbkf**. For this reason, the **SttbfBkmkBPRepairs** that
begins at offset **fcSttbfBkmkBPRepairs**, and the **Plcfbkf** that
begins at offset **fcPlcfBkfBPRepairs**, MUST contain the same number of
elements.

**lcbSttbfbkmkBPRepairs (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the SttbfBkmkBPRepairs at offset
**fcSttbfBkmkBPRepairs**.

**fcPlcfbkfBPRepairs (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcfbkf** that contains information
about the repair bookmarks in the document begins at this offset. If
**lcbPlcfBkfBPRepairs** is zero, **fcPlcfBkfBPRepairs** is undefined and
MUST be ignored.

Each data element in the **Plcfbkf** is associated, in a one-to-one
correlation, with a data element in the [**Plcfbkl**](#plcfbkl) at
offset **fcPlcfBklBPRepairs**. For this reason, the **Plcfbkf** that
begins at offset **fcPlcfBkfBPRepairs**, and the **Plcfbkl** that begins
at offset **fcPlcfBklBPRepairs**, MUST contain the same number of data
elements. The **Plcfbkf** is parallel to the **SttbfBkmkBPRepairs** at
offset **fcSttbfBkmkBPRepairs** in the Table Stream. Each data element
in the Plcfbkf specifies information about the bookmark that is
associated with the element which is located at the same offset in that
**SttbfBkmkBPRepairs**. For this reason, the **Plcfbkf** that begins at
offset **fcPlcfbkfBPRepairs**, and the **SttbfBkmkBPRepairs** that
begins at offset **fcSttbfBkmkBPRepairs**, MUST contain the same number
of elements.

The [CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s in this **Plcfbkf**
MUST NOT exceed the CP that represents the end of the [Main Document
part](#Section_f426d9a2004d418e8d8ce7fd88e7c48e).

**lcbPlcfbkfBPRepairs (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the **Plcfbkf** at offset **fcPlcfbkfBPRepairs**.

**fcPlcfbklBPRepairs (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcfbkl** that contains information
about the repair bookmarks in the document begins at this offset. If
**lcbPlcfBklBPRepairs** is zero, **fcPlcfBklBPRepairs** is undefined and
MUST be ignored.

Each data element in the **Plcfbkl** is associated, in a one-to-one
correlation, with a data element in the **Plcfbkf** at offset
**fcPlcfBkfBPRepairs**. For this reason, the **Plcfbkl** that begins at
offset **fcPlcfBklBPRepairs**, and the **Plcfbkf** that begins at offset
**fcPlcfBkfBPRepairs**, MUST contain the same number of data elements.

The CPs that are contained in this **Plcfbkl** MUST NOT exceed the CP
that represents the end of the Main Document part.

**lcbPlcfbklBPRepairs (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the **Plcfbkl** at offset **fcPlcfBklBPRepairs**.

**fcPmsNew (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. A new [**Pms**](#pms), which contains the current
state of a print merge operation, begins at this offset. If
**lcbPmsNew** is zero, **fcPmsNew** is undefined and MUST be ignored.

**lcbPmsNew (4 bytes):** An unsigned integer which specifies the size,
in bytes, of the **Pms** at offset **fcPmsNew**.

**fcODSO (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. [Office Data Source Object](#odsopropertybase) (ODSO)
data that is used to perform mail merge begins at this offset. The data
is stored in an array of **ODSOPropertyBase** items. The
**ODSOPropertyBase** items are of variable size and are stored
contiguously. The complete set of properties that are contained in the
array is determined by reading each **ODSOPropertyBase**, until a total
of **lcbODSO** bytes of data are read. If **lcbODSO** is zero,
**fcODSO** is undefined and MUST be ignored.

**lcbODSO (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the Office Data Source Object data at offset **fcODSO** in the
Table Stream.

**fcPlcfpmiOldXP (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated paragraph mark information
cache begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_81"
class="anchor"></span>[\<81\>](#Appendix_A_81) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_82"
class="anchor"></span>[\<82\>](#Appendix_A_82) be ignored. If
**lcbPlcfpmiOldXP** is zero, **fcPlcfpmiOldXP** is undefined and MUST be
ignored.

**lcbPlcfpmiOldXP (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated paragraph mark information cache at
offset **fcPlcfpmiOldXP** in the Table Stream. This value
SHOULD<span id="Appendix_A_Target_83"
class="anchor"></span>[\<83\>](#Appendix_A_83) be zero.

**fcPlcfpmiNewXP (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated paragraph mark information
cache begins at this offset. Information SHOULD
NOT[\<84\>](#Appendix_A_84) be emitted at this offset and
SHOULD<span id="Appendix_A_Target_85"
class="anchor"></span>[\<85\>](#Appendix_A_85) be ignored. If
**lcbPlcfpmiNewXP** is zero, **fcPlcfpmiNewXP** is undefined and MUST be
ignored.

**lcbPlcfpmiNewXP (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated paragraph mark information cache at
offset **fcPlcfpmiNewXP** in the Table Stream. This value
SHOULD<span id="Appendix_A_Target_86" class="anchor"></span>[\<86\>]()
be zero.

**fcPlcfpmiMixedXP (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated paragraph mark information
cache begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_87"
class="anchor"></span>[\<87\>](#Appendix_A_87) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_88"
class="anchor"></span>[\<88\>](#Appendix_A_88) be ignored. If
**lcbPlcfpmiMixedXP** is zero, **fcPlcfpmiMixedXP** is undefined and
MUST be ignored.

**lcbPlcfpmiMixedXP (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated paragraph mark information cache at
offset **fcPlcfpmiMixedXP** in the Table Stream. This value SHOULD\<89\>
be zero.

**fcUnused2 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused2 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcPlcffactoid (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**Plcffactoid**](#plcffactoid), which
specifies the smart tag recognizer state of each text range, begins at
this offset. If **lcbPlcffactoid** is zero, **fcPlcffactoid** is
undefined and MUST be ignored.

**lcbPlcffactoid (4 bytes):** An unsigned integer that specifies the
size, in bytes of the **Plcffactoid** that begins at offset
**fcPlcffactoid** in the Table Stream.

**fcPlcflvcOldXP (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated **listnum** field cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_90"
class="anchor"></span>[\<90\>](#Appendix_A_90) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_91"
class="anchor"></span>[\<91\>](#Appendix_A_91) be ignored. If
**lcbPlcflvcOldXP** is zero, **fcPlcflvcOldXP** is undefined and MUST be
ignored.

**lcbPlcflvcOldXP (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated **listnum** field cache at offset
**fcPlcflvcOldXP** in the Table Stream. This value
SHOULD<span id="Appendix_A_Target_92"
class="anchor"></span>[\<92\>](#Appendix_A_92) be zero.

**fcPlcflvcNewXP (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated **listnum** field cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_93"
class="anchor"></span>[\<93\>](#Appendix_A_93) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_94"
class="anchor"></span>[\<94\>](#Appendix_A_94) be ignored. If
**lcbPlcflvcNewXP** is zero, **fcPlcflvcNewXP** is undefined and MUST be
ignored.

**lcbPlcflvcNewXP (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated **listnum** field cache at offset
**fcPlcflvcNewXP** in the Table Stream. This value
SHOULD<span id="Appendix_A_Target_95"
class="anchor"></span>[\<95\>](#Appendix_A_95) be zero.

**fcPlcflvcMixedXP (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. The deprecated **listnum** field cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_96"
class="anchor"></span>[\<96\>](#Appendix_A_96) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_97"
class="anchor"></span>[\<97\>](#Appendix_A_97) be ignored. If
**lcbPlcflvcMixedXP** is zero, **fcPlcflvcMixedXP** is undefined and
MUST be ignored.

**lcbPlcflvcMixedXP (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated **listnum** field cache at offset
**fcPlcflvcMixedXP** in the Table Stream. This value
SHOULD<span id="Appendix_A_Target_98"
class="anchor"></span>[\<98\>](#Appendix_A_98) be zero.

### FibRgFcLcb2003

The **FibRgFcLcb2003** structure is a variable-sized portion of the
[Fib](#fib). It extends the [FibRgFcLcb2002](#fibrgfclcb2002).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rgFcLcb2002 (1088 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcHplxsdr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbHplxsdr |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmkSdt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmkSdt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkfSdt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkfSdt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBklSdt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBklSdt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcCustomXForm |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbCustomXForm |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmkProt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmkProt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkfProt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkfProt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBklProt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBklProt |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbProtUser |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbProtUser |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfpmiOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfpmiOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfpmiOldInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfpmiOldInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfpmiNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfpmiNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfpmiNewInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfpmiNewInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcflvcOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcflvcOld |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcflvcOldInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcflvcOldInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcflvcNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcflvcNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcflvcNewInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcflvcNewInline |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdMother |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdMother |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdMother |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdMother |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcAfdMother |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbAfdMother |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcAfdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbAfdFtn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPgdEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPgdEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcBkdEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbBkdEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcAfdEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbAfdEdn |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcAfd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbAfd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**rgFcLcb2002 (1088 bytes):** The contained **FibRgFcLcb2002**.

**fcHplxsdr (4 bytes):** An unsigned integer that specifies an offset in
the [Table Stream](#Section_44f62054d9114989946ca42100c26a15). An
[**Hplxsdr**](#hplxsdr) structure begins at this offset. This structure
specifies information about [**XML schema definition
(XSD)**](#gt_c7e91c99-e45a-44c2-a08a-c34f137a2cae) references.

**lcbHplxsdr (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the **Hplxsdr** structure at the offset **fcHplxsdr** in
the Table Stream. If **lcbHplxsdr** is zero, then **fcHplxsdr** is
undefined and MUST be ignored.

**fcSttbfBkmkSdt (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An [**SttbfBkmkSdt**](#sttbfbkmksdt) that
contains information about the [**structured document tag
bookmarks**](#gt_ad0003b6-75cc-4c4c-80fe-859dacbea6d7) in the document
begins at this offset. If **lcbSttbfBkmkSdt** is zero, then
**fcSttbfBkmkSdt** is undefined and MUST be ignored.

The **SttbfBkmkSdt** is parallel to the [**Plcbkfd**](#plcbkfd) at
offset **fcPlcfBkfSdt** in the Table Stream. Each element in the
**SttbfBkmkSdt** specifies information about the
[**bookmark**](#gt_42f9c2f4-8a4b-4d64-a0e1-fc071debdf4c) that is
associated with the data element which is located at the same offset in
that **Plcbkfd**. For this reason, the **SttbfBkmkSdt** that begins at
offset **fcSttbfBkmkSdt**, and the **Plcbkfd** that begins at offset
**fcPlcfBkfSdt**, MUST contain the same number of elements.

**lcbSttbfBkmkSdt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbfBkmkSdt** at offset **fcSttbfBkmkSdt**.

**fcPlcfBkfSdt (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcbkfd** that contains information about the
structured document tag bookmarks in the document begins at this offset.
If **lcbPlcfBkfSdt** is zero, **fcPlcfBkfSdt** is undefined and MUST be
ignored.

Each data element in the **Plcbkfd** is associated, in a one-to-one
correlation, with a data element in the [**Plcbkld**](#plcbkld) at
offset **fcPlcfBklSdt**. For this reason, the **Plcbkfd** that begins at
offset **fcPlcfBkfSdt**, and the **Plcbkld** that begins at offset
**fcPlcfBklSdt**, MUST contain the same number of data elements. The
**Plcbkfd** is parallel to the **SttbfBkmkSdt** at offset
**fcSttbfBkmkSdt** in the Table Stream. Each data element in the
**Plcbkfd** specifies information about the bookmark that is associated
with the element which is located at the same offset in that
**SttbfBkmkSdt**. For this reason, the **Plcbkfd** that begins at offset
**fcPlcfBkfSdt**, and the **SttbfBkmkSdt** that begins at offset
**fcSttbfBkmkSdt**, MUST contain the same number of elements.

**lcbPlcfBkfSdt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcbkfd** at offset **fcPlcfBkfSdt**.

**fcPlcfBklSdt (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. A **Plcbkld** that contains information about the
structured document tag bookmarks in the document begins at this offset.
If **lcbPlcfBklSdt** is zero, **fcPlcfBklSdt** is undefined and MUST be
ignored.

Each data element in the **Plcbkld** is associated, in a one-to-one
correlation, with a data element in the **Plcbkfd** at offset
**fcPlcfBkfSdt**. For this reason, the **Plcbkld** that begins at offset
**fcPlcfBklSdt**, and the **Plcbkfd** that begins at offset
**fcPlcfBkfSdt** MUST contain the same number of data elements.

**lcbPlcfBklSdt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcbkld** at offset **fcPlcfBklSdt**.

**fcCustomXForm (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An array of 16-bit
[**Unicode**](#gt_c305d0ab-8b94-461a-bd76-13b40cb8c4d8) characters,
which specifies the full path and file name of the
[**XML**](#gt_982b7f8e-d516-4fd5-8d5e-1a836081ed85) Stylesheet to apply
when saving this document in XML format, begins at this offset. If
**lcbCustomXForm** is zero, **fcCustomXForm** is undefined and MUST be
ignored.

**lcbCustomXForm (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the array at offset **fcCustomXForm** in the Table
Stream. This value MUST be less than or equal to 4168 and MUST be evenly
divisible by two.

**fcSttbfBkmkProt (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. An [**SttbfBkmkProt**](#sttbfbkmkprot) that
contains information about [**range-level protection
bookmarks**](#gt_de964a62-a534-4a1d-9d49-6cadafb096be) in the document
begins at this offset. If **lcbSttbfBkmkProt** is zero,
**fcSttbfBkmkProt** is undefined and MUST be ignored.

The **SttbfBkmkProt** is parallel to the [**Plcbkf**](#plcbkf) at offset
**fcPlcfBkfProt** in the Table Stream. Each element in the
**SttbfBkmkProt** specifies information about the bookmark that is
associated with the data element which is located at the same offset in
that **Plcbkf**. For this reason, the **SttbfBkmkProt** that begins at
offset **fcSttbfBkmkProt**, and the **Plcbkf** that begins at offset
**fcPlcfBkfProt**, MUST contain the same number of elements.

**lcbSttbfBkmkProt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbfBkmkProt** at offset **fcSttbfBkmkProt**.

**fcPlcfBkfProt (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcbkf** that contains information about
range-level protection bookmarks in the document begins at this offset.
If **lcbPlcfBkfProt** is zero, then **fcPlcfBkfProt** is undefined and
MUST be ignored.

Each data element in the **Plcbkf** is associated, in a one-to-one
correlation, with a data element in the [**Plcbkl**](#plcbkl) at offset
**fcPlcfBklProt**. For this reason, the **Plcbkf** that begins at offset
**fcPlcfBkfProt**, and the **Plcbkl** that begins at offset
**fcPlcfBklProt**, MUST contain the same number of data elements. The
**Plcbkf** is parallel to the **SttbfBkmkProt** at offset
**fcSttbfBkmkProt** in the Table Stream. Each data element in the
**Plcbkf** specifies information about the bookmark that is associated
with the element which is located at the same offset in that
**SttbfBkmkProt**. For this reason, the **Plcbkf** that begins at offset
**fcPlcfBkfProt**, and the **SttbfBkmkProt** that begins at offset
**fcSttbfBkmkProt**, MUST contain the same number of elements.

**lcbPlcfBkfProt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcbkf** at offset **fcPlcfBkfProt**.

**fcPlcfBklProt (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A **Plcbkl** containing information about
range-level protection bookmarks in the document begins at this offset.
If **lcbPlcfBklProt** is zero, then **fcPlcfBklProt** is undefined and
MUST be ignored.

Each data element in the **Plcbkl** is associated in a one-to-one
correlation with a data element in the **Plcbkf** at offset
**fcPlcfBkfProt**, so the **Plcbkl** beginning at offset
**fcPlcfBklProt** and the **Plcbkf** beginning at offset
**fcPlcfBkfProt** MUST contain the same number of data elements.

**lcbPlcfBklProt (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **Plcbkl** at offset **fcPlcfBklProt**.

**fcSttbProtUser (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. A [**SttbProtUser**](#sttbprotuser) that
specifies the usernames that are used for [**range-level
protection**](#gt_d75633e6-7520-4d7f-8f7f-f4919afabed7) begins at this
offset.

**lcbSttbProtUser (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the **SttbProtUser** at the offset
**fcSttbProtUser**.

**fcUnused (4 bytes):** This value MUST be 0, and MUST be ignored.

**lcbUnused (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcPlcfpmiOld (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. Deprecated paragraph mark information cache begins
at this offset. Information SHOULD NOT<span id="Appendix_A_Target_99"
class="anchor"></span>[\<99\>](#Appendix_A_99) be emitted at this offset
and SHOULD<span id="Appendix_A_Target_100"
class="anchor"></span>[\<100\>](#Appendix_A_100) be ignored. If
**lcbPlcfpmiOld** is zero, then **fcPlcfpmiOld** is undefined and MUST
be ignored.

**lcbPlcfpmiOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated paragraph mark information cache at
offset **fcPlcfpmiOld** in the Table Stream.
SHOULD<span id="Appendix_A_Target_101"
class="anchor"></span>[\<101\>](#Appendix_A_101) be zero.

**fcPlcfpmiOldInline (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. Deprecated paragraph mark information cache
begins at this offset. Information SHOULD NOT[\<102\>](#Appendix_A_102)
be emitted at this offset and SHOULD<span id="Appendix_A_Target_103"
class="anchor"></span>\<103\> be ignored. If **lcbPlcfpmiOldInline** is
zero, then **fcPlcfpmiOldInline** is undefined and MUST be ignored.

**lcbPlcfpmiOldInline (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the deprecated paragraph mark information cache
at offset **fcPlcfpmiOldInline** in the Table Stream.
SHOULD<span id="Appendix_A_Target_104"
class="anchor"></span>[\<104\>](#Appendix_A_104) be zero.

**fcPlcfpmiNew (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. Deprecated paragraph mark information cache begins
at this offset. Information SHOULD NOT<span id="Appendix_A_Target_105"
class="anchor"></span>[\<105\>](#Appendix_A_105) be emitted at this
offset and SHOULD<span id="Appendix_A_Target_106"
class="anchor"></span>[\<106\>](#Appendix_A_106) be ignored. If
**lcbPlcfpmiNew** is zero, then **fcPlcfpmiNew** is undefined and MUST
be ignored.

**lcbPlcfpmiNew (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated paragraph mark information cache at
offset **fcPlcfpmiNew** in the Table Stream.
SHOULD<span id="Appendix_A_Target_107"
class="anchor"></span>[\<107\>](#Appendix_A_107) be zero.

**fcPlcfpmiNewInline (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. Deprecated paragraph mark information cache
begins at this offset. Information SHOULD
NOT<span id="Appendix_A_Target_108"
class="anchor"></span>[\<108\>](#Appendix_A_108) be emitted at this
offset and SHOULD<span id="Appendix_A_Target_109"
class="anchor"></span>[\<109\>](#Appendix_A_109) be ignored. If
**lcbPlcfpmiNewInline** is zero, then **fcPlcfpmiNewInline** is
undefined and MUST be ignored.

**lcbPlcfpmiNewInline (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the deprecated paragraph mark information cache
at offset **fcPlcfpmiNewInline** in the Table Stream.
SHOULD<span id="Appendix_A_Target_110"
class="anchor"></span>[\<110\>](#Appendix_A_110) be zero.

**fcPlcflvcOld (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. Deprecated **listnum** field cache begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_111"
class="anchor"></span>[\<111\>](#Appendix_A_111) be emitted at this
offset and SHOULD<span id="Appendix_A_Target_112"
class="anchor"></span>[\<112\>](#Appendix_A_112) be ignored. If
**lcbPlcflvcOld** is zero, then **fcPlcflvcOld** is undefined and MUST
be ignored.

**lcbPlcflvcOld (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated **listnum** field cache at offset
**fcPlcflvcOld** in the Table Stream.
SHOULD<span id="Appendix_A_Target_113" class="anchor"></span>[\<113\>]()
be zero.

**fcPlcflvcOldInline (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. Deprecated **listnum** field cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_114"
class="anchor"></span>[\<114\>](#Appendix_A_114) be emitted at this
offset and SHOULD<span id="Appendix_A_Target_115"
class="anchor"></span>[\<115\>](#Appendix_A_115) be ignored. If
**lcbPlcflvcOldInline** is zero, **fcPlcflvcOldInline** is undefined and
MUST be ignored.

**lcbPlcflvcOldInline (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the deprecated listnum field cache at offset
**fcPlcflvcOldInline** in the Table Stream.
SHOULD<span id="Appendix_A_Target_116"
class="anchor"></span>[\<116\>](#Appendix_A_116) be zero.

**fcPlcflvcNew (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. Deprecated **listnum** field cache begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_117"
class="anchor"></span>[\<117\>](#Appendix_A_117) be emitted at this
offset and SHOULD<span id="Appendix_A_Target_118"
class="anchor"></span>[\<118\>](#Appendix_A_118) be ignored. If
**lcbPlcflvcNew** is zero, **fcPlcflvcNew** is undefined and MUST be
ignored.

**lcbPlcflvcNew (4 bytes):** An unsigned integer that specifies the
size, in bytes, of the deprecated **listnum** field cache at offset
**fcPlcflvcNew** in the Table Stream.
SHOULD<span id="Appendix_A_Target_119"
class="anchor"></span>[\<119\>](#Appendix_A_119) be zero.

**fcPlcflvcNewInline (4 bytes):** An unsigned integer that specifies an
offset in the Table Stream. Deprecated **listnum** field cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_120"
class="anchor"></span>[\<120\>](#Appendix_A_120) be emitted at this
offset and SHOULD<span id="Appendix_A_Target_121"
class="anchor"></span>\<121\> be ignored. If **lcbPlcflvcNewInline** is
zero, **fcPlcflvcNewInline** is undefined and MUST be ignored.

**lcbPlcflvcNewInline (4 bytes):** An unsigned integer that specifies
the size, in bytes, of the deprecated **listnum** field cache at offset
**fcPlcflvcNewInline** in the Table Stream.
SHOULD<span id="Appendix_A_Target_122"
class="anchor"></span>[\<122\>](#Appendix_A_122) be zero.

**fcPgdMother (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. Deprecated document page layout cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_123"
class="anchor"></span>[<sup>\<123\></sup>](#Appendix_A_123) be emitted
at this offset and SHOULD<span id="Appendix_A_Target_124"
class="anchor"></span>[<sup>\<124\></sup>](#Appendix_A_124) be ignored.
If **lcbPgdMother** is zero, **fcPgdMother** is undefined and MUST be
ignored.

**lcbPgdMother (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated document page layout cache at offset
**fcPgdMother** in the Table Stream.

**fcBkdMother (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. Deprecated document text flow break cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_125"
class="anchor"></span>[<sup>\<125\></sup>](#Appendix_A_125) be emitted
at this offset and SHOULD<span id="Appendix_A_Target_126"
class="anchor"></span>[<sup>\<126\></sup>](#Appendix_A_126) be ignored.
If **lcbBkdMother** is zero, then **fcBkdMother** is undefined and MUST
be ignored.

**lcbBkdMother (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated document text flow break cache at offset
**fcBkdMother** in the Table Stream.

**fcAfdMother (4 bytes):** An unsigned integer that specifies an offset
in the Table Stream. Deprecated document author filter cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_127"
class="anchor"></span>[<sup>\<127\></sup>](#Appendix_A_127) be emitted
at this offset and SHOULD<span id="Appendix_A_Target_128"
class="anchor"></span>[<sup>\<128\></sup>](#Appendix_A_128) be ignored.
If **lcbAfdMother** is zero, then **fcAfdMother** is undefined and MUST
be ignored.

**lcbAfdMother (4 bytes):** An unsigned integer that specifies the size,
in bytes, of the deprecated document author filter cache at offset
**fcAfdMother** in the Table Stream.

**fcPgdFtn (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. Deprecated footnote layout cache begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_129"
class="anchor"></span>[<sup>\<129\></sup>](#Appendix_A_129) be emitted
at this offset and SHOULD<span id="Appendix_A_Target_130"
class="anchor"></span>[<sup>\<130\></sup>](#Appendix_A_130) be ignored.
If **lcbPgdFtn** is zero, then **fcPgdFtn** is undefined and MUST be
ignored.

**lcbPgdFtn (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the deprecated footnote layout cache at offset **fcPgdFtn** in
the Table Stream.

**fcBkdFtn (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. The deprecated footnote text flow break cache begins
at this offset. Information SHOULD NOT<span id="Appendix_A_Target_131"
class="anchor"></span>[<sup>\<131\></sup>](#Appendix_A_131) be emitted
at this offset and SHOULD<span id="Appendix_A_Target_132"
class="anchor"></span>[<sup>\<132\></sup>](#Appendix_A_132) be ignored.
If **lcbBkdFtn** is zero, **fcBkdFtn** is undefined and MUST be ignored.

**lcbBkdFtn (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the deprecated footnote text flow break cache at offset
**fcBkdFtn** in the Table Stream.

**fcAfdFtn (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. The deprecated footnote author filter cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_133"
class="anchor"></span>[<sup>\<133\></sup>](#Appendix_A_133) be emitted
at this offset and SHOULD<span id="Appendix_A_Target_134"
class="anchor"></span>[<sup>\<134\></sup>](#Appendix_A_134) be ignored.
If **lcbAfdFtn** is zero, **fcAfdFtn** is undefined and MUST be ignored.

**lcbAfdFtn (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the deprecated footnote author filter cache at offset
**fcAfdFtn** in the Table Stream.

**fcPgdEdn (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. The deprecated endnote layout cache begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_135"
class="anchor"></span>[<sup>\<135\></sup>](#Appendix_A_135) be emitted
at this offset and SHOULD<sup>\<136\></sup> be ignored. If **lcbPgdEdn**
is zero, then **fcPgdEdn** is undefined and MUST be ignored.

**lcbPgdEdn (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the deprecated endnote layout cache at offset **fcPgdEdn** in
the Table Stream.

**fcBkdEdn (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. The deprecated endnote text flow break cache begins at
this offset. Information SHOULD NOT<span id="Appendix_A_Target_137"
class="anchor"></span><sup>\<137\></sup> be emitted at this offset and
SHOULD<span id="Appendix_A_Target_138"
class="anchor"></span>[<sup>\<138\></sup>](#Appendix_A_138) be ignored.
If **lcbBkdEdn** is zero, **fcBkdEdn** is undefined and MUST be ignored.

**lcbBkdEdn (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the deprecated endnote text flow break cache at offset
**fcBkdEdn** in the Table Stream.

**fcAfdEdn (4 bytes):** An unsigned integer that specifies an offset in
the Table Stream. Deprecated endnote author filter cache begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_139"
class="anchor"></span>[<sup>\<139\></sup>](#Appendix_A_139) be emitted
at this offset and SHOULD<span id="Appendix_A_Target_140"
class="anchor"></span>[<sup>\<140\></sup>](#Appendix_A_140) be ignored.
If **lcbAfdEdn** is zero, then **fcAfdEdn** is undefined and MUST be
ignored.

**lcbAfdEdn (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the deprecated endnote author filter cache at offset
**fcAfdEdn** in the Table Stream.

**fcAfd (4 bytes):** An unsigned integer that specifies an offset in the
Table Stream. A deprecated [**AFD**](#afd) structure begins at this
offset. Information SHOULD NOT<span id="Appendix_A_Target_141"
class="anchor"></span>[\<141\>](#Appendix_A_141) be emitted at this
offset and SHOULD<span id="Appendix_A_Target_142"
class="anchor"></span>[\<142\>](#Appendix_A_142) be ignored. If
**lcbAfd** is zero, **fcAfd** is undefined and MUST be ignored.

**lcbAfd (4 bytes):** An unsigned integer that specifies the size, in
bytes, of the deprecated **AFD** structure at offset **fcAfd** in the
Table Stream.

### FibRgFcLcb2007

The **FibRgFcLcb2007** structure is a variable-sized portion of the
[Fib](#fib). It extends the [FibRgFcLcb2003](#fibrgfclcb2003).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rgFcLcb2003 (1312 bytes) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfmthd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfmthd |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmkMoveFrom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmkMoveFrom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkfMoveFrom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkfMoveFrom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBklMoveFrom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBklMoveFrom |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmkMoveTo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmkMoveTo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkfMoveTo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkfMoveTo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBklMoveTo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBklMoveTo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcSttbfBkmkArto |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbSttbfBkmkArto |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBkfArto |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBkfArto |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcPlcfBklArto |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbPlcfBklArto |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcArtoData |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbArtoData |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcUnused6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbUnused6 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcOssTheme |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbOssTheme |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| fcColorSchemeMapping |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lcbColorSchemeMapping |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**rgFcLcb2003 (1312 bytes):** The contained **FibRgFcLcb2003**.

**fcPlcfmthd (4 bytes):** This value is undefined and MUST be ignored.

**lcbPlcfmthd (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcSttbfBkmkMoveFrom (4 bytes):** This value is undefined and MUST be
ignored.

**lcbSttbfBkmkMoveFrom (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcPlcfBkfMoveFrom (4 bytes):** This value is undefined and MUST be
ignored

**lcbPlcfBkfMoveFrom (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcPlcfBklMoveFrom (4 bytes):** This value is undefined and MUST be
ignored.

**lcbPlcfBklMoveFrom (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcSttbfBkmkMoveTo (4 bytes):** This value is undefined and MUST be
ignored.

**lcbSttbfBkmkMoveTo (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcPlcfBkfMoveTo (4 bytes):** This value is undefined and MUST be
ignored.

**lcbPlcfBkfMoveTo (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcPlcfBklMoveTo (4 bytes):** This value is undefined and MUST be
ignored.

**lcbPlcfBklMoveTo (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcUnused1 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused1 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcUnused2 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused2 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcUnused3 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused3 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcSttbfBkmkArto (4 bytes):** This value is undefined and MUST be
ignored.

**lcbSttbfBkmkArto (4 bytes):** This value MUST be 0, and MUST be
ignored.

**fcPlcfBkfArto (4 bytes):** This value is undefined and MUST be
ignored.

**lcbPlcfBkfArto (4 bytes):** This value MUST be 0, and MUST be ignored

**fcPlcfBklArto (4 bytes):** Undefined and MUST be ignored.

**lcbPlcfBklArto (4 bytes):** MUST be zero, and MUST be ignored.

**fcArtoData (4 bytes):** This value is undefined and MUST be ignored.

**lcbArtoData (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcUnused4 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused4 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcUnused5 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused5 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcUnused6 (4 bytes):** This value is undefined and MUST be ignored.

**lcbUnused6 (4 bytes):** This value MUST be 0, and MUST be ignored.

**fcOssTheme (4 bytes):** This value is undefined and MUST be ignored.

**lcbOssTheme (4 bytes):** This value SHOULD[\<143\>](#Appendix_A_143)
be zero, and MUST be ignored.

**fcColorSchemeMapping (4 bytes):** This value is undefined and MUST be
ignored.

**lcbColorSchemeMapping (4 bytes):** This value
SHOULD<span id="Appendix_A_Target_144"
class="anchor"></span>[\<144\>](#Appendix_A_144) be zero, and MUST be
ignored.

### FibRgCswNew

The **FibRgCswNew** structure is an extension to the [**Fib**](#fib)
structure that exists only if **Fib**.**cswNew** is nonzero.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nFibNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | rgCswNewData (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**nFibNew (2 bytes):** An unsigned integer that specifies the version
number of the file format that is used. This value MUST be one of the
following.

| Value  |
|--------|
| 0x00D9 |
| 0x0101 |
| 0x010C |
| 0x0112 |

**rgCswNewData (variable):** Depending on the value of **nFibNew** this
is one of the following.

| Value of nFibNew | Meaning                                               |
|------------------|-------------------------------------------------------|
| 0x00D9           | [fibRgCswNewData2000](#fibrgcswnewdata2000) (2 bytes) |
| 0x0101           | fibRgCswNewData2000 (2 bytes)                         |
| 0x010C           | fibRgCswNewData2000 (2 bytes)                         |
| 0x0112           | [fibRgCswNewData2007](#fibrgcswnewdata2007) (8 bytes) |

### FibRgCswNewData2000

The **FibRgCswNewData2000** structure is a variable-sized portion of the
[Fib](#fib).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cQuickSavesNew |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**cQuickSavesNew (2 bytes):** An unsigned integer that specifies the
number of times that this document was incrementally saved since the
last [**full save**](#gt_83dde85c-7bbe-448d-8fc9-ef0a5c7f7a31). This
value MUST be between 0 and 0x000F, inclusively.

### FibRgCswNewData2007

The **FibRgCswNewData2007** structure is a variable-sized portion of the
[Fib](#fib). It extends the [FibRgCswNewData2000](#fibrgcswnewdata2000).


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rgCswNewData2000 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | lidThemeOther |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| lidThemeFE |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | lidThemeCS |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**rgCswNewData2000 (2 bytes):** The contained **FibRgCswNewData2000**.

**lidThemeOther (2 bytes):** This value is undefined and MUST be
ignored.

**lidThemeFE (2 bytes):** This value is undefined and MUST be ignored.

**lidThemeCS (2 bytes):** This value is undefined and MUST be ignored.

### Determining the nFib

The **nFib** value specifies the version number of the file format that
is used. The proper **nFib** value for the current document is
determined in the following way:

1.  Read the [**FIB**](#fib) from offset zero in the [WordDocument
    Stream](#Section_d7fae142670d4cd5869a708366984a71).

2.  Check the value of FIB.cswNew.

- If the value is 0, **nFib** is specified by
  **[FibBase](#fibbase).nFib.**

- Otherwise, the value is not 0 and **nFib** is specified by
  **[FibRgCswNew](#fibrgcswnew).nFibNew.**

### How to read the FIB

The [**Fib**](#fib) structure is located at offset 0 of the
[WordDocument Stream](#Section_d7fae142670d4cd5869a708366984a71). Given
the variable size of the **Fib**, the proper way to load it is the
following:

1.  Set all bytes of the in-memory version of the **Fib** being used
    to 0. It is recommended to use the largest version of the **Fib**
    structure as the in-memory version.

2.  Read the entire [**FibBase**](#fibbase), which MUST be present and
    has fixed size.

3.  Read **Fib.csw**.

4.  Read the minimum of **Fib.csw** \* 2 bytes and the size, in bytes,
    of the in-memory version of [**FibRgW97**](#fibrgw97) into
    **FibRgW97**.

5.  If the application expects fewer bytes than indicated by
    **Fib.csw**, advance by the difference thereby skipping the unknown
    portion of **FibRgW97**.

6.  Read **Fib.cslw**.

7.  Read the minimum of **Fib.cslw** \* 4 bytes and the size, in bytes,
    of the in-memory version of [**FibRgLw97**](#fibrglw97) into
    **FibRgLw97**.

8.  If the application expects fewer bytes than indicated by
    **Fib.cslw**, advance by the difference thereby skipping the unknown
    portion of **FibRgLw97**.

9.  Read **Fib.cbRgFcLcb**.

10. Read the minimum of **Fib.cbRgFcLcb** \* 8 bytes and the size, in
    bytes, of the in-memory version of [**FibRgFcLcb**](#fibrgfclcb)
    into **FibRgFcLcb**.

11. If the application expects fewer bytes than indicated by
    **Fib.cbRgFcLcb**, advance by the difference, thereby skipping the
    unknown portion of **FibRgFcLcb**.

12. Read **Fib**.**cswNew**.

13. Read the minimum of **Fib.cswNew** \* 2 bytes and the size, in
    bytes, of the in-memory version of [**FibRgCswNew**](#fibrgcswnew)
    into **FibRgCswNew**.
