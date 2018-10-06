
// 格式化时间
if (typeof Date.prototype.format !== 'function') {
	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}
}
// 仿Java String.format
/*
 * var result1 = "我是{0}，今年{1}了".format("loogn",22)
 * var result2 = "我是{name}，今年{age}了".format({name:"loogn",age:22})
 *
 */
if (typeof String.prototype.format !== 'function') {
	String.prototype.format = function(args) {
		if (arguments.length === 0)
			return this;

		var re = this;
		if (arguments.length === 1 && typeof args === "object") {
			for (var key in args) {
				if (args[key] != undefined) {
					re = re.replace(new RegExp('({' + key + '})', 'g'), args[key]);
				}
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					re = re.replace(new RegExp('({)' + key + '(})', 'g'), arguments[i]);
				}
			}
		}
		return re;
	}
}
// 取正则查询匹配的次数
if (typeof String.prototype.findCount !== 'function') {
	String.prototype.findCount = function(reg) {
		var count = 0;
		var re = this.replace(reg, function() {
			count++;
		})
		return count;
	}
}

// 特殊方式替换字符串
/*
 * arrs = {name:"loogn",age:22,sex:['man', 'woman']}
 * var result0 = "我是≮name≯，≮sex.0≯，今年≮age≯了".format(arrs)
 *
 */
if (typeof String.prototype.fmt !== 'function') {
	String.prototype.fmt = function(args) {
		if (typeof args !== "object")
			return this;
		var re = this;
		// 特殊标记 ≮([^≮≯]+)≯
		if(/≮([^≮≯]+)≯/g.test(re)) {
			// 子项是数组
			re = re.replace(/≮([\w]+)\.([\d]{1,2})≯/g, function(m, m1, m2){
				return args[m1][m2] || m
			})
			// 子项
			re = re.replace(/≮([\w]+)≯/g, function(m, m1){
				return (typeof args[m1] === "array") ? args[m1].join('') : args[m1] || m
			})
		}
		return re;
	}
}
