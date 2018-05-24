/**
 * 
 *   基于bootstrap模态窗口实现内容动态添加(不用单独书写一堆静态代码)
 *   1. 添加组件input, select, textarea
 *   2. 根据提供json数据初始化组件值（根据key->组件name属性）
 *   3. 确定（confirm） or 取消（cancle）绑定回调函数用于实现业务逻辑
 * 
 * @author YuShengqiang
 */
;(function($, undefined) {

	var _setting = {
		show: true,//构造后立即显示		
		afterShow: null,
		afterClose: null,
		afterOk: null,
		afterCancle: null,
		data : [],//组件内容
		domData: [],//内容组件
		style: {
			data: {//数据区域样式
				"max-height": "307px",
				"overflow-y": "auto"
			}
		},
		text: {
			nodata: "无数据",
			title: "弹出面板",
			okbtn: "确定",
			canclebtn: "取消"
		}
	},
	_consts = {
		key: {
			options: "modalform.options"
		},
		className: {
			rootClass: "jquery-modalform",//根样式
			titleClass: "modal-title",//标题样式
			dataClass: "form-group-container",//body内容样式
			dataItemClass: "form-group-item",//表单组件样式
			cancleBtn: "canclebtn",//取消按钮样式
			okBtn: "okbtn"//确定按钮样式
		}
	},
	methods = {
		/**
		 * 清空内容
		 */
		empty: function() {
			return this.each(function() {
				var $this = $(this),
					options = methods.options.apply($this);
				$this.find("." + _consts.className.dataClass).empty().append(options.text.nodata);
			});
		},
		/**
		 * 显示组件
		 */
		show: function() {
			return this.each(function() {
				var $this = $(this),
					options = methods.options.apply($this),
					$modal = $this.children("." + _consts.className.rootClass);
				$modal.modal('show');
				$.isFunction(options.afterShow) && options.afterShow.call($modal);
			});
		},
		/**
		 * 隐藏组件
		 */
		hide: function() {
			return this.each(function() {
				var $this = $(this);
				$this.children("." + _consts.className.rootClass).modal('hide');
			});
		},
		/**
		 * 销毁组件
		 */
		destroy: function() {
			return this.each(function() {
				var $this = $(this),
					options = methods.options.apply($this);
				$this.find("." + _consts.className.rootClass).remove();
			});
		},
		/**
		 * 刷新数据
		 * [
		 *  {
		 *   name: "opwd",
		 *   value: "123456"
		 *  },
		 *  {
		 *   name: "npwd",
		 *   value: "999999"
		 *  },
		 *  {
		 *    name: "typecheckbox",
		 *    value: true or false
		 *  }
		 * ]
		 * }
		 */
		refresh: function(data) {
			return this.each(function() {
				var $this = $(this),
				$form = $this.find("." + _consts.className.dataClass);//form表单
				if (data && data.length) {
					$.each(data, function(idx, itemData) {
						$form.find('[name='+itemData.name+']').val(itemData.value);
					});
				} else {
					$form.find('input,textarea').val('');
				}
			});
		},
		getFormData: function() {
			var $this = $(this),
				$form = $this.find("." + _consts.className.dataClass);//form表单
			return $form.serialize();
		},
		/**
		 * 获取选项
		 * 通常情况下外部不需要调用
		 */
		options: function(options) {
			return options ? this.data(_consts.key.options, options) :
				this.data(_consts.key.options);
		},
		/**
		 * 组件初始化
		 */
		_init: function(s) {
			return this.each(function() {
				var options = $.extend(true, {}, _setting, s),
				$this = $(this);
				methods.options.call($this, options);
				methods.destroy.call($this);
				methods._createDom.call($this);
				options.show && methods.show.call($this);
			});
		},
		/**
		[
		    {
		    	label: "旧密码",
		        type: "text",
		        name: "opwd"
		    },
		    {
		    	label: "新密码",
		        type: "text",
		        name: "npwd"
		    }
		]
		 */
		_addDataDom: function(domData) {
			var $this = $(this),
				options = methods.options.apply($this),
				$form = $this.find("." + _consts.className.dataClass).empty();//form表单
			if (domData && domData.length) {
				$.each(domData, function(idx, rowData) {
					var type = rowData.type,
			        label = rowData.label,
			        name = rowData.name;
					
					/** text,password,hidden, textarea, select, checkbox */
					var fiId = 'item-' + Math.random();
					if('text' === type || 'password' === type || 'hidden' === type) {
						var dCls = '';
						if('hidden' === type) {
							dCls = " hidden";
						}
					  var $dom = '<div class="form-group'+dCls+'">'+
			          '  <label for="'+fiId+'" class="control-label">'+label+':</label>'+
			          '  <input type="'+type+'" class="form-control" id="'+fiId+'" name="'+name+'" />'+
			          '</div>';
					  $form.append($($dom));
						
					} else if('textarea' == type) {
						var $dom = '<div class="form-group">'+
				          '  <label for="'+fiId+'" class="control-label">'+label+':</label>'+
				          '  <textarea class="form-control" id="'+fiId+'" name="'+name+'"></textarea>'+
				          '</div>';
						$form.append($($dom));
						
					} else if('select' == type) {
						var $dom = '<div class="form-group">'+
				          '  <label for="'+fiId+'" class="control-label">'+label+':</label>'+
				          '  <select class="form-control" id="'+fiId+'" name="'+name+'"></select>'+
				          '</div>';
						$form.append($($dom));
						
					} else if('checkbox' == type) {
						var $dom = '<div class="form-group">'+
				          '  <label for="'+fiId+'" class="control-label">'+label+':</label>'+
				          '  <input type="checkbox" class="form-control" id="'+fiId+'" name="'+name+'" />'+
				          '</div>';
						$form.append($($dom));						
						
					} else {
						console.log('unsupport type: ' + type);
					}
				});
			} else {
				$form.append(options.text.nodata);
			}
		},
		/**
		 * 创建DOM，并注册事件
		 */
		_createDom: function() {
			var labelId = 'ml-' + Math.random();
			var $this = $(this),
				options = methods.options.apply($this),
				$modal = $('<div class="modal fade ' + _consts.className.rootClass + '" tabindex="-1" role="dialog" aria-labelledby="'+labelId+'">' +
						'<div class="modal-dialog">' +
							'<div class="modal-content">' +
								'<div class="modal-header">' +
									'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
									'<h4 class="' + _consts.className.titleClass + '" id="'+labelId+'"></h4>' +
								'</div>' +
								'<div class="modal-body">' +
								'</div>' +
								'<div class="modal-footer">' +
									'<button type="button" class="btn btn-primary ' + _consts.className.okBtn + '">确定</button>' +
									'<button type="button" class="btn btn-default ' + _consts.className.cancleBtn + '" data-dismiss="modal">取消</button>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>')
					.appendTo($this)
					.modal({ show: false });
			
			/** 此事件在模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发。*/
			$modal.on("hidden.bs.modal", function() {
				if ($.isFunction(options.afterClose)) {
					options.afterClose.call($modal);
				}
			});
			
			//数据区域
			$("<form/>").addClass(_consts.className.dataClass)
				.css(options.style.data)
				.appendTo($modal.find(".modal-body"))
				.append(options.text.nodata);
			
			/** 设置ok按钮 显示文字 */
			if (options.text.okbtn) {
				$modal.find(".modal-footer").find("." + _consts.className.okBtn).text(options.text.okbtn);
			}
			
			/** 设置cancle按钮 显示文字 */
			if (options.text.canclebtn) {
				$modal.find(".modal-footer").find("." + _consts.className.cancleBtn).text(options.text.canclebtn);
			}
			
			/** 设置标题 */
			$modal.find("." + _consts.className.titleClass).text(options.text.title);
			
			/** 加载表单dom及组件值 */
			methods._addDataDom.call($this, options.domData);
			methods.refresh.call($this,options.data);
			
			/** ok按钮点击事件 */
			$modal.find("." + _consts.className.okBtn)
				.on("click", function() {
					if ($.isFunction(options.afterOk)) {
						var retData = methods.getFormData.call($modal);
						options.afterOk.call($modal, retData);
					}
				});
			
			/** cancle按钮点击事件 */
			$modal.find("." + _consts.className.cancleBtn)
			.on("click", function() {
				if ($.isFunction(options.afterCancle)) {
					options.afterCancle.call($modal);
				}
			});
			
		}
	};

	$.fn.extend({
		modalform: function() {
			var m = arguments[0];
			if ( methods[m] ) {
				return methods[m].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if ( $.type(m) === "object" || !m ) {
				return methods._init.apply(this, arguments);
			} else {
				$.error("Method " + m + " does not exist in jquery.modalform.");
				return this;
			}
		}
	});

})(jQuery);