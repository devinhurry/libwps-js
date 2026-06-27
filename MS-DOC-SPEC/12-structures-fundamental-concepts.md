# Structures

## Fundamental Concepts

### Character Position (CP)

A character position, which is also known as a CP, is an unsigned 32-bit
integer that serves as the zero-based index of a character in the
document text. There is no requirement that the text at consecutive
character positions be at adjacent locations in the file. The size of
each character in the file also varies. The location and size of each
character in the file can be computed using the algorithm in section
[2.4.1](#Section_01d5d8c4cf9c4ef980fd439e763cfe01) (Retrieving Text).

Characters include the text of the document, anchors for objects such as
footnotes or textboxes, and control characters such as paragraph marks
and table cell marks.

Unless otherwise specified by a particular usage, a CP MUST be greater
than or equal to zero and less than 0x7FFFFFFF. The range of valid
character positions in a particular document is given by the algorithm
in section 2.4.1 (Retrieving Text).

### PLC

The **PLC** structure is an array of [character
positions](#Section_a3d44e167d2946f7bb7bd0d8a5734f83) followed by an
array of data elements. The data elements for any **PLC** MUST be the
same size of zero or more bytes. The number of CPs MUST be one more than
the number of data elements. The CPs MUST appear in ascending order.
There are different types of **PLC** structures, as specified in section
[2.8](#Section_89dbd63eb561465ab07b9e3c7eedee77). Each type specifies
whether duplicate CPs are allowed for that type.

If the total size of a **PLC** (cbPlc) and the size of a single data
element (cbData) are known, the number of data elements in that **PLC**
(*n*) is given by the following expression:

<embed src="media/media/image1.bin"
title="Formula for number of data elements in the PLC"
style="width:1.20833in;height:0.51042in" />

The preceding expression MUST yield a whole number for *n*.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aCP (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| aData (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**aCP (variable length):** An array of CP elements. Each type of **PLC**
structure specifies the meaning of the CP elements and the allowed
range.

**aData (variable length):** Each type of **PLC** structure specifies
the structure and meaning of the data elements, any restrictions on the
number of data elements, and any restrictions on the data contained
therein. It also specifies the relationship between the data elements
and the corresponding CPs.

### Valid Selection

Many constructs in file types described by this document refer to ranges
of [CP](#Section_a3d44e167d2946f7bb7bd0d8a5734f83)s. When such ranges
specify that they are restricted to a valid selection, the following
rules apply.

- If the range contains content from more than one table cell at a
  particular table depth, then it MUST contain only whole table rows at
  that table depth. For further specification, see [Overview of
  Tables](#Section_5b45f0e777604fdbaf880146de2feb4c) (section 2.4.3).

- If the range contains a field begin character, field separator
  character, or field end character, then it MUST contain the entire
  field. For further specification, see [**Plcfld**](#plcfld) (section
  2.8.25).

- Both ends of the range MUST be in the same [document
  part](#Section_5f0c432987184d678cc760d8968c5127).

- If the range is in the [footnote
  document](#Section_f7e96a05aad74acba06dbfa430ac1fcc), then both ends
  MUST be in the same footnote. For further specification, see
  [**PlcffndTxt**](#plcffndtxt) (section 2.8.20).

- If the range is in the [header
  document](#Section_8465bee76c7945a9812e58b0c5fd6cdc), then both ends
  MUST be in the same header or footer. For further specification, see
  [**Plcfhdd**](#plcfhdd) (section 2.8.22).

- If the range is in the [comment
  document](#Section_486f5a89fba5412f8ac61c551654ddcd), both ends MUST
  be in the same comment. For further specification, see
  [**PlcfandTxt**](#plcfandtxt) (section 2.8.8).

- If the range is in the [endnote
  document](#Section_13659f756a694a5f8e035f9bced90faa), then both ends
  MUST be in the same end note. For further specification, see
  [**PlcfendTxt**](#plcfendtxt) (section 2.8.17).

- If the range is in the [textbox
  document](#Section_f87b35602c234d109751ff141d307308), then both ends
  MUST be in the same textbox. For further specification, see
  [**PlcftxbxTxt**](#plcftxbxtxt) (section 2.8.32).

- If the range is in the [header textbox
  document](#Section_7392319674e14e6988b8d2cc9ac8093b), then both ends
  MUST be in the same textbox. For further specification, see
  [**PlcfHdrtxbxTxt**](#plcfhdrtxbxtxt) (section 2.8.23).

### STTB

The **STTB** is a string table that is made up of a header that is
followed by an array of elements. The **cData** value specifies the
number of elements that are contained in the array.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fExtend (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cData (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cbExtra |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | cchData 0 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Data 0 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ExtraData 0 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cchData 1 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Data 1 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ExtraData 1 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| cchData cData-1 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Data cData-1 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ExtraData cData-1 (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



The header consists of the following.

**fExtend (variable):** Optional. If the first two bytes of the **STTB**
are equal to 0xFFFF, this is a 2-byte **fExtend** field that specifies,
by its existence, that the **Data** fields in this **STTB** contain
extended (2-byte) characters and that the **cchData** fields are 2 bytes
in size. If the first two bytes of the **STTB** are not equal to 0xFFFF,
this **fExtend** field does not exist, which specifies, by its
nonexistence, that the **Data** fields in this **STTB** contain
nonextended (1-byte) characters and that the **cchData** fields are 1
byte in size.

**cData (variable):** A 2-byte unsigned integer or a 4-byte signed
integer that specifies the count of elements in this **STTB**. If this
is a 2-byte unsigned integer, it MUST be less than 0xFFFF. If this is a
4-byte signed integer, it MUST be greater than zero. Unless otherwise
specified, this is a 2-byte unsigned integer.

**cbExtra (2 bytes):** An unsigned integer that specifies the size, in
bytes, of the **ExtraData** fields in this **STTB**.

The array of elements consists of the following.

**cchData (variable):** An unsigned integer that specifies the count of
characters in the **Data** field following this field. If this **STTB**
is using extended characters as defined by **fExtend**, the size of
**cchData** is 2 bytes. If this **STTB** is not using extended
characters, the size of **cchData** is 1 byte.

**Data (variable):** The definition of each **STTB** specifies the
meaning of this field. If this **STTB** uses extended characters, the
size of this field is 2×**cchData** bytes and it is a
[**Unicode**](#gt_c305d0ab-8b94-461a-bd76-13b40cb8c4d8) string unless
otherwise specified by the **STTB** definition. If this **STTB** does
not use extended characters, then the size of this field is **cchData**
bytes and it is an ANSI string, unless otherwise specified by the
**STTB** definition.

**ExtraData (variable):** The definition of each **STTB** specifies the
structure and meaning of this field. The size of this field is
**cbExtra** bytes.

### Property Storage

Files in Word Binary File Format store the properties of characters,
paragraphs, tables, pictures, and sections as lists of differences from
the default. A [**Prl**](#prl) specifies each difference. It consists of
a Single Property Modifier ([**Sprm**](#sprm)) and its operand. An
application can determine the final set of properties by applying lists
of **Prl**s in the order that is specified in section
[2.4.6](#Section_4e918665c4da41d8aed5615c2e96c216) (Applying
Properties).

An application SHOULD<span id="Appendix_A_Target_6"
class="anchor"></span>[\<6\>](#Appendix_A_6) skip any **Prl** that
corresponds to a property or feature not present in the application by
using **Sprm.spra** to determine the size of the **Prl** to skip.

The definition of each **Sprm** in section
[2.6](#Section_4fae38be499347d2b82c8f32e4ab9ff0) specifies the default
value for the corresponding property.

If multiple **Prl**s modify the same property, the last one that is
applied determines the final value of that property unless otherwise
specified in a **Sprm** definition in section 2.6.

Any restrictions on the ordering of **Prl**s are included in the
specifications of the individual **Sprm**s involved in the restriction.
See [sprmTDelete](#table-properties) as an example.

In cases where multiple **Sprm**s modify the same property, but are
supported by different application versions, an application generating a
file MUST first emit the **Sprm** that has the lower **ispmd**, followed
by the **Sprm** that has the higher **ispmd**. For example,
[sprmPBrcTop80](#paragraph-properties) and sprmPBrcTop both modify the
top border of a paragraph, but sprmPBrcTop can express more colors. If
an application emits only sprmPBrcTop, applications that support only
sprmPBrcTop80 do not display a top border.

#### Sprm

The **Sprm** structure specifies a modification to a property of a
character, paragraph, table, or section.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ispmd |  |  |  |  |  |  |  |  | A | sgc |  |  | spra |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**ispmd (9 bits):** An unsigned integer that, when combined with
**fSpec**, specifies the property being modified. See the tables in the
[Single Property Modifiers](#Section_4fae38be499347d2b82c8f32e4ab9ff0)
section (2.6) for the complete list of valid **ispmd**, **fSpec**,
**spra** combinations for each **sgc**.

**A - fSpec (1 bit):** When combined with **ispmd**, specifies the
property being modified. See the tables in the Single Property Modifiers
section (2.6) for the complete list of valid **ispmd**, **fSpec**,
**spra** combinations for each **sgc**.

**sgc (3 bits):** An unsigned integer that specifies the kind of
document content to which this **Sprm** applies. The following table
specifies the valid values and their meanings.

| Sgc | Meaning                                     |
|-----|---------------------------------------------|
| 1   | **Sprm** is modifying a paragraph property. |
| 2   | **Sprm** is modifying a character property. |
| 3   | **Sprm** is modifying a picture property.   |
| 4   | **Sprm** is modifying a section property.   |
| 5   | **Sprm** is modifying a table property.     |

**spra (3 bits):** An unsigned integer that specifies the size of the
operand of this **Sprm**. The following table specifies the valid values
and their meanings.

| Spra | Meaning                                                                                                                                                                                                          |
|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0    | Operand is a [ToggleOperand](#toggleoperand) (which is 1 byte in size).                                                                                                                                          |
| 1    | Operand is 1 byte.                                                                                                                                                                                               |
| 2    | Operand is 2 bytes.                                                                                                                                                                                              |
| 3    | Operand is 4 bytes.                                                                                                                                                                                              |
| 4    | Operand is 2 bytes.                                                                                                                                                                                              |
| 5    | Operand is 2 bytes.                                                                                                                                                                                              |
| 6    | Operand is of variable length. The first byte of the operand indicates the size of the rest of the operand, except in the cases of [sprmTDefTable](#table-properties) and [sprmPChgTabs](#paragraph-properties). |
| 7    | Operand is 3 bytes.                                                                                                                                                                                              |

#### Prl

The **Prl** structure is a [**Sprm**](#sprm) that is followed by an
operand. The **Sprm** specifies a property to modify, and the operand
specifies the new value.


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 20 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 30 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sprm |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | operand (variable) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |



**sprm (2 bytes):** A **Sprm** which specifies the property to be
modified.

**operand (variable):** A variable-length operand for the **sprm**. The
size of the operand is specified by **sprm.spra**. The meaning of the
operand depends on the **sprm**, see section
[2.6](#Section_4fae38be499347d2b82c8f32e4ab9ff0) (Single Property
Modifiers).

### Encryption and Obfuscation (Password to Open)

A file in Word Binary File Format can be password protected by using one
of the following mechanisms:

- XOR obfuscation (section
  [2.2.6.1](#Section_79dea1e94dce4fa08c6b56ba37b68351))

- Office binary document RC4 encryption (section
  [2.2.6.2](#Section_3e9a4e92bdfe4379814474d033892ede))

- Office binary document RC4 CryptoAPI
  encryption<span id="Appendix_A_Target_7"
  class="anchor"></span>[\<7\>](#Appendix_A_7) (section
  [2.2.6.3](#Section_55d29d8efd804c2da258ffdb7ed9e236))

If **[FibBase](#fibbase).fEncrypted** and **FibBase.fObfuscated** are
both 1, the file is obfuscated by using XOR obfuscation (section
2.2.6.1) as specified in section 2.2.6.1.

If **FibBase.fEncrypted** is 1 and **FibBase.fObfuscated** is 0, the
file is encrypted by using either Office Binary Document RC4 Encryption
(section 2.2.6.2) or Office Binary Document RC4 CryptoAPI Encryption
(section 2.2.6.3), with the **EncryptionHeader** stored in the first
**FibBase.lKey** bytes of the [Table
stream](#Section_44f62054d9114989946ca42100c26a15). The
**EncryptionHeader.EncryptionVersionInfo** specifies which encryption
mechanism was used to encrypt the file.

See [Security Considerations](#Section_5dbc8d4e4aff4e168650498572574630)
for information about security concerns relating to file obfuscation and
encryption for this file format.

#### XOR Obfuscation

In a file that is password protected by using XOR obfuscation,
**[FibBase](#fibbase).fEncrypted** and **FibBase.fObfuscated** MUST both
be 1.

The password verifier computed from the password as specified in Binary
Document Password Verifier Derivation Method 2 in
[\[MS-OFFCRYPTO\]](%5bMS-OFFCRYPTO%5d.pdf#Section_3c34d72a1a614b52a893196f9157f083)
section 2.3.7.4 MUST be stored in FibBase.**lKey**.

The [WordDocument stream](#Section_d7fae142670d4cd5869a708366984a71),
the [Table stream](#Section_44f62054d9114989946ca42100c26a15), and the
[Data stream](#Section_0218f8a661504695965c9abc8a685b81) MUST be
obfuscated using XOR Data Transformation Method 2 as specified in
\[MS-OFFCRYPTO\] section 2.3.7.6. All other streams and storages MUST
NOT be obfuscated.

The byte transformation specified in \[MS-OFFCRYPTO\] section 2.3.7.6
MUST be carried out in the WordDocument stream relative to the beginning
of the stream, but the initial 68 bytes MUST be written out with their
untransformed values.

#### Office Binary Document RC4 Encryption

In a file that is password protected by using Office binary document RC4
encryption as specified in
[\[MS-OFFCRYPTO\]](%5bMS-OFFCRYPTO%5d.pdf#Section_3c34d72a1a614b52a893196f9157f083)
section 2.3.6, **[FibBase](#fibbase).fEncrypted** MUST be 1 and
**FibBase.fObfuscated** MUST be 0.

The **EncryptionHeader**, as specified in \[MS-OFFCRYPTO\] section
2.3.6.1, MUST be written in unencrypted form in the first
**FibBase.lKey** bytes of the [Table
stream](#Section_44f62054d9114989946ca42100c26a15). The remainder of the
Table stream, the [WordDocument
stream](#Section_d7fae142670d4cd5869a708366984a71) beyond the initial 68
bytes, and the entire [Data
stream](#Section_0218f8a661504695965c9abc8a685b81) MUST be encrypted.

These three streams of data MUST be encrypted in 512-byte blocks. The
block number MUST be set to zero at the beginning of the stream and MUST
be incremented at each 512-byte boundary. The encryption algorithm MUST
be carried out at the beginning of the Table stream and the WordDocument
stream even though some of the bytes are written in unencrypted form.

All other streams and storages MUST NOT be encrypted.

#### Office Binary Document RC4 CryptoAPI Encryption

In a file that is password protected by using Office binary document RC4
CryptoAPI encryption as specified in
[\[MS-OFFCRYPTO\]](%5bMS-OFFCRYPTO%5d.pdf#Section_3c34d72a1a614b52a893196f9157f083)
section 2.3.5, **[FibBase](#fibbase).fEncrypted** MUST be 1 and
**FibBase.fObfuscated** MUST be 0.

The **EncryptionHeader** as specified in \[MS-OFFCRYPTO\] section
2.3.5.1 MUST be written in unencrypted form in the first
**FibBase.lKey** bytes of the [Table
stream](#Section_44f62054d9114989946ca42100c26a15). The remainder of the
Table stream, the [WordDocument
stream](#Section_d7fae142670d4cd5869a708366984a71) beyond the initial 68
bytes, and the entire [Data
stream](#Section_0218f8a661504695965c9abc8a685b81) MUST be encrypted.

These three streams of data MUST be encrypted in 512-byte blocks. The
block number MUST be set to zero at the beginning of the stream and MUST
be incremented at each 512 byte boundary. The encryption algorithm MUST
be carried out at the beginning of the Table stream and the WordDocument
stream even though some of the bytes are written in unencrypted form.

The [ObjectPool](#Section_f7983581d1074a1fb5f7f3650e777c04) storage MUST
NOT be present and if the file contains [**OLE
objects**](#gt_cdff9514-a3fb-4897-941d-4e99193a0096), the storage
objects for the OLE objects MUST be stored in the Data stream as
specified in [sprmCPicLocation](#character-properties).

If **fDocProps** is set in the **EncryptionHeader**.**Flags**, the
[Encryption stream](#Section_f43676cbc68e48399a3b90b151282b6b) MUST be
present, the [Summary Information
stream](#Section_6d38bfd5afdb412f831816a50ed48416) MUST NOT be present,
and a placeholder [Document Summary Information
stream](#Section_7dc15eb9c84d4eb5844b0e78e072214f) MUST be present as
specified in \[MS-OFFCRYPTO\] section 2.3.5.4.

If **fDocProps** is not set in the **EncryptionHeader**.**Flags**, the
Document Summary Information stream and the Summary Information stream
MUST NOT be encrypted.

All other streams and storages MUST NOT be
encrypted<span id="Appendix_A_Target_8"
class="anchor"></span>[\<8\>](#Appendix_A_8).
