;
(function($) {
    function cityList(em, config) {
        this.config = {
            showLetter: true,
            showSearch: true,
            callBack: ''
        };
        this.em = $(em);
        if (config && $.isPlainObject(config)) {
            $.extend(this.config, config);
        }
        this.init();
    }
    cityList.prototype.init = function() {
        this.wrapper = $('<div class="cityPickerWrapper"></div>');
        this.picker = $('<div class="cityPicker"></div>');
        this.showLetter = $('<div id="showLetter" class="showLetter"><span>A</span></div>');
        this.letter = $('<ul class="letter" id="letterList"></ul>');
        this.cityContainer = $('<div class="container"></div>');
        this.cityListWrap = $('<div class="cityList-wrap"></div>');
        this.cityHeader = $('<div class="city-header">' +
            '<div id= "backPage" class="iconfont icon-fanhui"></div>' +
            '<input type="text" class="input-search" placeholder="北京"><span class="cancel">取消</span>' +
            '</div>');
        this.cityTop = $('<div class="city-top"></div>');
        this.location = $('<div class="city-location">' +
            '<h3>定位</h3>' +
            '</div>');
        this.locationCity = $('<div class="city"></div>');
        this.hotCity = $('<div class="hot-city">' +
            '<h3>热门城市</h3>' +
            '<ul></ul></div>');
        this.letterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];
        this.mask = $('<div class="mask"></div>');
        this.create();
        this.bindEvent();
    }
    cityList.prototype.create = function() {
        var picker = this.picker,
            wrapper = this.wrapper,
            showLetter = this.showLetter,
            letter = this.letter,
            container = this.cityContainer,
            letterList = this.letterList,
            body = $('body');

        picker.append(showLetter);

        var letterListHtml = '';
        letterList.forEach(function(e) {
            letterListHtml += '<li><a href="javascript:;">' + e + '</a></li>';
        });
        letter.append(letterListHtml);
        picker.append(letter);

        var cityHtml = '<div class="citys">';
        cityData.forEach(function(e) {
            var l = e[0].code;
            cityHtml += '<div class="city-list">';
            cityHtml += '<span class="city-letter" id="' + l + '">' + l + '</span>';
            e.forEach(function(e2) {
                cityHtml += '<p data-id="' + e2.id + '">' + e2.name + '</p>';
            })
            cityHtml += '</div>';
        })
        cityHtml += '</div>';

        if (this.config.location) {
            this.cityTop.show();
            this.location.append(this.locationCity);
            this.cityTop.append(this.location);
        }

        if (this.config.hotCity) {
            this.cityTop.show();
            this.cityTop.append(this.hotCity);
        }

        container.append(this.cityHeader);
        this.cityListWrap.append(this.cityTop);
        this.cityListWrap.append(cityHtml);
        container.append(this.cityListWrap);
        picker.append(container);
        wrapper.append(picker).append(this.mask);
        body.append(wrapper);
    }
    cityList.prototype.bindEvent = function() {
        var that = this;
        $('body').on('click', '.letter li', function() {
            var s = $(this).find('a').html();
            var h = $('#' + s).position().top;

            $('.cityPicker').animate({ scrollTop: h }, 0);
            $('#showLetter').find('span').html(s);
            if (that.config.showLetter == true) {
                console.log(2)
                $('#showLetter').show().delay(500).hide(0);
            }
        })
        this.em.click(function() {
            $('.cityPickerWrapper').show();
        })
        $('body').on('click', 'p', function() {
            if (that.config.callBack) {
                var code = $(this).data('id');
                var city = $(this).html();
                that.config.callBack(city, code);
                that.wrapper.hide();
            }
        })
        $('#backPage').click(function() {
            that.wrapper.hide();
        })
        var letterList = $('#letterList');

        // 获取每一个字母的高度
        var lis = letterList.find('li');
        var h = (window.screen.availHeight - 90) / lis.length;
        // lis.css('line-height', h + 'px');
        var head = 90;
        var arr = [];

        lis.each(function(i, e) {
            arr[i] = {};
            arr[i].name = $(this).find('a').html();

            arr[i].h1 = h * i + head;
            arr[i].h2 = h * (i + 1) + head;
        })

        var letterList = document.getElementById('letterList');
        letterList.addEventListener('touchmove', function(e) {
            e.stopPropagation();

            var y = event.touches[0].pageY;
            if (y < head) {
                return;
            }
            var s = '';
            arr.forEach(function(e) {
                if (y >= e.h1 && y <= e.h2) {
                    s = e.name;
                }
            })
            var h = $('#' + s).position().top;
            $('.cityPicker').animate({ scrollTop: h }, 0)
            $("#showLetter span").html(s);
            $("#showLetter").show();
        }, false);

        letterList.addEventListener('touchend', function() {
            $("#showLetter").hide();
        }, false);

        this.cityHeader.find('input').focus(function(e) {
            e.preventDefault();
            that.mask.show();
            that.cityHeader.addClass('active');
        });

        this.cityHeader.find('input').blur(function(e) {
            e.preventDefault();
            that.mask.hide();
            that.cityHeader.removeClass('active');
        });
    }
    $.fn.extend({
        cityList: function(config) {
            return this.each(function() {
                return new cityList(this, config);
            });
        }
    })
})(jQuery);