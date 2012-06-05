/* ==========================================================
* lgx_slideshow.js v0.1
* ==========================================================
* Copyright (C) 2012 Loic Ginoux

* Permission is hereby granted, free of charge, to any person 
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, 
* including without limitation the rights to use, copy, modify,
* merge, publish, distribute, sublicense, and/or sell copies 
* of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
* ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* ========================================================== 
*
* Depends:
* jquery-1.7.x.min.js
Please use //ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js


*/

// How to use
/*
$(document).ready(function() {
	$("#imagesContainer").event_slideshow()
	
});
*/
//COMMUNICATION API WITH SERVER
/*
==== Get the first 4 items ====
ajax_call_data = {
	action: "last_events",
	numberEvents: 4
}

response = {
	events:[{
		id: 2134,
		src: "images/breakfast.jpg",
		alt: "photo1",
		title: "my title",
		date: now.Date(),
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
		last:true, //optional if this is the last event of all existing events
		first: true //optional if this is the first event of all existing events
	},
	{
		id: 2134,
		src: "images/breakfast.jpg",
		alt: "photo1",
		title: "my title",
		date: yesterday.Date(),
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
	}]
}

==== Get a single event ====
ajax_call_data = {
	action: "single_event",
	id_event: 123
	type: "previous" // or "next"
}

response = {
	events:[{
		id: 2134,
		src: "images/breakfast.jpg",
		alt: "photo1",
		title: "my title",
		date: now.Date(),
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
	}]
}

*/
Function.prototype.bind = function(){ 
  var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift(); 
  return function(){ 
    return fn.apply(object, 
      args.concat(Array.prototype.slice.call(arguments))); 
  }; 
};


!function ($) {

 /* SLIDESHOW CLASS DEFINITION
  * ========================= */
	var Event_slideshow = function (element, options) {
		this.$element = $(element)
		this.options = options
		this.init()
	}

	Event_slideshow.prototype = {
		
		// events is an array of json events
		init: function(events){
			var that = this;
			//this.init_with_dummy();
			this.$element.html(this.slideshowTemplate());

			this.imagesContainer = this.$element.find('.images .scrollableArea');
			this.infoDisplay = this.$element.find('.infoDisplay');
			this.prevBtn = this.$element.find('.prev');
			this.nextBtn = this.$element.find('.next');
			
			this.getEvents({
				action: "last_events",
				success: this.buildEvents.bind(this)
			});
			//attach javascript events
			this.$element.delegate('.prev', 'click', this.prev.bind(this));
			this.$element.delegate('.next', 'click', this.next.bind(this));
			this.$element.delegate('.images img', 'click', this.showInfo.bind(this));
		}
		
		/*param can be:{
			action: "last_events" // or "single_event",
			date: date,
			type: "previous" // or "next",
			success: function(){}
		}
		*/
		, getEvents: function(param){
			data = {};
			data.action = param.action;
			if (param.action == "last_items"){
				data.numberEvents = this.option.numberEvents
			}else if(param.action == "single_item"){
				data.type = param.type;
				data.type = param.date;
			}

			response = {
				events:[{
					id: 1,
					src: "images/image_example.png",
					alt: "photo1",
					title: "title1",
					date: "sdfb",
					description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
					last:true
				},
				{
					id: 2,
					src: "images/image_example2.png",
					alt: "photo1",
					title: "my title 2",
					date: "sdfb",
					description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
				},
				{
					id: 3,
					src: "images/image_example3.png",
					alt: "photo1",
					title: "my title 3",
					date: "sdfb",
					description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
				},
				{
					id: 4,
					src: "images/image_example4.png",
					alt: "photo1",
					title: "my title 4",
					date: "sdfb",
					description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
				},
				{
					id: 4,
					src: "images/image_example.png",
					alt: "photo1",
					title: "my title 4",
					date: "sdfb",
					description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
				}	,
					{
						id: 4,
						src: "images/image_example.png",
						alt: "photo1",
						title: "my title 4",
						date: "sdfb",
						description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
					}
				]
			}
			param.success(response)
			// return $.ajax({
			// 				url: this.option.server_url,
			// 				data: data,
			// 				success: param.success,
			// 				dataType: "json"
			// 			});
		}
		
		, buildEvents: function(data){
			this.events = data.events;
			for (var i=0, len = data.events.length; i < len; i++) {
				this.buildEvent(data.events[i], "prev");
			}
		}
		
		//pos can be "prev", "next" or "loading"
		, buildEvent: function(data, pos){
			//get html
			html = this.eventTemplate(data);
			if (pos == "prev") {
				this.imagesContainer.prepend(html);
				this.first_display_event = data.date;
			} else if(pos == "next"){
				this.imagesContainer.append(html);
				this.last_display_event = data.date;
			}
			data.last
			if (data.first) {
				this.prevBtn.addClass('hide')
			}
			if (data.last) {
				this.nextBtn.addClass('hide')
			}
		}
		
		, next: function (e) {
			if (this.sliding) return
			debugger
			this.slide('next');
			response = {
				events:[{
					id: 4,
					src: "images/image_example2.png",
					alt: "photo1",
					title: "my title 4",
					date: "sdfb",
					description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
				}]
			}
			this.replaceLoadingEvent(response)
			// this.getEvents({
			// 	action: "single_event",
			// 	date: this.last_display_event.date,
			// 	type: "next",
			// 	success: this.replaceLoadingEvent.bind(this)
			// })
		}

		, prev: function (e) {
			if (this.sliding) return
			this.slide('prev');	
			response = {
				events:[{
					id: 4,
					src: "images/image_example4.png",
					alt: "photo1",
					title: "my title 4",
					date: "sdfb",
					description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer"
				}]
			}
			this.replaceLoadingEvent(response)		
			// this.getEvents({
			// 				action: "single_event",
			// 				date: this.first_display_event.date,
			// 				type: "prev",
			// 				success: this.replaceLoadingEvent.bind(this)
			// 			})
		}
		

		, replaceLoadingEvent: function(data){
			//replace loading event by the real one
			data = data.events[0];
			loadingEvent = this.imagesContainer.find("img.loading")
				.removeClass("loading");
			loadingEvent.attr("src", data.src);
			loadingEvent.attr("alt", data.alt);
			loadingEvent.attr("class", data.className);
			loadingEvent.attr("data-id", data.id);
			loadingEvent.attr("data-date", data.date);
			(loadingEvent.index == 0)? this.first_display_event = data : this.last_display_event = data;
			// if needed remove the last or prev button	
			if (data.first) {
				this.prevBtn.addClass('hide')
			}
			if (data.last) {
				this.nextBtn.addClass('hide')
			}
		}
		
		// type is "prev" or "next"
		, slide: function (type) {
			// build loading event
			this.buildEvent(this.options.loading_event, type)
			// slide all images 
			
			if (type == "prev") {
				this.nextBtn.removeClass('hide')
				this.imagesContainer.children(":last").remove()
			}
			if (type == "next") {
				this.prevBtn.removeClass('hide')
				this.imagesContainer.children(":first").remove()
			}

		}
		
		
		, showInfo: function(e){
			var img = $(e.currentTarget)
				, id = img.attr('data-id');
			this.imagesContainer.find('img').removeClass('active');
			img.addClass("active");
			for (var i=0, len = this.events.length; i < len; i++) {
				var event = this.events[i]
					,tmpId =  event.id;				
				if (tmpId == id) break;
			}
			
			html = this.infoTemplate(event)
			this.infoDisplay.empty().html(html)
			//get id
			//get event data
			//build html
			//append
			//build javascript events 
		}

		, eventTemplate: function(data){
			data = $.extend({src:"", alt: "", className: "", id:0}, data);
			html_img = '<img src="'+data.src+'" alt="'+data.alt+'" class="'+data.className+'" data-date="'+data.date+'" data-id="'+data.id+'"/>';
			return html_img
		}
		
		, infoTemplate: function(data){
			data = $.extend({title:"", desc: ""}, data);
			html_info ='\
				<p class="title">'+data.title+'</p>\
				<p class="desc">'+data.description+'</p>'
			return html_info
		}
		, slideshowTemplate: function(){
			html = '\
			<div id="lgx_slideshow">\
				<div class="images">\
					<div class="scrollableArea"></div>\
				</div>\
				<a class="slideshow-control prev" href="#myCarousel" data-slide="prev">&lsaquo;</a>\
				<a class="slideshow-control next" href="#myCarousel" data-slide="next">&rsaquo;</a>\
				<div class="infoDisplay" class=""></div>\
			</div>\
			';
			return html
		}
		
	}

		/* EVENT SLIDESHOW PLUGIN DEFINITION
		* ========================== */

		$.fn.event_slideshow = function (option) {
			return this.each(function () {
				var $this = $(this)
				, data = $this.data('event_slideshow')
				, options = $.extend({}, $.fn.event_slideshow.defaults, typeof option == 'object' && option)
				if (!data) $this.data('event_slideshow', (data = new Event_slideshow(this, options)))
			})
		}

		$.fn.event_slideshow.defaults = {
			numberEvents: 4,
			server_url: "",
			loading_event: {
				src: "images/loading.gif",
				alt: "loading new event",
				className:" loading ",
				date: ""
			}
		};

		$.fn.event_slideshow.Constructor = Event_slideshow



		}(window.jQuery);