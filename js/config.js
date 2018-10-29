﻿/**
* typesetting for EverEdit
* 注意：本文件需保存为UTF-8 BOM格式
*/

/****** 常用正则设定 ******/
var regCommon = {
	// 英文间隔符
	'enSep': "\'\`\＇‘’『』",
	// 中文
	'han': '\u4e00-\u9fa0',
	// 半角标点
	'hwPun': '\-\\\'\"\.\<\>\[\]\!\(\)\,\:\;\?\~\`\&\@\#\^\$',
	'shwPun': "\\-\\'\\.\\<\\>\\[\\]\\!\\(\\)\\,\\:\\;\\?\\~\\`\\&\\@\\#",
	// 全角标点
	'fwPun': '·–—‘’“”…、。〈〉《》「」『』【】〔〕！（），．：；？～￠-￥＆',
	'sfwPun': '·–—…、。〈〉〔〕！（），．：；？～￠-￥＆＠＃'
}
/****** 章节重复资源 ******/
var regChapterCut = {
	'tf': '[最]?[初前后上中下续终尾断後續終斷]',
	'c': ['卷部篇', '集阙季册闕冊', '折章回话节幕節話'],
	'cf': '[折卷章]',
	'n': [
		'[0-9零一二三四五六七八九十百]',
		'[0-9０-９零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩]',
		'[\\-\\—0-9０-９零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩]',
		'[零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩]',
		'[上中下续终續終]|[\\-\\—0-9０-９零一二三四五六七八九十百千壹贰叁肆伍陆柒捌玖拾佰仟两廿卅卌〇貳叄陸兩]'
	],
	'sep': ' 　\\.\\,\\:\\-。，：\\—、．',
	'space': Space
}
var configs = {
	// 分隔符样式
	Separator: '＊＊＊　　＊＊＊　　＊＊＊',
	// 章节与标题分隔符
	Divide: '：',
	// 排版时每行最大字数（按双字节计算）
	Linenum: 35,
	// 约定英语，用|分隔
	pWord: 'iPhone|iPad|iMac|iTv|iPod|MTV|SUV|TV|ID|CIA|FBI|VIP|CEO|CFO|COO|CIO|OA|PC|OEM|SOS|SOHO|PS|ISO|APEC|WTO|USA|GPS|GSM|NASDAQ|MBA|ATM|GDP|AIDS|CD|CDMA|DIY|EMS|EQ|IQ|PDA|BBC|DJ|SARS|DNA|UFO|AV|WTF|TMD|IC|SM|TM|OK|NTR|QQ|DP|KTV|OL|PK|I|NDE|XXOO|YY|PM|VCD|DVD|CAA|CNN|CBS|BBS|ICM|IMAX|AMC|DC|NG|ABC|VS|JJ|SPA|VR|AR|ICU|IMDB|SWAT|IPTV|GPA',
	// 结尾的标识语，用于排版输出时居中，用|分隔
	endStrs: '待续|未完|未完待续|完|完结|全文完|全书完|待續|未完待續|完結|全書完',
	/****** 文章标题正则设定 ******/
	'novelTitle': /^([ 　]*)(《(.+)》(.*?)|书名[：\:](.+))$/m,
	'novelAuthor': /^([ 　]*)((作者|编者|译者|排版)[：\:](.+))$/gm,
	/****** 标题正则设定 ******/
	// 标题正则
	regTitle: __fmts({
		// 标题行首空格 regStart
		'f': '(?:[{$space}]*)',
		// 标题间隔符（严格限定）regSeparator
		's': '[{$sep}]{1,6}',
		// 标题间隔符 regSeparatorNull
		'sn': '[{$sep}]{0,6}',
		// 行尾 regEnd
		'e': '.{0,40}[^。：;；\n]',
		// 行尾（严格限定） regStrictEnd ’”』」
		'es': '.{0,40}[^，。：;；、…？！’”』」\?\!\n]',
		/****** 非常规标题 ******/
		't1': [
			'[引楔]子|引言|序篇?章|自?序[言幕]?|题[注记]|題[註記]|文案|卷[首后後][语語]|开卷[语語]|(?:作者)?前言|[全本下][{$c.0}{$c.1}](?:[简簡]介|介[绍紹]|[预預]告)|(?:作品|作者|人物|内容)?(?:[简簡]介|介[绍紹]|[预預]告|自介)|篇[后後]|[后後][记话記話]|尾[声记聲記]|(?:完本|作者)感言|附[录錄]|作者的[话話]|正文',
			'{$tf}[{$c.0}{$c.1}]',
			'{$tf}[{$c.2}]',
			'同人|[前后外续後續][番传篇傳章]|外{$n.0}{1,5}[章回折节话節話]|[续續]{$n.0}{1,5}|[番篇]外[篇卷]?{$n.0}{0,4}'
		],
		/****** 一章/第一章/一章：标题/第一章：标题 ******/
		't2': '((?:第)?[ ]*{$n.2}{1,9}[ ]*[{$c}])',
		/****** 卷一/卷一：标题 ******/
		't3': '({$cf})[ ]*({$n.1}{1,9})',
		/****** 01/01./01.标题/一/一、标题 ******/
		't4': '({$n.1}{1,9})',
		/****** （一）/（一）标题 ******/
		't5': '([\\(（](?:{$n.4}{1,9})[\\)）])',
		/****** chapter 22 ******/
		't6': '(?:chapter|chap|ch|☆|★|○|●|◎|◇|◆|□|■|△|▲|※|＃)[ \.]*(\\d+)',
		/****** 标题 ******/
		// 一/一、标题
		't40': '({$n.1}{1,9})',
		//（一） --> 第一章
		't80': '[\\[\\(（〖【〈［]({$n.2}{1,9})[\\]\\)）〗】〉］]',
		// 松散标题
		't90': '(第?{$n.2}{1,9})',
		// 严格标题
		't91': '(第{$n.2}{1,9})'
	}, regChapterCut),
	// 标题无用的外框
	regTitleBorder: ['〖【\\[', '\\]】〗'],
	// 全角数字标题
	regSBCNumberTitle: '([第\(（][０-９]+[{$c}\)）])'.fmt(regChapterCut),
	// 标题防止错误
	regSkipTitle: /^([第]?[0-9０-９零一二三四五六七八九十两]{1,9})(部[分]|季[度]|篇[篇文]|幕[幕]|话[没不]|回[生首头合家]|[部集](戏|电[影视]))/g,
	regSkipTitle1:  [
		// 忽略日期格式 2010.10.10, 17.10.10, 17/10/10
		/([\d０-９]{2,4})[\.\-\/。\—][\d０-９]{1,2}[\.\-\/。\—][\d０-９]{1,2}/g,
		// 忽略日期格式 2010年10月10日, 五时十二分
		/^[\d０-９一二三四五六七八九十]{1,4}[年月日点时分秒點時]([\d０-９一二三四五六七八九十]|$)/g,
		// 忽略时间格式 20:22:21
		/^[\d０-９]{1,2}[\:：][\d０-９]{1,2}[\:：][\d０-９]{1,2}/g,
		// 其他不规则格式 100%, 60°
		/^[\d０-９]{1,6}[\%％‰℃°]$/g,
		// 比分类格式 3:0
		/^[\d０-９]{1,2}[\:：][\d０-９]{1,2}/g,
		// 10元！20。
		/^([\d０-９一二三四五六七八九十百千万]{1,12})(元|块|次|多)?([！？。…]){1,3}$/g,
		// 排比数字 一、二、三……
		/([、，：][0-9二三四五六七八九十]{1,6})+([！？。…]){1,3}$/g
	],
	/****** 其他替换设定 ******/
	// 变体字母
	sVariant: [
		[/[ÀÁÂÃÄÅ]/g, 'A'],
		[/[àáâãäåāǎɑа]/g, 'a'],
		[/[ß]/g, 'B'],
		[/[ьЪъ]/g, 'b'],
		[/[Ç]/g, 'C'],
		[/[ç]/g, 'c'],
		[/[Ð]/g, 'D'],
		[/[ÈÉÊË]/g, 'E'],
		[/[èéêëēě]/g, 'e'],
		[/[ん]/g, 'h'],
		[/[ÌÍÎÏ]/g, 'I'],
		[/[ìíîïīǐΙι]/g, 'i'],
		[/[м]/g, 'm'],
		[/[ΝÑ]/g, 'N'],
		[/[ñńňиη]/g, 'n'],
		[/[ÒÓÔÕÖ]/g, 'O'],
		[/[òóôõöōǒøо]/g, 'o'],
		[/[Þ]/g, 'P'],
		[/[þρ]/g, 'p'],
		[/[τ]/g, 't'],
		[/[ÙÚÛÜ]/g, 'U'],
		[/[ùúûüūǔǖǘǚǜüυ]/g, 'u'],
		[/[ⅴν]/g, 'v'],
		[/[щω]/g, 'w'],
		[/[Ýγ]/g, 'Y'],
		[/[ýÿ]/g, 'y']
	],
	// 变体序号
	sSerialNumber: [
		[/㈠/g, '（一）'], [/㈡/g, '（二）'], [/㈢/g, '（三）'], [/㈣/g, '（四）'], [/㈤/g, '（五）'],
		[/㈥/g, '（六）'], [/㈦/g, '（七）'], [/㈧/g, '（八）'], [/㈨/g, '（九）'], [/㈩/g, '（十）'],
		[/[⒈①⑴]/g, '（01）'], [/[⒉②⑵]/g, '（02）'], [/[⒊③⑶]/g, '（03）'], [/[⒋④⑷]/g, '（04）'], [/[⒌⑤⑸]/g, '（05）'],
		[/[⒍⑥⑹]/g, '（06）'], [/[⒎⑦⑺]/g, '（07）'], [/[⒏⑧⑻]/g, '（08）'], [/[⒐⑨⑼]/g, '（09）'], [/[⒑⑩⑽]/g, '（10）'],
		[/[⒒⑪⑾]/g, '（11）'], [/[⒓⑫⑿]/g, '（12）'], [/[⒔⑬⒀]/g, '（13）'], [/[⒕⑭⒁]/g, '（14）'], [/[⒖⑮⒂]/g, '（15）'],
		[/[⒗⑯⒃]/g, '（16）'], [/[⒘⑰⒄]/g, '（17）'], [/[⒙⑱⒅]/g, '（18）'], [/[⒚⑲⒆]/g, '（19）'], [/[⒛⑳⒇]/g, '（20）']
	],
	// 半角标点符号
	halfSymbol: [
		[/[！\!]/g, '! '],
		[/[（\(]/g, ' ('],
		[/[）\)]/g, ') '],
		[/[，\,]/g, ', '],
		[/[：:]/g, ': '],
		[/[；;]/g, '; '],
		[/[？\?]/g, '? '],
		[/[–\—\-]/g, '-'],
		[/([^\d])[。\.]/g, '$1. '],
		[/[＆&]/g, ' & '],
		[/[ ]+/g, ' '],
		// 修复错误
		[/[ ]+(?=[…\!\?\.])/g, ''],
		[/([\.\?\!])[ ]?([》”’」』\"])/g, '$1$2'],
		[/([A-Z])[ ]?[＆&][ ]?([A-Z])/g, '$1&$2']
	],
	// 异体标点
	punSymbol: [
		// 按键盘顺序 ﹏﹋﹌ˇ
		'｀‐━―ーˉ﹣﹦~﹗!﹫＠﹟＃﹩＄﹪％﹠＆﹡(﹙﹚)﹐,.．﹒∶﹕︰:﹔;﹑﹖?⋯┅¨▪•‧︱︳﹛{﹜}〝｢″〃｣‴﹤﹥︿﹀﹢＋',
		'`—————－＝～！！@@##$$%%&&＊（（）），，。。。：：：：；；、？？………···｜｜｛｛｝｝““””””＜＞∧∨++'
	],
	// 标点符号修正
	amendSymbols: [
		// 单引号
		[/[′＇]/g, "'"],
		// 双引号
		[/＂/g, '"'],
		// 分隔号
		[/｜/g, '|'],
		// 直折号统一
		[/[-─－]/g, '—'],
		[/——+/g, '——'],
		// 中文破折号 ──
		[/([\u4e00-\u9fa0])——+/g, '$1──'],
		[/——+([\u4e00-\u9fa0])/g, '──$1'],
		// 连接号 — —— ～
		//[/\﹝/g, '［'], // 左方括号
		//[/\﹞/g, '］'], // 右方括号
		// 两个标点以上留一 「」『』“”‘’
		[/：：+/g, '：'],
		[/，，+/g, '，'],
		[/；；+/g, '；'],
		[/（（+/g, '（'],
		[/））+/g, '）'],
		[/［［+/g, '［'],
		[/］］+/g, '］'],
		[/｛｛+/g, '｛'],
		[/｝｝+/g, '｝'],
		[/%%+/g, '%'],
		[/∧∧+/g, '∧'],
		[/∨∨+/g, '∨'],
		[/〈〈+/g, '〈'],
		[/〉〉+/g, '〉'],
		// 波折号处理
		[/～～+/g, '～～'],
		[/([。？”」…])～～$/gm, '$1\n～～'],
		// 英语特定处理：inc.
		[/([a-z])。{2}/gi, '$1.。'],
		// 省略号处理
		[/[·、，`°]{2,}/g, '…'],
		[/(?:。…+|…[。，`\—]+)/g, '…'],
		[/。{3,}/g, '…'],
		[/…/g, '……'],
		[/…{3,}/g, '……'],
		// 去错误和相联标点
		[/(?:，。|。(，|。))/g, '。'],
		[/“：/g, '：“'],
		[/：“”/g, '：“'],
		[/：「」/g, '：「'],
		[/([…。，！？][」”])[。！？]/g, '$1'],
		[/([“「？！。，：、])[，：、]/g, '$1'],
		[/([：、，])[；：、？！]/g, '$1'],
		[/([”。？！」])……$/gm, '$1\n……'],
		// 修正问号和感叹号
		[/？！[？！]+/g, '？！'],
		[/！？[？！]+/g, '？！'],
		[/！！？+/g, '？！'],
		[/？？！+/g, '？！'],
		[/！！{2,}/g, '！！！'],
		[/？？{2,}/g, '？？？']
	],
	// HTML 字符实体
	regHtmlEntity: /[&＆][ ]?([a-z]{2,7})[;；]/gi,
	sHtmlEntity : {
		// 带有实体名称的 ASCII 实体
		'quot': '"', 'apos': "'", 'amp': '&', 'lt': '<', 'gt': '>',
		// ISO 8859-1 符号实体
		'nbsp': ' ', 'shy': '', 'copy': '©', 'reg': '®', 'trade': '™',
		'yen': '¥', 'cent': '¢', 'pound': '£',
		'times': '×', 'divide': '÷',
		// 特殊转义字符
		'iexcl': '¡', 'curren': '¤', 'brvbar': '¦', 'sect': '§', 'uml': '¨',
		'ordf': 'ª', 'laquo': '«', 'not': '¬', 'macr': '¯', 'deg': '°',
		'plusmn': '±', 'sup1': '¹', 'sup2': '²', 'sup3': '³', 'acute': '´',
		'micro': 'µ', 'para': '¶', 'middot': '·', 'cedil': '¸', 'ordm': 'º',
		'raquo': '»', 'frac14': '¼', 'frac12': '½', 'frac34': '¾', 'iquest': '¿',
		// ISO 8859-1 字符实体
		'agrave': 'à', 'aacute': 'á', 'acirc': 'â', 'atilde': 'ã', 'auml': 'ä', 'aring': 'å', 'aelig': 'æ',
		'Agrave': 'À', 'Aacute': 'Á', 'Acirc': 'Â', 'Atilde': 'Ã', 'Auml': 'Ä', 'Aring': 'Å', 'AElig': 'Æ',
		'THORN': 'Þ', 'thorn': 'þ', 'szlig': 'ß',
		'ccedil': 'ç','Ccedil': 'Ç', 
		'ETH': 'Ð',
		'egrave': 'è', 'eacute': 'é', 'ecirc': 'ê', 'euml': 'ë',
		'Egrave': 'È', 'Eacute': 'É', 'Ecirc': 'Ê', 'Euml': 'Ë',
		'igrave': 'ì', 'iacute': 'í', 'icirc': 'î', 'iuml': 'ï',
		'Igrave': 'Ì', 'Iacute': 'Í', 'Icirc': 'Î', 'Iuml': 'Ï',
		'ntilde': 'ñ', 'Ntilde': 'Ñ',
		'eth': 'ð', 'ograve': 'ò', 'oacute': 'ó', 'ocirc': 'ô', 'otilde': 'õ', 'ouml': 'ö', 'oslash': 'ø',
		'Ograve': 'Ò', 'Oacute': 'Ó', 'Ocirc': 'Ô', 'Otilde': 'Õ', 'Ouml': 'Ö', 'Oslash': 'Ø',
		'ugrave': 'ù', 'uacute': 'ú', 'ucirc': 'û', 'uuml': 'ü',
		'Ugrave': 'Ù', 'Uacute': 'Ú', 'Ucirc': 'Û', 'Uuml': 'Ü',
		'yacute': 'ý', 'yuml': 'ÿ', 'Yacute': 'Ý'
	},
	// 修正分隔符
	// !@!@!@!@! 注释符
	// @@@@ 分隔符
	rSeparator: [
		[/[ ]+(?=[＊#＃§☆★○●◎◇◆□■△▲※〓＝﹡＋@\*×\—\-－─=~～])/g, ''],
		[/[`＊&\*×x]{5,}/gi, '@@@@'],
		[/[#＃§☆★○●◎◇◆□■△▲※〓＝﹡＋]{3,}/gm, '@@@@'],
		[/^[＊×]{3,}/gm, '@@@@'],
		[/^[\—\-－─=]{4,}/gm, '@@@@'],
		[/[\—\-－─=]{4,}$/gm, '@@@@'],
		[/^.+分割线$/gm, '@@@@'],
		[/^[—]*分割线[—]{2,}$/gm, '@@@@'],
		[/^[\—\-－─=~～]{2,}$/gm, '@@@@'],
		// 修正车牌号
		[/([a-z][\-\—])@@@@/gi, '$1XXXXX'],
		// 修正数字和某些标点后的*号
		[/([\w：，；]$)\n?@@@@\n?/gm, '$1****'],
		[/@@@@\n?([，。！？…’”』」])/gm, '****$1'],
		[/@@{3,}/g, '\n@@@@\n'],
		[/(^@@@@$\n+)+/gm, '@@@@\n'],
		[/\n+@@@@\n+/gm, '\n@@@@\n']
	],
	// 引号修正
	rQuotes: [
		['([a-z])[{$enSep}]([a-z])'.fmtReg(regCommon, 'gi'), '$1※@※$2'],
		[/[`＇‘’『』]/g, '\''],
		// \[\]
		[/[〝〞［］＂″｢｣“”「」]/g, '\"'],
		// 修正单引号
		[/'([^\'\n]+)'/g, '‘$1’'],
		[/^([　]*)'/gm, '$1‘'],
		[/'/g, '’'],
		[/^([　]*)’/gm, '$1‘'],
		[/‘$/g, '’'],
		[/：’/g, '：‘'],
		[/※@※/g, '\''],
		// 修正大引号
		[/"([^\"\n]+)"/g, '“$1”'],
		[/^([ 　]*)"/gm, '$1“'],
		[/"/g, '”'],
		[/^([ 　]*)”/gm, '$1“'],
		[/“$/g, '”'],
		[/：”/g, '：“']
	],
	// 法式引号 fr：'‘’“”'
	// 中式引号 cn：'『』「」'
	cnQuotes: ['‘’“”', '『』「」'],
	// 修正所有数字和英文字母间的标点和空格
	nwSymbol : [
		// 修正数字间的全角
		[/(\d)[。·](\d)/g, '$1.$2'],
		[/(\d)：(\d)/g, '$1:$2'],
		[/\b[-—～─]{1,3}|[-—～─]{1,3}\b/g, '-'], // 英文间
		[/(\d)[％]/g, '$1%'],
		// 处理 ABCDE90.5％ -> Abcde 90.5%
		//[/([a-zA-Z]+)([\d。\.]+[\%％‰℃°])/g, '$1 $2'],
		// 处理 Sid·Meier -> Sid Meier
		[/[·]([a-z]+)/gi, ' '],
		// 处理 Up / Down -> Up/Down
		[/[ ]*[\/][ ]*(?=[a-z]+)/gi, '/'],
		// 处理 No。1 -> NO.1
		[/\bno[。\.]([0-9]{1,2})\b/gi, 'NO.$1'],
		// 处理 E。T。 -> E.T.
		[/\b[。]\b/g, '.'],
		[/(?:[。\.])([a-z])(?:[。\.])/gi, '.$1.']
		// &标记的
		//[/([a-zA-Z]{2,})[ ]?[＆&][ ]?([a-zA-Z]{2,})/g, '$1 & $2']
	]
}
