;(function ($, window) {
	"use strict";

	var guid = 0,
		userAgent = (window.navigator.userAgent||window.navigator.vendor||window.opera),
		isFirefox = /Firefox/i.test(userAgent),
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgent),
		isFirefoxMobile = (isFirefox && isMobile),
		$body = null;

	/**
	 * @options
	 * @param callback [function] <$.noop> "Select item callback"
	 * @param customClass [string] <''> "Class applied to instance"
	 */
	var options = {
		callback: $.noop,
		customClass: "",
		preserveClasses: false
	};

	var pub = {

		/**
		 * @method
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $.stacker("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
			return $(this);
		}
	};

	/**
	 * @method private
	 * @name _init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function _init(opts) {
		// Local options
		opts = $.extend({}, options, opts || {});

		// Check for Body
		if ($body === null) {
			$body = $("body");
		}

		// Apply to each element
		var $items = $(this);
		for (var i = 0, count = $items.length; i < count; i++) {
			_build($items.eq(i), opts);
		}
		return $items;
	}

	/**
	 * @method private
	 * @name _build
	 * @description Builds each instance
	 * @param $select [jQuery object] "Target jQuery object"
	 * @param opts [object] <{}> "Options object"
	 */
	function _build($table, opts) {
		if ($table.is("table")) {
			
			// EXTEND OPTIONS
			opts = $.extend({}, opts, $table.data("stacker-options"));
			
			var labels = [],
				$tableCaption = $table.find("caption"),
				$tableHeader = $table.find("thead"),
				$tableHeaderLabels = $tableHeader.find("th"),
				$tableHeaderColumns = false,
				$tableRows = $table.find("tbody tr");
			
			// Look for <td> in <thead> if there are no <th>
			if (!$tableHeaderLabels.length) {
				$tableHeaderColumns = $tableHeader.find("td");
				$tableHeaderLabels = $tableHeaderColumns;
			}
			
			$tableHeaderLabels.each(function(index) {
				labels.push($(this).html());
			});
			
			// Create new table
			var $stackerTable,
			    tableContent = '';
				
			tableContent += '<table ';
			
			// Amend id
			if ($table.attr("id")) {
				tableContent += 'id="stacker-' + $table.attr("id") + '" ';
			}
			
			tableContent += 'class="stacker stacker-table '+ opts.customClass;
			if (opts.preserveClasses) {
				tableContent += ' '+ $table.attr("class");
			}
			tableContent += '">';
			
			// Preserve Caption
			if ($tableCaption.length) {
				tableContent += '<caption';
				if (opts.preserveClasses && $tableCaption.attr("class")) {
					tableContent += ' class="'+ $tableCaption.attr("class") +'"';
				}
				tableContent += '>' + $tableCaption.html() + '</caption>';
			}
			
			tableContent += '<tbody>';
			
			// Rows
			for (var i = 0, rowCount = $tableRows.length; i < rowCount; i++) {
				
				var $row        = $tableRows.eq(i),
				    $rowColumns = $row.find("td");
				
				tableContent += '<tr><td><table>';
				
				// First row becomes table header
				tableContent += '<thead><th';
				if (opts.preserveClasses && $rowColumns.eq(0).attr("class")) {
					tableContent += ' class="'+ $rowColumns.eq(0).attr("class") +'"';
				}
				tableContent += '>';
				tableContent += labels[0];
				tableContent += '</th><th';
				if (opts.preserveClasses && $rowColumns.eq(0).attr("class")) {
					tableContent += ' class="'+ $rowColumns.eq(0).attr("class") +'"';
				}
				tableContent += '>';
				tableContent += $rowColumns.eq(0).html();
				tableContent += '</th></thead>';
				
				// Begin table body with remaining rows
				tableContent += '<tbody>';
				
				for (var j = 1, colCount = $rowColumns.length; j < colCount; j++) {
					tableContent += '<tr><td';
					if (opts.preserveClasses && $rowColumns.eq(j).attr("class")) {
						tableContent += ' class="'+ $rowColumns.eq(j).attr("class") +'"';
					}
					tableContent += '>';
					tableContent += labels[j];
					tableContent += '</td><td';
					if (opts.preserveClasses && $rowColumns.eq(j).attr("class")) {
						tableContent += ' class="'+ $rowColumns.eq(j).attr("class") +'"';
					}
					tableContent += '>';
					tableContent += $rowColumns.eq(j).html();
					tableContent += '</td></tr>';
				}
				
				tableContent += '</tbody></table></td></tr>';
			}
			
			tableContent += '</tbody></table>';
			
			// Modify DOM
			$table.addClass("stacker stacker-original")
			      .after(tableContent);
		}
	}

	$.fn.stacker = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};

	$.stacker = function(method) {
		if (method === "defaults") {
			pub.defaults.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};
})(jQuery, window);