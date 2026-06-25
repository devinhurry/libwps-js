# kingsoft-wps-js — 纯 JavaScript 实现的 Kingsoft/WPS Office `.wps` 文件解析与 DOCX 转换器

[English](README.md) | [简体中文](README.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](package.json)
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
[![Format](https://img.shields.io/badge/format-.wps-orange.svg)](#支持范围)
[![Tests](https://img.shields.io/badge/tests-node--test-brightgreen.svg)](#测试)

纯 JavaScript（无原生依赖）实现的 **Kingsoft/WPS Office `.wps` 文件**读取与文本提取库。
针对以 **OLE2 / CFB（复合文档二进制）** 容器存储 **Word 二进制流**
（`WordDocument`、`0Table` / `1Table`、`Data`）的 `.wps` 文件进行解析，读取
**Word FIB**、**CLX / Pcdt 分片表**，并解码 **UTF-16LE** 与**压缩单字节**文本
分片，从而还原正文、段落、页眉、脚注等 Word 子文档内容。

附带命令行工具，以及一份最小化的 **`.wps` → `.docx`（WordprocessingML）转换器**。

## 功能特性

- 100% JavaScript 实现 — 无原生插件，支持 Node.js 18+ 及现代浏览器
- 读取 OLE2 / CFB 复合文档：扇区、FAT、MiniFAT、目录及流
- 解析 Word 二进制 **FIB** 并正确选择表流
- 遍历 **CLX / Pcdt 分片表**，按顺序提取文本
- 解码 **UTF-16LE** 与**压缩（单字节）**文本分片
- 输出正文、原始文本、段落，以及 **Word 子文档区间**
- 附带命令行工具 `kingsoft-wps-js` 与 **`.wps` 转 `.docx`** 转换器

## 安装

```sh
npm install kingsoft-wps-js
```

## 用法

```js
import { readWpsFile } from "kingsoft-wps-js";

const document = await readWpsFile("ole2-full.wps");

console.log(document.text);
console.log(document.paragraphs);
```

## 命令行工具

```sh
./bin/kingsoft-wps-js.js ole2-full.wps text        # 规范化后的正文文本
./bin/kingsoft-wps-js.js ole2-full.wps json        # 解析结果以 JSON 输出
./bin/kingsoft-wps-js.js ole2-full.wps raw         # 原始分片表文本
./bin/wps-to-docx.js ole2-full.wps out.docx  # 将 .wps 转换为 .docx
```

DOCX 转换器会根据提取出的正文、段落属性、run 格式、section 与已支持的表格结构，
输出 **WordprocessingML** 文档。目前仍不处理页眉页脚、绘图对象，以及未支持的
早期/原生 WPS 格式。

## 返回的文档对象

`readWps` 与 `readWpsFile` 返回：

- `text`：规范化后的正文文本
- `rawText`：来自 Word 二进制分片表的全部文本，包含子文档
- `bodyText`：原始主文档文本
- `paragraphs`：规范化后的非空正文段落
- `subdocuments`：正文、页眉、脚注等对应的 Word 子文档区间
- `streams`：OLE2 流的名称与大小
- `fib`：用于提取的 Word 二进制 FIB 解析详情

## 支持范围

当前解析器通过以下方式支持本仓库中的 WPS 测试用例：

1. OLE2 复合文档二进制扇区、FAT、MiniFAT 以及流。
2. Word 二进制 FIB 表流的选择。
3. CLX/Pcdt 分片表。
4. UTF-16LE 与压缩的单字节文本分片。

### DOCX settings `w:rsids`

`word/settings.xml` 里的 `w:rsids` 属于修订历史管理元数据，不影响当前
的文本提取和 DOCX 内容转换流程，因此现在可以暂时不生成。不要把它当作
解析文档结构的信号。

## 应用场景

- 从老旧的 **WPS Office `.wps`** 文档中提取文本
- 将 `.wps` 文件转换为 `.docx`，以兼容现代 Word / Office
- 对历史 WPS / Word 二进制格式文档进行索引、检索或归档
- 构建无需原生依赖即可读取 `.wps` 文件的 Node.js 服务
- 以编程方式检查 OLE2 / CFB 流及 Word FIB 结构

## 测试

```sh
npm test
```

## 主题 / 关键词

`wps` · `wps-office` · `金山办公` · `WPS文字` · `.wps` · `ole2` · `cfb` ·
`复合文档` · `word` · `word-binary` · `doc` · `docx` · `fib` · `clx` ·
`pcdt` · `分片表` · `utf-16le` · `javascript` · `nodejs` · `解析器` ·
`文本提取` · `转换器` · `wps转docx`

## 开源协议

[MIT](LICENSE) © devinhurry
