$(document).ready(function(){
	// Progressive loading of HD background image
	$('html').addClass('html-background-progressivest');

	// Initalize model default
	var app = {
		config: {
			// DEBUG ONLY
			/*
			door: 1,
			message: 'Webshopunk még készülőben van, <br/> termékeink azonban már így is elérhetőek.',
			newsletter: 'https://forms.gle/vRQbmHNreXz8vjnz5',
			password: 'titok',
			order: 'https://google.com',
			ps: '<b>Lorem Ipsum!</b> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. '
			*/
		}
	};
	app.ready = $.Deferred();

	// Initialize model per dynamic configuration
	$.when(
		$.ajax('adat/ajto.txt'),
		$.ajax('adat/uzenet.html'),
		$.ajax('adat/hirlevel.txt'),
		$.ajax('adat/jelszo.txt'),
		$.ajax('adat/megrendelo.txt'),
		$.ajax('adat/utoirat.html')
		).done(function (door, message, newsletter, password, order, ps) {
			app.config.door = $.trim(door[0]);
			app.config.message = $.trim(message[0]);
			app.config.newsletter = $.trim(newsletter[0]);
			app.config.password = $.trim(password[0]);
			app.config.order = $.trim(order[0]);
			app.config.ps = $.trim(ps[0]);
		}).always(function () {
			app.ready.resolve();
	});

	// Initialize controller
	$.when(app.ready).done(function() {
		if (app.config.door == '1') {
			$('html').addClass('linkPointer');
			$('#popup').addClass('defaultPointer');

			$('#message').html(app.config.message);
			$('#ps').html(app.config.ps);
			if (app.config.newsletter) {
				$('#newsletter').attr('href', app.config.newsletter);
			} else {
				$('#newsletter').parent().hide();
			}
			if (app.config.order) {
				if (app.config.password) {
					var unlocked = false;
					$('#order').on('click', function(){
						if (unlocked) return true;
						var response = $.trim(prompt('Jelszóval védett, csak tagoknak! Members only.'));
						if (response === app.config.password) {
							$('#order').attr('href', app.config.order);
							unlocked = true;
							$('#order')[0].click();
						} else {
							alert('Sajnos ez nem az a jelszó.');
						}
						return false;
					});
				} else {
					$('#order').attr('href', app.config.order);
				}
			} else {
				$('#order').parent().hide();
			}

			$('html').on('click', function() {
				$('#popup').dialog('open');
			});
			var state = null;
			$(window).on('resize', function() {
				$('#popup').dialog('close');
				clearTimeout(state);
				state = setTimeout(function() {
					$('#popup').dialog('open', 'position', {my: 'center', at: 'center', of: window});
				}, 500);
			});
			// Auto open
			setTimeout(function() {
				$('#popup').dialog('open');
			}, 500);
		}
	});

	// Initialize the view
	$('#popup').dialog({
		autoOpen: false,
		dialogClass: 'noTitle',
		minWidth: 350,
		model: true,
		resizable: false,
		hide: 'scale',
		show: {effect: 'fade', duration: 800}
	});
});
