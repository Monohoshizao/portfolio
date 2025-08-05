$(function () {
	// ページ内スクロール
	var headH = $("header").outerHeight();
	var animeSpeed = 500;
	$("a[href^='#']").on({
		click: function () {
			var href = $(this).attr("href");
			var target = $(href == "#" || href === "" ? "html" : href);
			var position;
			position = target.offset().top - headH;
			$("body,html").stop().animate({
					scrollTop: position,
				},
				animeSpeed
			);
			return false;
		},
	});

	// ハンバーガーメニュー
	$(".hamburger").click(function () {
		$(this).toggleClass("active");
		$(".nav").toggleClass("active");
	});

	var state = false;
	var pos;
	$(".hamburger").click(function () {
		if (state == false) {
			pos = $(window).scrollTop();
			$("body").addClass("fixed");
			state = true;
		} else {
			$("body").removeClass("fixed").css({
				top: 0
			});
			window.scrollTo(0, pos);
			state = false;
		}
	});

	$(".nav a").click(function () {
		$(".nav").removeClass("active");
		$(".hamburger").removeClass("active");
		$("body").removeClass("fixed").css({
			top: 0
		});
		window.scrollTo(0, pos);
		state = false;
	});

	// MV
	if (!localStorage.getItem('visited')) {
		$('body').addClass('fixed');
		localStorage.setItem('visited', 'true');
		setTimeout(() => {
			$('.mv .deco01').addClass('mv_fade');
		}, 500);
		setTimeout(() => {
			$('.mv .deco02').addClass('mv_fade');
		}, 1500);
		setTimeout(() => {
			$('.mv .txt, .mv .img').addClass('mv_fade');
		}, 2500);
		setTimeout(() => {
			$('body').removeClass('fixed');
		}, 3500);
	} else {
		$('.mv .deco01, .mv .deco02, .mv .txt, .mv .img').css('opacity', 1);
	}

	// 画面の中央に来たら
	function isInCenter(element) {
		const windowHeight = $(window).height();
		const scrollTop = $(window).scrollTop();
		const offsetTop = element.offset().top;
		const elementHeight = element.outerHeight();
		const elementCenter = offsetTop + elementHeight / 2;
		const viewportCenter = scrollTop + windowHeight / 2;

		return Math.abs(viewportCenter - elementCenter) < elementHeight / 2;
	}

	// フェード
	$(window).on('scroll', function () {
		$('.fade_target').each(function () {
			const $this = $(this);
			if (isInCenter($this)) {
				$this.addClass('is-in-view');
			}
		});
	});

	// スキル
	$(window).on('scroll', function () {
		$('.skill_item').each(function () {
			const $item = $(this);
			if (!$item.hasClass('animated') && isInCenter($item)) {
				const $bar = $item.find('.meter span');
				const $label = $item.find('> span');
				const percent = parseInt($bar.data('percent'));

				$bar.css('width', percent + '%');

				let count = 0;
				const interval = setInterval(function () {
					if (count >= percent) {
						clearInterval(interval);
					} else {
						count++;
						$label.text(count + '%');
					}
				}, 700 / percent);

				$item.addClass('animated');
			}
		});
	});

	// 制作実績
	$(window).on('scroll', function () {
		const section = $('.works_cont');
		const items = $('.works_item');

		if (items.length && isInCenter(section) && !section.hasClass('shown')) {
			section.addClass('shown');

			items.each(function (i) {
				const that = $(this);
				setTimeout(function () {
					that.addClass('is-in-view');
				}, i * 200);
			});
		}
	});
});