var IMG_PATH = './img/';

var initSetting = function(elem) {

	return JSON.parse(localStorage.getItem(elem));

}

var initLocales = function() {

	if (typeof localStorage.locales === 'undefined') {
		var locales = [
			{
				icon: 'sleep.svg',
				locale: 'Los Angeles',
				active: true
			},
			{
				icon: 'sleep.svg',
				locale: 'Winnipeg',
				active: false
			}
		];
		localStorage.setItem('locales', JSON.stringify(locales));
	}
	return JSON.parse(localStorage.getItem('locales'));

},

getActiveLocale = function() {

	var locale = '',
			locales = JSON.parse(localStorage.getItem('locales'));
	locales.forEach(function(item, index) {
		if (item.active)
			locale = item.locale;
	});
	return locale;

},

updateLocalesStorage = function (locale, icon) {

	for (var i = 0; i < vaside.locales.length; i++) {
		vaside.locales[i].active = false;
		vaside.locales[i].locale = vaside.locales[i].locale.toLowerCase();
		vaside.locales[i].locale = vaside.locales[i].locale.trim()
		locale = locale.toLowerCase();
		locale = locale.trim();
		if (vaside.locales[i].locale === locale) {
			vaside.locales[i].icon = icon.replace('.svg', '.png');
			vaside.locales[i].active = true;
		}
		vaside.locales[i].locale = properCase(vaside.locales[i].locale);
	}
	localStorage.setItem('locales', JSON.stringify(vaside.locales));

},

deleteLocale = function(item) {

	var index, activeName = '';
	for (var i = 0; i < vaside.locales.length; i++) {
		if (vaside.locales[i].locale === item) {
			index = i;
			if (vaside.locales[i].active) {
				vaside.locales[0].active = true;
				activeName = vaside.locales[0].locale;
			}
		} else {
			if (vaside.locales[i].active)
				activeName = vaside.locales[i].locale;
		}
	}
	vaside.locales.splice(index, 1);
	localStorage.setItem('locales', JSON.stringify(vaside.locales));
	return activeName;

},

toggleAdd = function() {
	var $btnaddtitle = document.querySelector(".btn-add--title"),
			$add = document.querySelector(".add");
	if ($btnaddtitle.textContent ==="CANCEL") {
		$btnaddtitle.textContent = "ADD LOCATION";
		$add.classList.remove('add--active');
		window.dispatchEvent(new Event('resize'));
	} else {
		$btnaddtitle.textContent = "CANCEL";
		$add.classList.add('add--active');
		return true;
	}
	return false;
},

addLocaleData = function(item) {
	for (var i = 0; i < vaside.locales.length; i++) {
		if (item.locale === vaside.locales[i].locale)
			return;
		vaside.locales[i].active = false;
	}
	vaside.locales.push(item);
	localStorage.setItem('locales', JSON.stringify(vaside.locales));
};


var vaside = new Vue({

	el: '#aside',
	data: {
		locales: {},
		error: false,
		errormsg: '',
		settings: false,
		celsius: true,
		metric: true
	},
	methods: {

		cancel: function(trigger) {

			if (trigger !== 'cancel') return;
			vmain.populateMain(vmain);
			toggleAdd();
			window.dispatchEvent(new Event('resize'));

		},

		selectLocale: function(trigger) {

			if (trigger !== 'select') return;
			var locName = event.srcElement.attributes.data.nodeValue;
			vmain.name = locName;
			vmain.populateMain(vmain);
			window.dispatchEvent(new Event('resize'));
		},

		addActivateAdd: function() {

			if (toggleAdd()) return;
			this.cancel('cancel');
			vaside.$refs.addInput.value = '';

		},

		addLocale: function(trigger) {

			if (trigger !== 'add') return;
			var localeName = this.$refs.addInput.value;
			vmain.name = localeName;
			vmain.active = false;
			vmain.populateMain(vmain, 'add');
			vmain.name = vmain.location.locale;

		},

		removeLocale: function(trigger) {

			if (trigger !== 'remove') return;
			var node = deleteLocale(event.srcElement.attributes.data.nodeValue);
			vmain.name = node;
			if ( vmain.name !== '') {
				vmain.active = false;
				vmain.populateMain(vmain);
			}

		},

		updateCelsius: function(e) {

			this.celsius = !this.celsius;
			vmain.celsius = this.celsius;
			localStorage.setItem('celsius', JSON.stringify(this.celsius));
			return this.celsius

		},

		updateMetric: function(e) {

			this.metric = !this.metric;
			vmain.metric = this.metric;
			localStorage.setItem('metric', JSON.stringify(this.metric));
			return this.metric;
		},

		resetStorage: function(trigger) {

			if (trigger !== 'reset') return;
			localStorage.clear();
			this.locales = initLocales();
			this.celsius = initSetting('celsius');
			vmain.celsius = this.celsius;
			this.metric = initSetting('metric');
			vmain.metric = this.metric;
			this.settings = !this.settings;
			vmain.name = getActiveLocale();
			vmain.populateMain(vmain);
			window.dispatchEvent(new Event('resize'));
			document.getElementById('aside-wrap').style.width = '80%';
		},

		config: function(trigger) {

			if (trigger !== 'config') return;
			document.getElementById('aside-wrap').style.width = '80%';
			this.settings = !this.settings;
			window.dispatchEvent(new Event('resize'));

		}

	},
 
	created: function(e) {

		this.locales = initLocales();
		this.celsius = initSetting('celsius');
		this.metric = initSetting('metric');

	}

});

var vmain = new Vue({

	el: '#main',
	data: {
		active: false,
		wait: true,
		name: '',
		location: {
			country: '',
			localtime: '',
			locale: ''
		},
		current: {
			temp_c: 0,
			temp_f: 0,
			condition: {
				icon: '',
				text: ''
			}
		},
		forecast: [],
		celsius: true,
		metric: true
	},

	created: function(e) {

		this.name = getActiveLocale();
		this.celsius = vaside.celsius;
		this.metric = vaside.metric;

	},

	mounted: function(e) {

		this.populateMain(this);

	},

	methods: {
		populateMain: function(app, action) {
			//fetch('./data/sample.json')
			fetch(endpoint+apikey+'&q='+this.name+'&days=7')
			  .then(
			    function(res) {
			      res.json().then(function(data) {

			      	if(res.status === 200) {

								vaside.error = false;
								app.location.country = data.location.region + (data.location.region === '' ? '' : ', ')+data.location.country;
								app.location.country = (app.location.country).replace('of America', '');
								app.location.localtime = dateParse(data.location.localtime);
								app.location.locale = data.location.name;
								app.name = data.location.name;

								app.current.temp_c = Math.round(data.current.temp_c);
								app.current.temp_f = Math.round(data.current.temp_f);
								app.current.condition.icon = fileExist(iconParse(data.current.condition.icon).replace('.png', ''));
								app.current.condition.text = data.current.condition.text;

								app.forecast = [];
								data.forecast.forecastday.forEach(function(item, index) {
									if (index > 0) {
										app.forecast.push(
											{
												date: dateParse(item.date, 3),
												condition: {
													icon: iconParse(data.forecast.forecastday[index].day.condition.icon)
												},
												maxtemp_c: Math.round(data.forecast.forecastday[index].day.maxtemp_c)+' °C',
												maxtemp_f: Math.round(data.forecast.forecastday[index].day.maxtemp_f)+' °F'
												}
										);
									}
								});
								updateLocalesStorage(app.location.locale, app.current.condition.icon);
								if (app.wait) {
									setTimeout(function(){}, 100000); // wait for splash
									app.wait = false;
								}
								app.active = true; // turn off loader overlay

			      	} else {

			      		vaside.error = true;
								vaside.errormsg = data.error.message;
								if (data.error.message === 'Parameter q is missing.')
									vaside.errormsg = 'Location parameter is missing.';

			      	}

			      	// 'add'
			  			if (!vaside.error && action === 'add') {
								addLocaleData(
									{
										icon: vmain.current.condition.icon,
										locale: vmain.name,
										active: true
									}
								);
								vaside.$refs.addInput.value = '';
								toggleAdd();
								window.dispatchEvent(new Event('resize'));
							}

			      });
			    }
			  )
			  .catch(function(err) {
			   	// do nothing
			  });

		},

		config: function(trigger) {

			if (trigger !== 'config') return;
			vaside.settings = true;
			document.getElementById('aside-wrap').style.width = '100%';
			this.settings = !this.settings;
			customMouseEvent(document.getElementById("slider"), "mousedown", 10, 20);
			customMouseEvent(document.getElementById("slider"), "mouseup", 10, 20);

		}
	} 

});