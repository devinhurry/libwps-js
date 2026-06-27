# Appendix A: Product Behavior

The information in this specification is applicable to the following
Microsoft products or supplemental software. References to product
versions include updates to those products.

- Microsoft Word 97

- Microsoft Word 2000

- Microsoft Word 2002

- Microsoft Office Word 2003

- Microsoft Office Word 2007

- Microsoft Word 2010

- Microsoft Word 2013

- Microsoft Word 2016

- Microsoft Word 2019

- Microsoft Word 2021

- Microsoft Word LTSC 2024

Exceptions, if any, are noted in this section. If an update version,
service pack or Knowledge Base (KB) number appears with a product name,
the behavior changed in that update. The new behavior also applies to
subsequent updates unless otherwise specified. If a product edition
appears with the product version, behavior is different in that product
edition.

Unless otherwise specified, any statement of optional behavior in this
specification that is prescribed using the terms "SHOULD" or "SHOULD
NOT" implies product behavior in accordance with the SHOULD or SHOULD
NOT prescription. Unless otherwise specified, the term "MAY" implies
that the product does not follow the prescription.

[\<1\> Section 2.1.4.3](#Appendix_A_Target_1): Word 97 and Word 2000 do
not generate this stream when saving files and ignore it when loading
files. Word 2002, Office Word 2003, Office Word 2007, Word 2010, and
later read this stream when loading files and generate it when saving
files if the object supports a separate print presentation and provides
that presentation in Enhanced Metafile format.

[\<2\> Section 2.1.10](#Appendix_A_Target_2): Office Word 2007, Word
2010, and later read this storage. Word 97, Word 2000, Word 2002, and
Office Word 2003 ignore it.

[\<3\> Section 2.1.11](#Appendix_A_Target_3): Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later read this stream. Word 97
and Word 2000 ignore it.

[\<4\> Section 2.1.12](#Appendix_A_Target_4): Office Word 2003, Office
Word 2007, Word 2010, and later read streams and storages from inside
the [Protected Content
Stream](#Section_4e67943d659a4b349e0376cb4a6c40fb). Word 97, Word 2000,
and Word 2002 ignore the Information Rights Management Data Space
Storage and the Protected Content Stream.

[\<5\> Section 2.1.12](#Appendix_A_Target_5): Office Word 2003, Office
Word 2007, Word 2010, and later ignore streams and storages which
instead are read from inside the Protected Content Stream. Word 97, Word
2000, and Word 2002 ignore the Protected Content Stream and read
storages and streams located outside the Protected Content Stream.

[\<6\> Section 2.2.5](#Appendix_A_Target_6): The following table lists
the ranges of **[Sprm](#sprm).ispmd** that each version of Microsoft
Word processes. All versions of Microsoft Word skip [Prl](#prl)s that
they cannot process.


| Version | Sprm.sgc | Range of Sprm.ispmd processed |
| --- | --- | --- |
| Word 97 | 1 (paragraph) | 0x00 – 0x48 |
|  | 2 (character) | 0x00 – 0x10, 0x30 – 0x6F |
|  | 3 (picture) | 0x00 – 0x07 |
|  | 4 (section) | 0x00 – 0x33 |
|  | 5 (table) | 0x00 – 0x0C, 0x20, 0x2C |
| Word 2000 | 1 (paragraph) | 0x00 – 0x63 |
|  | 2 (character) | 0x00 – 0x13, 0x30 – 0x81 |
|  | 3 (picture) | 0x00 – 0x0B |
|  | 4 (section) | 0x00 – 0x38 |
|  | 5 (table) | 0x00 – 0x39, 0x60 – 0x65 |
| Word 2002 | 1 (paragraph) | 0x00 – 0x6E |
|  | 2 (character) | 0x00 – 0x18, 0x30 – 0x88 |
|  | 3 (picture) | 0x00 – 0x0B |
|  | 4 (section) | 0x00 – 0x42 |
|  | 5 (table) | 0x00 – 0x3D, 0x60 – 0x8A |
| Office Word 2003 | 1 (paragraph) | 0x00 – 0x6F |
|  | 2 (character) | 0x00 – 0x18, 0x30 – 0x89, 0x90 |
|  | 3 (picture) | 0x00 – 0x0B |
|  | 4 (section) | 0x00 – 0x43 |
|  | 5 (table) | 0x00 – 0x3E, 0x60 – 0x90 |
| Office Word 2007, / Word 2010, / and later | 1 (paragraph) | 0x00 – 0x73 |
|  | 2 (character) | 0x00 – 0x1D, 0x30 – 0x89, 0x90 – 0x95 |
|  | 3 (picture) | 0x00 – 0x0B |
|  | 4 (section) | 0x00 – 0x44 |
|  | 5 (table) | 0x00 – 0x42, 0x60 – 0x90 |



[\<7\> Section 2.2.6](#Appendix_A_Target_7): Word 97 and Word 2000
cannot open files which are password protected with Office binary
document RC4 CryptoAPI encryption.

[\<8\> Section 2.2.6.3](#Appendix_A_Target_8): Neither Word 97 nor Word
2000 support this encryption method.

\<9\> Section 2.4.3: Word 97 and Word 2000 require that each row have
[sprmTDefTable](#table-properties) applied. These versions do not
process [sprmPTableProps](#paragraph-properties). Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later require sprmTDefTable or
sprmTInsert. These versions do process sprmPTableProps.

A sprmTDefTable applied to a TTP mark overrides any formatting inherited
from the table style. Word 97 and Word 2000 do not have a table style
feature. For this reason, Word 2002, Office Word 2003, Office Word 2007,
Word 2010, and later only emit sprmTDefTable for versions that do not
process sprmPTableProps.

If an application does not emit sprmTDefTable for the benefit of readers
that do not process sprmPTableProps, the documents that are generated by
that application are not compatible with Word 97 or Word 2000.

[\<10\> Section 2.4.6](#Appendix_A_Target_10): Word 97 and Word 2000 do
not support table styles, and thus ignore sprmTIstd, among others.
sprmPTableProps can be used to separate Prls intended for Word 97 and
Word 2000 from those intended for all other versions, as specified in
section [2.4.3](#Section_5b45f0e777604fdbaf880146de2feb4c), Overview of
Tables.

[\<11\> Section 2.5.2](#Appendix_A_Target_11): A special empty document
is installed with Word 97, Word 2000, Word 2002, and Office Word 2003 to
allow "Create New Word Document" from the operating system. This
document has an nFib of 0x00C0. In addition the BiDi build of Word 97
differentiates its documents by saving 0x00C2 as the nFib. In both cases
treat them as if they were 0x00C1.

[\<12\> Section 2.5.2](#Appendix_A_Target_12): Picture watermarks could
be present in the document even if **fHasPic** is 0.

[\<13\> Section 2.5.2](#Appendix_A_Target_13): The **nFibBack** field is
treated as if it is set to 0x00BF when a locale-specific version of Word
97 sets it to 0x00C1.

[\<14\> Section 2.5.2](#Appendix_A_Target_14): Word 97, Word 2000, Word
2002, and Office Word 2003 install a minimal .doc file for use with the
New- Microsoft Word Document of the shell. This minimal .doc file has
**fEmptySpecial** set to 1.

[\<15\> Section 2.5.2](#Appendix_A_Target_15): Word uses this flag to
identify a document that was created by using the New – Microsoft Word
Document of the operating system shell.

[\<16\> Section 2.5.3](#Appendix_A_Target_16): Word 97 and Word 2000 can
put a value here when performing an [**incremental
save**](#gt_1aa4deeb-8e50-4699-8e40-2c0719250cbb)
([FibBase](#fibbase).**fComplex**).

\<17\> Section 2.5.3: Word 97 and Word 2000 can put a value here when
performing an incremental save (FibBase.**fComplex**).

[\<18\> Section 2.5.3](#Appendix_A_Target_18): Word 97 and Word 2000 can
put a value here when performing an incremental save
(FibBase.**fComplex**).

[\<19\> Section 2.5.3](#Appendix_A_Target_19): Word 97 and Word 2000 can
put a value here when performing an incremental save
(FibBase.**fComplex**).

[\<20\> Section 2.5.3](#Appendix_A_Target_20): Word 97 and Word 2000 can
put a value here when performing an incremental save
(FibBase.**fComplex**).

[\<21\> Section 2.5.3](#Appendix_A_Target_21): Word 97 and Word 2000 can
put a value here when performing an incremental save
(FibBase.**fComplex**).

[\<22\> Section 2.5.3](#Appendix_A_Target_22): Word 97 and Word 2000 can
put a value here when performing an incremental save
(FibBase.**fComplex**).

[\<23\> Section 2.5.3](#): Word 97 and Word 2000 can put a value here
when performing an incremental save (FibBase.**fComplex**).

[\<24\> Section 2.5.3](#Appendix_A_Target_24): Word 97 and Word 2000 can
put a value here when performing an incremental save
(FibBase.**fComplex**).

[\<25\> Section 2.5.4](#Appendix_A_Target_25): Word 97, Word 2000, Word
2002, and Office Word 2003 write a nonzero value here when saving a
document template with changes that require the saving of an AutoText
document.

[\<26\> Section 2.5.6](#Appendix_A_Target_26): Word 97, Word 2000, and
Word 2002 emit this information when performing an incremental save.
Office Word 2003, Office Word 2007, Word 2010, and later do not emit
this information.

[\<27\> Section 2.5.6](#Appendix_A_Target_27): Word 97 reads this
information if **FibBase.nFib** is 193. Word 2000 reads this information
if **[FibRgCswNew](#fibrgcswnew).nFibNew** is 217. Word 2002 reads this
information if **FibRgCswNew.nFibNew** is 257. Office Word 2003, Office
Word 2007, Word 2010, and later do not read this information.

[\<28\> Section 2.5.6](#Appendix_A_Target_28): Office Word 2007, Word
2010, and later ignore this data.

[\<29\> Section 2.5.6](#Appendix_A_Target_29): Word 97 emits information
at offset **fcPgdMotherOldOld**. Neither Word 2000, Word 2002, Office
Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later emit
this information.

[\<30\> Section 2.5.6](#Appendix_A_Target_30): Word 97 reads this
information. Word 2000, Word 2002, Office Word 2003, Office Word 2007,
Word 2010, and later ignore this information.

[\<31\> Section 2.5.6](#Appendix_A_Target_31): Word 97 emits information
at offset **fcBkdMotherOldOld**. Neither Word 2000, Word 2002, Office
Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later emit
this information.

[\<32\> Section 2.5.6](#Appendix_A_Target_32): Word 97 reads this
information. Word 2000, Word 2002, Office Word 2003, Office Word 2007,
Word 2010, and later ignore this information.

[\<33\> Section 2.5.6](#Appendix_A_Target_33): Word 97 emits information
at offset **fcPgdFtnOldOld**. Neither Word 2000, Word 2002, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<34\> Section 2.5.6](#Appendix_A_Target_34): Word 97 reads this
information. Word 2000, Word 2002, Office Word 2003, Office Word 2007,
Word 2010, and later ignore this information.

[\<35\> Section 2.5.6](#Appendix_A_Target_35): Word 97 emits information
at offset **fcBkdFtnOldOld**. Neither Word 2000, Word 2002, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<36\> Section 2.5.6](#Appendix_A_Target_36): Word 97 reads this
information. Word 2000, Word 2002, Office Word 2003, Office Word 2007,
Word 2010, and later ignore this information.

[\<37\> Section 2.5.6](#Appendix_A_Target_37): Word 97 emits information
at offset **fcPgdEdnOldOld**. Neither Word 2000, Word 2002, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

\<38\> Section 2.5.6: Word 97 reads this information. Word 2000, Word
2002, Office Word 2003, Office Word 2007, Word 2010, and later ignore
this information.

[\<39\> Section 2.5.6](#Appendix_A_Target_39): Word 97 emits information
at offset **fcBkdEdnOldOld**. Neither Word 2000, Word 2002, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<40\> Section 2.5.6](#Appendix_A_Target_40): Only Word 97 reads this
information.

[\<41\> Section 2.5.6](#Appendix_A_Target_41): fcRouteSlip is only saved
and read by Word 97, Word 2000, Word 2002, and Office Word 2003.

[\<42\> Section 2.5.6](#Appendix_A_Target_42): SttbSavedBy is only saved
and read by Word 97 and Word 2000.

[\<43\> Section 2.5.6](#Appendix_A_Target_43): SttbSavedBy is only saved
and read by Word 97 and Word 2000.

[\<44\> Section 2.5.6](#Appendix_A_Target_44): Word 97 and Word 2000
write this information when the user chooses to save versions in the
document. Word 2002, Office Word 2003, Office Word 2007, Word 2010, and
later do not write this information.

[\<45\> Section 2.5.6](#Appendix_A_Target_45): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

[\<46\> Section 2.5.6](#Appendix_A_Target_46): Word 97, Word 2000, Word
2002, and Office Word 2003 write this information when the user chooses
to save versions in the document. Neither Office Word 2007, Word 2010,
nor Word 2013 and later write this information.

[\<47\> Section 2.5.6](#Appendix_A_Target_47): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

[\<48\> Section 2.5.6](#Appendix_A_Target_48): Word 97, Word 2000, Word
2002, and Office Word 2003 write this information when the user chooses
to save versions in the document. Neither Office Word 2007, Word 2010,
nor Word 2013 and later write this information.

[\<49\> Section 2.5.6](#Appendix_A_Target_49): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

[\<50\> Section 2.5.6](#Appendix_A_Target_50): Word 97, Word 2000, Word
2002, and Office Word 2003 write this information when the user chooses
to save versions in the document. Neither Office Word 2007, Word 2010,
nor Word 2013 and later write this information.

[\<51\> Section 2.5.6](#Appendix_A_Target_51): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

[\<52\> Section 2.5.6](#Appendix_A_Target_52): Word 97, Word 2000, Word
2002, and Office Word 2003 write this information when the user chooses
to save versions in the document. Neither Office Word 2007, Word 2010,
nor Word 2013 and later write this information.

[\<53\> Section 2.5.6](#Appendix_A_Target_53): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

[\<54\> Section 2.5.6](#Appendix_A_Target_54): Word 97, Word 2000, Word
2002, and Office Word 2003 write this information when the user chooses
to save versions in the document. Neither Office Word 2007, Word 2010,
nor Word 2013 and later write this information.

[\<55\> Section 2.5.6](#Appendix_A_Target_55): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

\<56\> Section 2.5.6: Word 97, Word 2000, Word 2002, and Office Word
2003 write this information. Neither Office Word 2007, Word 2010, nor
Word 2013 and later write this information.

[\<57\> Section 2.5.6](#Appendix_A_Target_57): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

[\<58\> Section 2.5.6](#Appendix_A_Target_58): Word 97, Word 2000, Word
2002, and Office Word 2003 write the size of the deprecated numbering
field cache at offset **fcPlcfBteLvc** in the [Table
Stream](#Section_44f62054d9114989946ca42100c26a15). Office Word 2007,
Word 2010, and later write zero.

[\<59\> Section 2.5.6](#Appendix_A_Target_59): Word 97 emits information
at offset **fcPlcfLvcPre10** when performing an incremental save. Word
2000 emits information at offset **fcPlcfLvcPre10** on every save.
Neither Word 2002, Office Word 2003, Office Word 2007, Word 2010, nor
Word 2013 and later emit information at offset **fcPlcfLvcPre10** and
the value of **fcPlcfLvcPre10** is undefined.

[\<60\> Section 2.5.6](#Appendix_A_Target_60): Word 97 and Word 2000
read this information. Word 2002, Office Word 2003, Office Word 2007,
Word 2010, and later ignore it.

[\<61\> Section 2.5.6](#Appendix_A_Target_61): Word 97 and Word 2000
write **lcbPlcfLvcPre10** with the size, in bytes, of the information
emitted at offset **fcPlcfLvcPre10**. Word 2002, Office Word 2003,
Office Word 2007, Word 2010, and later write 0 to **lcbPlcfLvcPre10**.

[\<62\> Section 2.5.6](#Appendix_A_Target_62): Word 97, Word 2000, Word
2002, and Office Word 2003 write this information when the user chooses
to save versions in the document. Neither Office Word 2007, Word 2010,
nor Word 2013 and later write this information.

[\<63\> Section 2.5.6](#Appendix_A_Target_63): Word 97, Word 2000, Word
2002, and Office Word 2003 read this information. Office Word 2007, Word
2010, and later ignore it.

[\<64\> Section 2.5.7](#Appendix_A_Target_64): Office Word 2007, Word
2010, and later ignore this information. Word 2000, Word 2002, and
Office Word 2003 read this information, however the information is an
optional, deprecated cache that can be calculated by reading the
document content.

[\<65\> Section 2.5.7](#Appendix_A_Target_65): Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later ignore this value.

[\<66\> Section 2.5.7](#Appendix_A_Target_66): Word 2000 and Word 2002
emit information at offset **fcPgdMotherOld**. Neither Word 97, Office
Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later emit
this information.

[\<67\> Section 2.5.7](#Appendix_A_Target_67): Word 2000 and Word 2002
read this information. Word 97, Office Word 2003, Office Word 2007, Word
2010, and later ignore this information.

[\<68\> Section 2.5.7](#Appendix_A_Target_68): Word 2000 and Word 2002
emit information at offset **fcBkdMotherOld**. Neither Word 97, Office
Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later emit
this information.

[\<69\> Section 2.5.7](#Appendix_A_Target_69): Word 2000 and Word 2002
read this information. Word 97, Office Word 2003, Office Word 2007, Word
2010, and later ignore this information.

[\<70\> Section 2.5.7](#Appendix_A_Target_70): Word 2000 and Word 2002
emit information at offset **fcPgdFtnOld**. Neither Word 97, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<71\> Section 2.5.7](#Appendix_A_Target_71): Word 2000 and Word 2002
read this information. Word 97, Office Word 2003, Office Word 2007, Word
2010, and later ignore this information.

[\<72\> Section 2.5.7](#Appendix_A_Target_72): Word 2000 and Word 2002
emit information at offset **fcBkdFtnOld**. Neither Word 97, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<73\> Section 2.5.7](): Word 2000 and Word 2002 read this information.
Word 97, Office Word 2003, Office Word 2007, Word 2010, and later ignore
this information.

[\<74\> Section 2.5.7](#Appendix_A_Target_74): Word 2000 and Word 2002
emit information at offset **fcPgdEdnOld**. Neither Word 97, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<75\> Section 2.5.7](#Appendix_A_Target_75): Word 2000 and Word 2002
read this information. Word 97, Office Word 2003, Office Word 2007, Word
2010, and later ignore this information.

[\<76\> Section 2.5.7](#Appendix_A_Target_76): Word 2000 and Word 2002
emit information at offset **fcBkdEdnOld**. Neither Word 97, Office Word
2003, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<77\> Section 2.5.7](#Appendix_A_Target_77): Word 2000 and Word 2002
read this information. Word 97, Office Word 2003, Office Word 2007, Word
2010, and later ignore this information.

[\<78\> Section 2.5.8](#Appendix_A_Target_78): Office Word 2007, Word
2010, and later ignore this value.

[\<79\> Section 2.5.8](#Appendix_A_Target_79): Word 2002 and Office Word
2003 write this information when the user chooses to save versions in
the document. Neither Word 97, Word 2000, Office Word 2007, Word 2010,
nor Word 2013 and later write this information.

[\<80\> Section 2.5.8](#Appendix_A_Target_80): Word 2002 and Office Word
2003 read this information. Word 97, Word 2000, Office Word 2007, Word
2010, and later ignore it.

[\<81\> Section 2.5.8](#Appendix_A_Target_81): Word 2002 emits
information at offset **fcPlcfpmiOldXP**. Neither Word 97, Word 2000,
Office Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later
emit information at this offset and the value of **fcPlcfpmiOldXP** is
undefined.

[\<82\> Section 2.5.8](#Appendix_A_Target_82): Word 2002 reads this
information. Word 97, Word 2000, Office Word 2003, Office Word 2007,
Word 2010, and later ignore it.

[\<83\> Section 2.5.8](#Appendix_A_Target_83): Word 2002 writes
**lcbPlcfpmiOldXP** with the size, in bytes, of the information emitted
at offset **fcPlcfpmiOldXP**. Office Word 2003, Office Word 2007, Word
2010, and later write 0 to **lcbPlcfpmiOldXP**. Neither Word 97 nor Word
2000 write a [**FibRgFcLcb2002**](#fibrgfclcb2002).

\<84\> Section 2.5.8: Word 2002 emits information at offset
**fcPlcfpmiNewXP**. Neither Word 97, Word 2000, Office Word 2003, Office
Word 2007, Word 2010, nor Word 2013 and later emit information at this
offset and the value of **fcPlcfpmiNewXP** is undefined.

[\<85\> Section 2.5.8](#Appendix_A_Target_85): Word 2002 reads this
information. Word 97, Word 2000, Office Word 2003, Office Word 2007,
Word 2010, and later ignore it.

[\<86\> Section 2.5.8](#Appendix_A_Target_86): Word 2002 writes
**lcbPlcfpmiNewXP** with the size, in bytes, of the information emitted
at offset **fcPlcfpmiNewXP**. Office Word 2003, Office Word 2007, Word
2010, and later write 0 to **lcbPlcfpmiNewXP**. Neither Word 97 nor Word
2000 write a **FibRgFcLcb2002**.

[\<87\> Section 2.5.8](#Appendix_A_Target_87): Word 2002 emits
information at offset **fcPlcfpmiMixedXP**. Neither Word 97, Word 2000,
Office Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later
emit information at this offset and the value of **fcPlcfpmiMixedXP** is
undefined.

[\<88\> Section 2.5.8](#Appendix_A_Target_88): Word 2002 reads this
information. Word 97, Word 2000, Office Word 2003, Office Word 2007,
Word 2010, and later ignore it.

[\<89\> Section 2.5.8](#): Word 2002 writes **lcbPlcfpmiMixedXP** with
the size, in bytes, of the information emitted at offset
**fcPlcfpmiMixedXP**. Office Word 2003, Office Word 2007, Word 2010, and
later write 0 to **lcbPlcfpmiMixedXP**. Neither Word 97 nor Word 2000
write a **FibRgFcLcb2002**.

[\<90\> Section 2.5.8](#Appendix_A_Target_90): Word 2002 emits
information at offset **fcPlcflvcOldXP**. Neither Word 97, Word 2000,
Office Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later
emit information at this offset and the value of **fcPlcflvcOldXP** is
undefined.

[\<91\> Section 2.5.8](#Appendix_A_Target_91): Word 2002 reads this
information. Word 97, Word 2000, Office Word 2003, Office Word 2007,
Word 2010, and later ignore it.

[\<92\> Section 2.5.8](#Appendix_A_Target_92): Word 2002 writes
**lcbPlcflvcOldXP** with the size, in bytes, of the information emitted
at offset **fcPlcflvcOldXP**. Office Word 2003, Office Word 2007, Word
2010, and later write 0 to **lcbPlcflvcOldXP**. Neither Word 97 nor Word
2000 write a **FibRgFcLcb2002**.

[\<93\> Section 2.5.8](#Appendix_A_Target_93): Word 2002 emits
information at offset **fcPlcflvcNewXP**. Neither Word 97, Word 2000,
Office Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later
emit information at this offset and the value of **fcPlcflvcNewXP** is
undefined.

[\<94\> Section 2.5.8](#Appendix_A_Target_94): Word 2002 reads this
information. Word 97, Word 2000, Office Word 2003, Office Word 2007,
Word 2010, and later ignore it.

[\<95\> Section 2.5.8](#Appendix_A_Target_95): Word 2002 writes
**lcbPlcflvcNewXP** with the size, in bytes, of the information emitted
at offset **fcPlcflvcNewXP**. Office Word 2003, Office Word 2007, Word
2010, and later write 0 to **lcbPlcflvcNewXP**. Neither Word 97 nor Word
2000 write a **FibRgFcLcb2002**.

[\<96\> Section 2.5.8](#Appendix_A_Target_96): Word 2002 emits
information at offset **fcPlcflvcMixedXP**. Neither Word 97, Word 2000,
Office Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later
emit information at this offset and the value of **fcPlcflvcMixedXP** is
undefined.

[\<97\> Section 2.5.8](#Appendix_A_Target_97): Word 2002 reads this
information. Word 97, Word 2000, Office Word 2003, Office Word 2007,
Word 2010, and later ignore it.

[\<98\> Section 2.5.8](#Appendix_A_Target_98): Word 2002 writes
**lcbPlcflvcMixedXP** with the size, in bytes, of the information
emitted at offset **fcPlcflvcMixedXP**. Office Word 2003, Office Word
2007, Word 2010, and later write 0 to **lcbPlcflvcMixedXP**. Neither
Word 97 nor Word 2000 write a **FibRgFcLcb2002**.

[\<99\> Section 2.5.9](#Appendix_A_Target_99): Only Office Word 2003
emits information at offset **fcPlcfpmiOld**; Neither Office Word 2007,
Word 2010, nor Word 2013 and later emit information at this offset and
the value of **fcPlcfpmiOld** is undefined.

[\<100\> Section 2.5.9](#Appendix_A_Target_100): Only Office Word 2003
reads this information.

[\<101\> Section 2.5.9](#Appendix_A_Target_101): Office Word 2003 writes
**lcbPlcfpmiOld** with the size, in bytes, of the information emitted at
offset **fcPlcfpmiOld**; Office Word 2007, Word 2010, and later write 0
to **lcbPlcfpmiOld**.

\<102\> Section 2.5.9: Only Office Word 2003 emits information at offset
**fcPlcfpmiOldInline**; Neither Office Word 2007, Word 2010, nor Word
2013 and later emit information at this offset and the value of
**fcPlcfpmiOldInline** is undefined.

[\<103\> Section 2.5.9](#Appendix_A_Target_103): Only Office Word 2003
reads this information.

[\<104\> Section 2.5.9](#Appendix_A_Target_104): Office Word 2003 writes
**lcbPlcfpmiOldInline** with the size, in bytes, of the information
emitted at offset **fcPlcfpmiOldInline**; Office Word 2007, Word 2010,
and later write 0 to **lcbPlcfpmiOldInline**.

[\<105\> Section 2.5.9](#Appendix_A_Target_105): Only Office Word 2003
emits information at offset **fcPlcfpmiNew**; Neither Office Word 2007,
Word 2010, nor Word 2013 and later emit information at this offset and
the value of **fcPlcfpmiNew** is undefined.

[\<106\> Section 2.5.9](#Appendix_A_Target_106): Only Office Word 2003
reads this information.

[\<107\> Section 2.5.9](#Appendix_A_Target_107): Office Word 2003 writes
**lcbPlcfpmiNew** with the size, in bytes, of the information emitted at
offset **fcPlcfpmiNew**; Office Word 2007, Word 2010, and later write 0
to **lcbPlcfpmiNew**.

[\<108\> Section 2.5.9](#Appendix_A_Target_108): Only Office Word 2003
emits information at offset **fcPlcfpmiNewInline**; Neither Office Word
2007, Word 2010, nor Word 2013 and later emit information at this offset
and the value of **fcPlcfpmiNewInline** is undefined.

[\<109\> Section 2.5.9](#Appendix_A_Target_109): Only Office Word 2003
reads this information.

[\<110\> Section 2.5.9](#Appendix_A_Target_110): Office Word 2003 writes
**lcbPlcfpmiNewInline** with the size, in bytes, of the information
emitted at offset **fcPlcfpmiNewInline**; Office Word 2007, Word 2010,
and later write 0 to **lcbPlcfpmiNewInline**.

[\<111\> Section 2.5.9](#Appendix_A_Target_111): Only Office Word 2003
emits information at offset **fcPlcflvcOld**; Neither Office Word 2007,
Word 2010, nor Word 2013 and later emit information at this offset and
the value of **fcPlcflvcOld** is undefined.

[\<112\> Section 2.5.9](#Appendix_A_Target_112): Only Office Word 2003
reads this information.

[\<113\> Section 2.5.9](#Appendix_A_Target_113): Office Word 2003 writes
**lcbPlcflvcOld** with the size, in bytes, of the information emitted at
offset **fcPlcflvcOld**; Office Word 2007, Word 2010, and later write 0
to **lcbPlcflvcOld**.

[\<114\> Section 2.5.9](#Appendix_A_Target_114): Only Office Word 2003
emits information at offset **fcPlcflvcOldInline**; Neither Office Word
2007, Word 2010, nor Word 2013 and later emit information at this offset
and the value of **fcPlcflvcOldInline** is undefined.

[\<115\> Section 2.5.9](#Appendix_A_Target_115): Only Office Word 2003
reads this information.

[\<116\> Section 2.5.9](#Appendix_A_Target_116): Office Word 2003 writes
**lcbPlcflvcOldInline** with the size, in bytes, of the information
emitted at offset **fcPlcflvcOldInline**; Office Word 2007, Word 2010,
and later write 0 to **lcbPlcflvcOldInline**.

[\<117\> Section 2.5.9](#Appendix_A_Target_117): Only Office Word 2003
emits information at offset **fcPlcflvcNew**; Neither Office Word 2007,
Word 2010, nor Word 2013 and later emit information at this offset and
the value of **fcPlcflvcNew** is undefined.

[\<118\> Section 2.5.9](#Appendix_A_Target_118): Only Office Word 2003
reads this information.

[\<119\> Section 2.5.9](#Appendix_A_Target_119): Office Word 2003 writes
**lcbPlcflvcNew** with the size, in bytes, of the information emitted at
offset **fcPlcflvcNew**; Office Word 2007, Word 2010, and later write 0
to **lcbPlcflvcNew**.

[\<120\> Section 2.5.9](#Appendix_A_Target_120): Only Office Word 2003
emits information at offset **fcPlcflvcNewInline**; Neither Office Word
2007, Word 2010, nor Word 2013 and later emit information at this offset
and the value of **fcPlcflvcNewInline** is undefined.

[\<121\> Section 2.5.9](#Appendix_A_Target_121): Only Office Word 2003
reads this information.

[\<122\> Section 2.5.9](#Appendix_A_Target_122): Office Word 2003 writes
**lcbPlcflvcNewInline** with the size, in bytes, of the information
emitted at offset **fcPlcflvcNewInline**; Office Word 2007, Word 2010,
and later write 0 to **lcbPlcflvcNewInline**.

[\<123\> Section 2.5.9](#Appendix_A_Target_123): Office Word 2003 emits
information at offset **fcPgdMother**. Neither Word 97, Word 2000,
Office Word 2003, Office Word 2007, Word 2010, nor Word 2013 and later
emit this information.

[\<124\> Section 2.5.9](#Appendix_A_Target_124): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<125\> Section 2.5.9](#Appendix_A_Target_125): Office Word 2003 emits
information at offset **fcBkdMother**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<126\> Section 2.5.9](#Appendix_A_Target_126): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<127\> Section 2.5.9](#Appendix_A_Target_127): Office Word 2003 emits
information at offset **fcAfdMother**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<128\> Section 2.5.9](#Appendix_A_Target_128): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<129\> Section 2.5.9](#Appendix_A_Target_129): Office Word 2003 emits
information at offset **fcPgdFtn**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<130\> Section 2.5.9](#Appendix_A_Target_130): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<131\> Section 2.5.9](#Appendix_A_Target_131): Office Word 2003 emits
information at offset **fcBkdFtn**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<132\> Section 2.5.9](#Appendix_A_Target_132): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<133\> Section 2.5.9](#Appendix_A_Target_133): Office Word 2003 emits
information at offset **fcAfdFtn**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<134\> Section 2.5.9](#Appendix_A_Target_134): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<135\> Section 2.5.9](#Appendix_A_Target_135): Office Word 2003 emits
information at offset **fcPgdEdn**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

\<136\> Section 2.5.9: Office Word 2003 reads this information. Word 97,
Word 2000, Word 2002, Office Word 2007, Word 2010, and later ignore this
information.

[\<137\> Section 2.5.9](#Appendix_A_Target_137): Office Word 2003 emits
information at offset **fcBkdEdn**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<138\> Section 2.5.9](#Appendix_A_Target_138): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<139\> Section 2.5.9](#Appendix_A_Target_139): Office Word 2003 emits
information at offset **fcAfdEdn**. Neither Word 97, Word 2000, Word
2002, Office Word 2007, Word 2010, nor Word 2013 and later emit this
information.

[\<140\> Section 2.5.9](#Appendix_A_Target_140): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

[\<141\> Section 2.5.9](#Appendix_A_Target_141): Office Word 2003 emits
information at offset **fcAfd**. Neither Word 97, Word 2000, Word 2002,
Office Word 2007, Word 2010, nor Word 2013 and later emit information at
this offset.

[\<142\> Section 2.5.9](#Appendix_A_Target_142): Office Word 2003 reads
this information. Word 97, Word 2000, Word 2002, Office Word 2007, Word
2010, and later ignore this information.

\<143\> Section 2.5.10: Neither Office Word 2007, Word 2010, nor Word
2013 and later write 0 here, but all they ignore this value when loading
files.

[\<144\> Section 2.5.10](#Appendix_A_Target_144): Neither Office Word
2007, Word 2010, nor Word 2013 and later write 0 here, but all they
ignore this value when loading files.

[\<145\> Section 2.6.1](#Appendix_A_Target_145): Office Word 2007, Word
2010, and later ignore this property when running in compatibility mode
for previous versions of Word. Word 97, Word 2000, Word 2002, and Office
Word 2003 do not process this Sprm, and thus ignore this property.

[\<146\> Section 2.6.1](#Appendix_A_Target_146): When sprmCFSpec is
unexpectedly applied to a character that can be displayed, the character
can be displayed in the same manner as a character that is not fSpec.
If, on the other hand, the character cannot be displayed, it can be
ignored.

[\<147\> Section 2.6.1](#Appendix_A_Target_147): This property is
compatible with Word 97, and for that version the default color for
[**right-to-left**](#gt_91359688-7863-4e88-b507-f57b3dada5ec) text is
**cvAuto**. Later versions do not use this property, and instead the
color of all text is specified by [sprmCIco](#character-properties).

[\<148\> Section 2.6.2](#Appendix_A_Target_148): Word implements this
property by acting as if there is a page break before the paragraph if
it would not otherwise fit on the remainder of the page. If
sprmPFKeepFollow is applied to the preceding paragraph with a value of
1, Word favors keeping this paragraph’s lines together over keeping this
paragraph on the same page as the previous paragraph. If the paragraph
is too long to fit on a full page by itself, Word ignores this property.
If the paragraph is in a table, Word ignores this property.

[\<149\> Section 2.6.2](#Appendix_A_Target_149): Word implements this
property by acting as if there is a page break before the paragraph if
there would otherwise be a page break between the end of this paragraph
and the beginning of the next one. If sprmPFKeep is applied to the next
paragraph with a value of 1, Word avoids breaking the next paragraph
across pages even if it means ignoring sprmPFKeepFollow.

[\<150\> Section 2.6.3](#Appendix_A_Target_150): Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later ignore this property. Word
2000 and Word 97 do not split table rows across pages when the table
rows set this property to 0x01.

[\<151\> Section 2.6.3](#Appendix_A_Target_151): Word 97 stops working
if merged cells are split across page break boundaries; setting this
property for merged cells avoids this problem.

[\<152\> Section 2.6.3](#Appendix_A_Target_152): Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later ignore this property.

[\<153\> Section 2.6.3](#Appendix_A_Target_153): Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later evaluate sprmTFCantSplit
instead of this property.

[\<154\> Section 2.6.3](#Appendix_A_Target_154): Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later evaluate sprmTFCantSplit
instead of this property.

[\<155\> Section 2.6.3](#Appendix_A_Target_155): If the cell has a
fixed-width, this property is false (0), and content cannot fit on a
single line in the cell, then content will [**word
wrap**](#gt_869587e8-959d-4f54-b659-ce4643508463). If the cell does not
have a fixed-width, this property is false (0), and content cannot fit
on a single line in the cell, then the cell can grow to fit the content;
however, if the cell has no more room to grow, then the content will
word wrap instead.

[\<156\> Section 2.6.3](#Appendix_A_Target_156): If the cell does not
have a fixed width and this property is true, the cell will
automatically grow to fit more content, shrinking adjacent cells in the
row if necessary so that content in this cell does not wrap. However, if
the cell content is too large to fit in the table, then the content will
be forced to wrap. If multiple cells in the row have this property set
and content will not fit on a single line for any them, widths will be
adjusted proportionately according to how much content is in each cell
(the cell with the most content receives the most width).

[\<157\> Section 2.6.4](#Appendix_A_Target_157): Word 97, Word 2000, and
Word 2002 emit [sprmSDxaColumns](#section-properties) only when the
space between columns differs from the default.

[\<158\> Section 2.6.4](#Appendix_A_Target_158): Word falls back to
**msonfcArabic**.

\<159\> Section 2.6.4: Word 97, Word 2000, and Word 2002 emit
sprmSDyaHdrTop only when the header’s distance from the top edge of the
page differs from the default.

[\<160\> Section 2.6.4](#Appendix_A_Target_160): Word 97, Word 2000, and
Word 2002 emit sprmSDyaHdrBottom only when the footer distance from the
bottom edge of the page differs from the default.

[\<161\> Section 2.6.4](#Appendix_A_Target_161): Word’s user interface
allows starting line numbers only up to 32767, corresponding to a SPRM
value of 32766. However, bigger values can be read in (for example from
ECMA-376 files) and subsequently stored into an MS-DOC file.

[\<162\> Section 2.6.4](#Appendix_A_Target_162): Office Word 2007, Word
2010, and later support larger values.

[\<163\> Section 2.6.4](#Appendix_A_Target_163): Word 97, Word 2000,
Word 2002, Office Word 2003, Office Word 2007, Word 2010, and later
ignore this value when there is only one available paper format as
defined by the currently selected printer driver.

[\<164\> Section 2.7.2](#Appendix_A_Target_164): With Word 97, Word
2000, Word 2002, and Office Word 2003 it is possible for the
**fLockRev** value or the **fLockAtn** value to be set to 1 when
**fProtEnabled** is 1.

[\<165\> Section 2.7.2](#Appendix_A_Target_165): With Word 97, Word
2000, Word 2002, and Office Word 2003 it is possible for the
**fLockRev** value or the **fLockAtn** value to be set to 1 when
**fProtEnabled** is 1.

[\<166\> Section 2.7.2](#Appendix_A_Target_166): Word 97 allows
independent viewing and printing of revision markup. This means that the
value of **fRMPrint** can be different from the value of **fRMView**.

\<167\> Section 2.7.2: With Word 97, Word 2000, Word 2002, and Office
Word 2003, it is possible for the **fLockRev** value or the **fLockAtn**
value to be set to 1 when **fProtEnabled** is 1.

[\<168\> Section 2.7.2](#Appendix_A_Target_168): Word stores either the
date and time the document was created or the date and time when
personal information was scrubbed.

[\<169\> Section 2.7.2](#Appendix_A_Target_169): Word stores either the
date and time the document was printed or 4 bytes of zeros (0) if
personal information was scrubbed or if the document was never printed.

[\<170\> Section 2.7.2](#Appendix_A_Target_170): Word will store a 0
here if personal information was scrubbed.

\<171\> Section 2.7.2: Word will store a 0 here for certain locales and
if personal information was scrubbed. Word does not prevent this value
from overflowing if the document was opened for editing more than
0x7FFFFFFF minutes.

\<172\> Section 2.7.2: Word sets up the save dialog so that, if it is
not altered, it saves a comma-delimited text file but does not prevent
the user from altering the file type in the dialog.

\<173\> Section 2.7.4: If Office Word 2007, Word 2010, or Word 2013 and
later saved this file as a background operation, this value is 9.

[\<174\> Section 2.7.4](#Appendix_A_Target_174): Word 97 sets this value
when it loads files through the Microsoft HTML converter (html32.cnv).

[\<175\> Section 2.7.4](#Appendix_A_Target_175): Word 2000, Word 2002,
Office Word 2003, Office Word 2007, Word 2010, and later write 0. Word
2002, Office Word 2003, Office Word 2007, Word 2010, and Word 2013
ignore any value on load.

[\<176\> Section 2.7.4](#Appendix_A_Target_176): Word 2000, Word 2002,
Office Word 2003, Office Word 2007, Word 2010, and later write 0. Word
2002, Office Word 2003, Office Word 2007, Word 2010, and later ignore
any value on load.

[\<177\> Section 2.7.4](#Appendix_A_Target_177): Word 2002, Office Word
2003, Office Word 2007, Word 2010, and later neither read nor write this
value.

\<178\> Section 2.7.4: Word 2002, Office Word 2003, Office Word 2007,
Word 2010, and later neither read nor write this value.

[\<179\> Section 2.7.5](#Appendix_A_Target_179): All background saves
and all saves by Office Word 2007, Word 2010, and later result in 0
here.

[\<180\> Section 2.7.5](#Appendix_A_Target_180): All background saves
and all saves by Office Word 2007, Word 2010, and later result in 0
here.

[\<181\> Section 2.7.5](#Appendix_A_Target_181): Word does not
consistently set this when tentative lists are in the document so it is
best to assume that a 1 was written here.

[\<182\> Section 2.7.13](#Appendix_A_Target_182): Only supported in
Office Word 2007, Word 2010, and later.

[\<183\> Section 2.7.13](#Appendix_A_Target_183): Only supported in
Office Word 2007, Word 2010, and later.

[\<184\> Section 2.7.13](#Appendix_A_Target_184): Only supported in
Office Word 2007, Word 2010, and later.

[\<185\> Section 2.7.13](#Appendix_A_Target_185): Only supported in
Office Word 2007, Word 2010, and later.

[\<186\> Section 2.7.13](#Appendix_A_Target_186): Only supported in
Office Word 2007, Word 2010, and later.

\<187\> Section 2.7.13: Only supported in Office Word 2007, Word 2010,
and later.

[\<188\> Section 2.7.13](#Appendix_A_Target_188): Only supported in
Office Word 2007, Word 2010, and later.

\<189\> Section 2.7.13: Only supported in Office Word 2007, Word 2010,
and later.

[\<190\> Section 2.7.13](#Appendix_A_Target_190): Only supported in
Office Word 2007, Word 2010, and later.

\<191\> Section 2.7.13: Only supported in Office Word 2007, Word 2010,
and later.

[\<192\> Section 2.7.13](#Appendix_A_Target_192): Only supported in
Office Word 2007, Word 2010, and later.

[\<193\> Section 2.7.13](#Appendix_A_Target_193): Only supported in
Office Word 2007, Word 2010, and later.

[\<194\> Section 2.7.13](#Appendix_A_Target_194): Only supported in
Office Word 2007, Word 2010, and later.

[\<195\> Section 2.7.13](#Appendix_A_Target_195): Only supported in
Office Word 2007, Word 2010, and later.

[\<196\> Section 2.7.13](#Appendix_A_Target_196): Only supported in
Office Word 2007, Word 2010, and later.

\<197\> Section 2.7.14: The Word object model does not validate input
and does allow values other than those listed.

[\<198\> Section 2.7.16](#Appendix_A_Target_198): Only Word 97 uses this
setting. Word 2000, Word 2002, Office Word 2003, Office Word 2007, Word
2010, and later use **iCustomKsu** and **fJapaneseUseLevel2** instead.
If Word 2000, Word 2002, Office Word 2003, Office Word 2007, Word 2010,
or Word 2013 and later loads a Word 97 file, it deduces its settings
based on **iCustomKsu** and **fJapaneseUseLevel2** if either are
present, or on the contents of **rgxchFPunct** and **rgxchLPunct**. Word
2000, Word 2002, Office Word 2003, Office Word 2007, Word 2010, and
later save only the values 0 and 2 and purely for backward
compatibility. The value of 1 (strict) is instead saved as 2 (custom)
with the characters saved in **rgxchFPunct** and **rgxchLPunct**.

[\<199\> Section 2.7.16](#Appendix_A_Target_199): Word 97 does not read
or write **iCustomKsu**.

\<200\> Section 2.7.16: Word 97 does not read or write
**fJapaneseUseLevel2**.

[\<201\> Section 2.8.29](#Appendix_A_Target_201): Office Word 2007, Word
2010, and later ignore this information. Word 2000, Word 2002, and
Office Word 2003 read this information.

[\<202\> Section 2.8.29](#Appendix_A_Target_202): Office Word 2007, Word
2010, and later write the information specified. Word 2000, Word 2002,
and Office Word 2003 write information that depends on the state of the
application’s internal table character cache at the time the document
was saved.

[\<203\> Section 2.9.23](#Appendix_A_Target_203): Word 97, Word 2000,
and Word 2002 emit this information. Office Word 2003 and 2007 emit 0.

[\<204\> Section 2.9.23](#Appendix_A_Target_204): Word 97, Word 2000,
and Word 2002 read this information. Office Word 2003 and 2007 ignore
it.

[\<205\> Section 2.9.24](#Appendix_A_Target_205): Word 97, Word 2000,
and Word 2002 ignore this data.

[\<206\> Section 2.9.36](#Appendix_A_Target_206): Word 97 does not
follow this rule when reading a file.

[\<207\> Section 2.9.36](#Appendix_A_Target_207): Word 2000 and Word 97
do not follow this rule when reading a file.

[\<208\> Section 2.9.43](#Appendix_A_Target_208): Office Word 2007, Word
2010, and later write [COLORREF](#colorref)s that have fAuto set to 0xFF
but the other members set to nonzero values. They do this when the user
chooses a theme color for the borders of a [PGPInfo](#pgpinfo)
structure. Because the Word Binary File format does not support Word
2007’s theme colors, these COLORREF values are undefined and result in
inconsistent behavior across different versions of Word.

[\<209\> Section 2.9.43](#Appendix_A_Target_209): Word takes its default
color from the window text color of the operating system. If applied
shading would result in text being difficult to read, Word switches to
the window background color of the operating system. Word also changes
its default colors to comply with system-wide accessibility settings.

[\<210\> Section 2.9.48](): In Office Word 2003 this structure also
contains the [**toolbar**](#gt_c57c58f2-a71c-4dc0-ae75-471d52b62f13)
visual information for when the application is in the [**Reading Layout
view**](#gt_796bcd94-7fc0-4671-8ee3-71b8f791ce91).

[\<211\> Section 2.9.69](#Appendix_A_Target_211): Word 97 through Office
Word 2003 do not enable or disable optional formats based on these
flags. Instead, they can use these flags to record which formats were
specified the last time the table was auto-formatted. In such cases,
these values are only used as an aid when re-applying a table
auto-format. See the details of each flag for specific version behavior.

\<212\> Section 2.9.69: Word 97, Word 2000, Word 2002, and Office Word
2003 record the setting from the last auto-format on the table. Office
Word 2007, Word 2010, and later ignore the value.

[\<213\> Section 2.9.69](#Appendix_A_Target_213): Word 97, Word 2000,
Word 2002, and Office Word 2003 record the setting from the last
auto-format on the table. Office Word 2007, Word 2010, and later ignore
the value.

[\<214\> Section 2.9.69](#Appendix_A_Target_214): Word 97, Word 2000,
Word 2002, and Office Word 2003 record the setting from the last
auto-format on the table. Office Word 2007, Word 2010, and later ignore
the value.

[\<215\> Section 2.9.69](#Appendix_A_Target_215): Word 97, Word 2000,
Word 2002, and Office Word 2003 record the setting from the last
auto-format on the table. Office Word 2007, Word 2010, and later ignore
the value.

[\<216\> Section 2.9.69](#Appendix_A_Target_216): Word 97, Word 2000,
Word 2002, and Office Word 2003 record the setting from the last
auto-format on the table. Office Word 2007, Word 2010, and later ignore
the value.

[\<217\> Section 2.9.69](#Appendix_A_Target_217): Office Word 2007, Word
2010, and later [**table
styles**](#gt_3b7a61db-dd69-4fde-b53f-e445ddb47424) and Word 97, Word
2000, Word 2002, and Office Word 2003 table auto-formats can have
optional formatting for the top row of a table. In Word 97 and Word
2000, the value only reflects whether the optional formatting was
applied, rather than what the format is now.

[\<218\> Section 2.9.69](#Appendix_A_Target_218): Office Word 2007, Word
2010, and later table styles and Word 97, Word 2000, Word 2002, and
Office Word 2003 table auto-formats can have optional formatting for the
bottom row of a table. In Word 97 and Word 2000, the value only reflects
whether the optional formatting was applied, rather than what the format
is now.

[\<219\> Section 2.9.69](#Appendix_A_Target_219): Office Word 2007, Word
2010, and later table styles and Word 97, Word 2000, Word 2002, and
Office Word 2003 table auto-formats can have optional formatting for the
logically leftmost column of a table. In Word 97 and Word 2000, the
value only reflects whether the optional formatting was applied, rather
than what the format is now.

[\<220\> Section 2.9.69](#Appendix_A_Target_220): Office Word 2007, Word
2010, and later table styles and Word 97, Word 2000, Word 2002, and
Office Word 2003 table auto-formats can have optional formatting for the
logically rightmost column of a table. In Word 97 and Word 2000, the
value only reflects whether the optional formatting was applied, rather
than what the format is now.

\<221\> Section 2.9.69: Office Word 2007, Word 2010, and later table
styles and Word 97, Word 2000, Word 2002, and Office Word 2003 table
auto-formats can have optional formatting for the odd numbered rows of a
table. In Word 97 and Office Word 2003, the value only reflects whether
the optional formatting was applied, rather than what the format is now.

[\<222\> Section 2.9.69](#Appendix_A_Target_222): Office Word 2007, Word
2010, and later table styles and Word 97, Word 2000, Word 2002, and
Office Word 2003 table auto-formats can have optional formatting for the
odd numbered columns of a table. In Word 97 and Office Word 2003, the
value only reflects whether the optional formatting was applied, rather
than what the format is now.

[\<223\> Section 2.9.90](#Appendix_A_Target_223): Word 2000, Word 2002,
Office Word 2003, Office Word 2007, Word 2010, and later do not change
the data or header file.

[\<224\> Section 2.9.112](#Appendix_A_Target_224): Word 2000, Word 2002,
Office Word 2003, Office Word 2007, Word 2010, and later recalculate the
appropriate sprmCRgLid0_80 and sprmCRgLid1_80 to apply to each style if
**f97LidsSet** is 0. Thus it is safe to set this value to 0. Word 97
does not need to apply the compatibility Sprms.

[\<225\> Section 2.9.121](#Appendix_A_Target_225): No version of Word
has these additional patterns available through its user interface.
However, all versions of Word have these available through
[**macros**](#gt_cd2933d3-08d1-4931-bd5c-7ae0a668fe7c).

[\<226\> Section 2.9.147](#Appendix_A_Target_226): Word 97, Word 2000,
Word 2002, Office Word 2003, Office Word 2007, Word 2010, and later use
this [Tplc](#tplc) to link a graphical representation of this list
format in the Word List UI to this LSTF.

[\<227\> Section 2.9.158](#Appendix_A_Target_227): Word 97, Word 2000,
Word 2002, Office Word 2003, Office Word 2007, Word 2010, and later
allow the user to directly edit field codes. This can cause the binary
data to mismatch the [**field
type**](#gt_1be27f15-12a7-416d-9db9-8dc1b8cf78a3).

[\<228\> Section 2.9.161](#Appendix_A_Target_228): Office Word 2003,
Office Word 2007, Word 2010, and Word 2013 ignore the values in the
[OcxInfo](#ocxinfo) structure but, for backward compatibility, emit
values based on the [**OLE
controls**](#gt_bc9725db-119f-415d-825c-ece4d5cd8b29) in the document.
The values are populated by finding all the control [FLD](#fld)s in the
document and saving the values for the corresponding OLE controls.
Previous versions of Word expect that the values in OcxInfo structures
and the values of the controls all match. The description of OcxInfo
fields specifies the values that are written.

[\<229\> Section 2.9.169](#Appendix_A_Target_229): Word 2000 and Word 97
use this value to store a reference count of the shape. Word 2002,
Office Word 2003, Office Word 2007, Word 2010, and later ignore this
value.

[\<230\> Section 2.9.181](#Appendix_A_Target_230): Word 2002
occasionally writes a value of -31681. This behavior is deprecated.

[\<231\> Section 2.9.182](#Appendix_A_Target_231): Word 2002, Office
Word 2003 and Office Word 2007 ignore the instance of sprmPChgTabs in
this scenario.

[\<232\> Section 2.9.224](#Appendix_A_Target_232): Word 2002, Office
Word 2003, and Office Word 2007 use all of the columns of the data
source when computing the hash. Word 2010 and later ignore the last
column when Microsoft Outlook is the data source.

\<233\> Section 2.9.230: **SttbAuthorAttrib** is ignored and not saved
by Word 97, Office Word 2007, Word 2010, and later. It is ignored but
saved if read by Word 2000, Word 2002, and Office Word 2003.

[\<234\> Section 2.9.230](#Appendix_A_Target_234): **SttbAuthorValue**
is ignored and not saved by Word 97, Office Word 2007, Word 2010, and
later. It is ignored but saved if read by Word 2000, Word 2002, and
Office Word 2003.

[\<235\> Section 2.9.230](#Appendix_A_Target_235): **SttbMessageAttrib**
is ignored and not saved by Word 97, Office Word 2007, Word 2010, and
later. It is ignored but saved if read by Word 2000, Word 2002, and
Office Word 2003.

[\<236\> Section 2.9.230](#Appendix_A_Target_236): **SttbMessageValue**
is ignored and not saved by Word 97, Office Word 2007, Word 2010, and
later. It is ignored but saved if read by Word 2000, Word 2002, and
Office Word 2003.

[\<237\> Section 2.9.244](#Appendix_A_Target_237): Office Word 2007,
Word 2010, and later write 1 if the selection is a bullet or number
character from a bulleted or numbered list. All versions of Word ignore
this bit. Office Word 2007, Word 2010, and later write 0 for
**fPrefix**.

[\<238\> Section 2.9.256](#Appendix_A_Target_238): Word 97 uses multiple
splf values for grammatical errors.

[\<239\> Section 2.9.260](#Appendix_A_Target_239): Word 97, Word 2000,
and Word 2002 set this value to 1 when performing an incremental save
and the style has been modified in such a way that it can affect the
height of paragraphs with that style. Office Word 2003, Office Word
2007, Word 2010, and later set the value to 0. If the
[Plc](#Section_a649fcc578684245be1204eea89d916b) specified by
**fcPlcfPhe** is not emitted, it is safe to set this value to 0.

[\<240\> Section 2.9.271](#Appendix_A_Target_240): Styles that are used
in the document are not empty. Styles that are unused in the document
(latent) are allowed to be empty.

\<241\> Section 2.9.274: The following table lists the value of
**stiMaxWhenSaved** that each version of Word writes.

| Version             | stiMaxWhenSaved |
|---------------------|-----------------|
| Word 97             | 91              |
| Word 2000           | 105             |
| Word 2002           | 156             |
| Office Word 2003    | 156             |
| Office Word 2007    | 267             |
| Word 2010           | 267             |
| Word 2013 and later | 267             |

[\<242\> Section 2.9.274](#Appendix_A_Target_242): The value of
**nVerBuiltInNamesWhenSaved** is used to optimize the performance of
loading files. Word displays and saves built-in styles with the current
application defined style name as the primary style name. However, if
the application defined style names differ between versions (or if the
user interface language is different than that in use when the file was
saved) when opening a file Word strips off the primary style name of any
application defined style and then replaces it with the current name. If
the value of **nVerBuiltInNamesWhenSaved** in the file matches the
current value known to the version of Word opening the file, Word knows
that the set of application defined style names saved to the file
matches the current set of application defined style names, and
replacing is not necessary (at least for that reason.)

Specifying a value of 0 is recommended for maximum compatibility, as it
will cause all versions of Word to update the names to whatever set of
application defined style names is current, with little performance
penalty.

The following table lists the value of **nVerBuiltInNamesWhenSaved**
that each version of Word writes.

| Version             | nVerBuiltInNamesWhenSaved |
|---------------------|---------------------------|
| Word 97             | 2                         |
| Word 2000           | 3                         |
| Word 2002           | 3                         |
| Office Word 2003    | 4                         |
| Office Word 2007    | 7                         |
| Word 2010           | 7                         |
| Word 2013 and later | 7                         |

[\<243\> Section 2.9.279](#Appendix_A_Target_243): Word 97, Word 2000,
Word 2002, Office Word 2003, Office Word 2007, Word 2010, and later do
not allow creation of a bookmark whose name violates the constraints
upon valid strings described in this section but if a string violating
them is written to file, it will be handled without error and displayed
as expected.

[\<244\> Section 2.9.286](#Appendix_A_Target_244): When a new font is
applied in a document, Word adds is to the font table if it is not
already there. However, when the user edits a document such that a font
is no longer used, the entry is not removed from the font table. Thus,
the font table will accumulate unused font references over time.

[\<245\> Section 2.9.289](#Appendix_A_Target_245): Word 97 only writes 4
strings.

[\<246\> Section 2.9.289](#Appendix_A_Target_246): Word 97 emits 0x0004
for cData.

[\<247\> Section 2.9.297](#Appendix_A_Target_247): Word 97 and Word 2000
incorrectly write 26. Regardless, Word 97 and Word 2000 correctly read
and write [SttbTtmbd](#sttbttmbd)**.rgTTMBD** 10 bytes after the
beginning of [SttbW6](#sttbw6). Word 2002, Office Word 2003, Office Word
2007, Word 2010, and later write 10.

[\<248\> Section 2.9.298](#Appendix_A_Target_248): Word 2013 and later
allow a value to be set using the name **"Sign"** that is not the VBA
digital signature if the document does not contain a VBA project or if
the file contains a VBA project but is unsigned. In the case where a VBA
project is present but is not signed, specifying a value with this name
will cause Microsoft Word to view the file as having an invalid
signature for the VBA project on a subsequent load.

[\<249\> Section 2.9.298](): Word 97, Word 2000, Word 2002, Office Word
2003, Office Word 2007, Word 2010, and Word 2013 allow a value to be set
using the name **"SigAgile"** or **“SigV3”** that is not the VBA digital
signature. Word 2016 and later allows a value to be set using this name
that is not the VBA digital signature if the document does not contain a
VBA project or if the file contains a VBA project but is unsigned. In
the case where a VBA project is present but is not signed, specifying a
value with this name will cause Word 2016 and later to view the file as
having an invalid signature for the VBA project on a subsequent load.

[\<250\> Section 2.9.298](#Appendix_A_Target_250): Word 97, Word 2000,
Word 2002, Office Word 2003, Office Word 2007, Word 2010, Word 2013, and
later allow a value to be set using this name that is not the VBA
digital signature if the document does not contain a VBA project or if
the file contains a VBA project but is unsigned. In the case where a VBA
project is present but is not signed, specifying a value with this name
will cause Microsoft Word to view the file as having an invalid
signature for the VBA project on a subsequent load.

[\<251\> Section 2.9.298](#Appendix_A_Target_251): Word 97, Word 2000,
Word 2002, Office Word 2003, Office Word 2007, Word 2010, and Word 2013
allow a value to be set using this name that is not the VBA digital
signature. Word 2016 and later allows a value to be set using this name
that is not the VBA digital signature if the document does not contain a
VBA project or if the file contains a VBA project but is unsigned. In
the case where a VBA project is present but is not signed, specifying a
value with this name will cause Word 2016 and later to view the file as
having an invalid signature for the VBA project on a subsequent load.

[\<252\> Section 2.9.307](#Appendix_A_Target_252): If the first row in
the selection contains fewer cells than the last row in the selection,
and the selection began at a cell index greater than the number of cells
in the first row, then **itcFirst** will be greater than the number of
cells in the first row, and the selection is interpreted as being the
[**end of row mark**](#gt_9fe5b7d0-b009-4e3b-9368-10a2a3ab8da9).

[\<253\> Section 2.9.307](#Appendix_A_Target_253): In some cases when
the selection spans rows with differing cell counts, Word 97, Word 2000,
Word 2002, Office Word 2003, Office Word 2007, Word 2010, and later
write an **itcLim** that is less than or equal to **itcFirst**.

[\<254\> Section 2.9.307](#Appendix_A_Target_254): Office Word 2003,
Office Word 2007, Word 2010, and later ignore the [Selsf](#selsf) if
**itcLim** is 64.

[\<255\> Section 2.9.311](#Appendix_A_Target_255): If the [**toolbar
control**](#gt_8077f5ab-e200-481c-9980-3ea64760ce9d) associated to this
[TBDelta](#tbdelta) is a [**custom toolbar
control**](#gt_75556eac-bd5a-4dc2-b7b5-48c27bfa1c93) of type Popup, but
the toolbar control does not drop a custom [**menu
toolbar**](#gt_2eb45441-112f-420b-ab4a-768b569582dc), the value of
**iTB** can be greater or equal than the value of the **cCust** field of
the [CTBWRAPPER](#ctbwrapper) structure that contains the
**rCustomizations** array that contains the
[Customization](#customization) structure that contains the
**customizationData** array that contains this structure, and is
ignored.

[\<256\> Section 2.9.312](#Appendix_A_Target_256): Word 97, Word 2000,
Word 2002 and Office Word 2003 emit this information. Office Word 2007,
Word 2010, and later emit 0.

[\<257\> Section 2.9.312](#Appendix_A_Target_257): Word 97, Word 2000,
Word 2002 and Office Word 2003 read this information. Neither Office
Word 2007, Word 2010, nor Word 2013 and later read this information.

[\<258\> Section 2.9.312](#Appendix_A_Target_258): Word 97, Word 2000,
Word 2002 and Office Word 2003 emit this information. Office Word 2007,
Word 2010, and later emit 0.

[\<259\> Section 2.9.312](#Appendix_A_Target_259): Word 97, Word 2000,
Word 2002 and Office Word 2003 read this information. Neither Office
Word 2007, Word 2010, nor Word 2013 and later read this information.

[\<260\> Section 2.9.312](#Appendix_A_Target_260): Word 97, Word 2000,
Word 2002 and Office Word 2003 emit this information. Office Word 2007,
Word 2010, and later emit 0.

[\<261\> Section 2.9.312](#Appendix_A_Target_261): Word 97, Word 2000,
Word 2002 and Office Word 2003 will read this information. Neither
Office Word 2007, Word 2010, nor Word 2013 and later read this
information.

[\<262\> Section 2.9.320](#Appendix_A_Target_262): Office Word 2007,
Word 2010, and later write 0 and ignore the **Tch**. Word 2000, Word
2002, and Office Word 2003 read and write this information.

[\<263\> Section 2.9.326](#Appendix_A_Target_263): Word 97 and Word 2000
set this value to the index of the predefined table auto-format that was
last applied to this table. Neither Word 2002, Office Word 2003, Office
Word 2007, Word 2010, nor Word 2013 and later set this value.

[\<264\> Section 2.9.326](#Appendix_A_Target_264): Word 97, Word 2000,
and Office Word 2003 do not enable or disable optional formats based on
these flags all the time. Instead, they can use these flags to record
which formats were specified the last time the table was auto-formatted.
In such cases, these values are only used as an aid when re-applying a
table auto-format. See the details of each flag for specific version.
